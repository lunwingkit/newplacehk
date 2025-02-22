import NextAuth, { type NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const authOptions: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        console.log("hello");
        console.log(user);
      } catch (error) {
        console.error("Error saving user to DB:", error);
        return false;
      }
      return true;
    },
    async session({ session, user }) {
      // if (session.user?.email) {
      //   const dbUser = await prisma.user.findUnique({
      //     where: { email: session.user.email },
      //   })
      //   if (dbUser) {
      //     session.user.id = dbUser.id // 設定用戶 ID
      //   }
      // }
      return session;
    },
  },
};

export const { auth, handlers } = NextAuth(authOptions);
export { signIn, signOut } from "next-auth/react";
