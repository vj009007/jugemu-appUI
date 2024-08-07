import { LoginMethod } from "@prisma/client";
import type { Account, AuthOptions, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import prisma from "./prisma";
import GoogleProvider from "next-auth/providers/google";
import { getSubscriptionsWithPaymentByCustomerId } from "../actions/stripe/supscription";

if (
  !process.env.GOOGLE_OAUTH_CLIENT_ID ||
  !process.env.GOOGLE_OAUTH_CLIENT_SECRET
) {
  throw new Error(
    "Please provide GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET in .env.local",
  );
}

// Refs: https://next-auth.js.org/configuration/options
export const customAuthOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      id: "google",
      name: "google",
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({
      token,
      user,
      account,
    }: {
      token: JWT;
      user: User;
      account: Account | null;
    }) {
      if (!user || !account || !user.email || !user.image) return token;

      switch (account.provider) {
        case "google": {
          const currentUser = await findCurrentUser(
            user.email,
            LoginMethod.GOOGLE,
          );
          if (!currentUser) {
            await createUser(
              user.email,
              LoginMethod.GOOGLE,
              token.name ?? "",
              token.sub ?? "",
            );
          }

          token.provider = LoginMethod.GOOGLE;
          token.picture = user.image;
          return token;
        }
        default: {
          throw new Error(
            `JWT error: auth method ${account.provider} is not supported.`,
          );
        }
      }
    },
    async session({ session, token }) {
      const user = await findCurrentUser(
        token.email as string,
        token.provider as LoginMethod,
      );

      if (!user) throw new Error("Session error: user not found in database.");

      session.user.id = user.id.toString();
      session.user.name = user.userName;
      session.user.image = token.picture as string;
      session.user.stripeCustomerId = user.stripeCustomerId;
      session.user.subscriptionStatus = await checkSubscription(user);

      return session;
    },
  },
};

async function findCurrentUser(email: string, loginMethod: LoginMethod) {
  return await prisma.user.findFirst({
    where: {
      AND: { email, loginMethod },
    },
  });
}

async function createUser(
  email: string,
  loginMethod: LoginMethod,
  userName: string,
  externalId: string,
) {
  return await prisma.user.create({
    data: { email, loginMethod, userName, externalId },
  });
}
async function checkSubscription(userInfo: {
  stripeCustomerId: string | null;
}) {
  if (!userInfo.stripeCustomerId) return false;
  const subscriptions = await getSubscriptionsWithPaymentByCustomerId(
    userInfo.stripeCustomerId,
  );

  return subscriptions;
}
