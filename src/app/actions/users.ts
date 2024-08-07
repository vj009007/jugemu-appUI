"use server";

import prisma from "../lib/prisma";
import { getServerSession } from "next-auth";
import { customAuthOptions } from "../lib/customAuthOptions";
import { Prisma, User, StripeSubscriptionStatus} from "@prisma/client";

export async function userInfoUpgrade(
  updateData: Prisma.UserUpdateInput,
): Promise<User> {
  const session = await getServerSession(customAuthOptions);

  if (!session) {
    throw new Error("unauthorized");
  }
  const user = await prisma.user.update({
    where: { id: +session.user.id },
    data: updateData,
  });

  return user;
}

export async function createUserSubscription(
  subscriptionId: string
) {
  const session = await getServerSession(customAuthOptions);

  if (!session) {
    throw new Error("unauthorized");
  }

  const user = await prisma.user.update({
    where: { id: +session.user.id },
    data: {
      subscriptions: {
        create: {
          stripeSubscriptionId: subscriptionId,
          status: StripeSubscriptionStatus.ACTIVE,
        },
      },
    },
  });

  return user;
}