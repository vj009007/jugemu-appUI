import type { DefaultSession, DefaultUser } from "next-auth";
import { User } from "@prisma/client";

// refs: https://next-auth.js.org/getting-started/typescript#extend-default-interface-properties
declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      stripeCustomerId: string | null;
      subscriptionStatus: boolean;
    } & DefaultSession["user"];
  }
  interface User extends DefaultUser {
    id: string;
  }
  interface AdapterUser extends DefaultUser {
    id: string;
  }
}
