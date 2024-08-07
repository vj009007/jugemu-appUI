import { customAuthOptions } from "@/app/lib/customAuthOptions";
import NextAuth from "next-auth";

const handler = NextAuth(customAuthOptions);

export { handler as GET, handler as POST };
