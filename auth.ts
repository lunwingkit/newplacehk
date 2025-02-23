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
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (!existingUser) {
          // Create new user if they don't exist
          await prisma.user.create({
            data: {
              name: user.name!,
              email: user.email!,
              image: user.image,
            },
          });
        } else {
          // Update existing user's information
          await prisma.user.update({
            where: { email: user.email! },
            data: {
              name: user.name!,
              image: user.image,
            },
          });
        }
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
