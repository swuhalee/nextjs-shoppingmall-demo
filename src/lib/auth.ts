import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import dbConnect from "@/lib/mongodb";
import { verifyPassword } from "@/lib/password";
import UserModel from "@/models/User";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toString().trim().toLowerCase();
        const password = credentials?.password?.toString().trim();
        if (!email || !password) {
          return null;
        }

        await dbConnect();
        const user = await UserModel.findOne({ email });
        if (!user) {
          return null;
        }

        const isValidPassword = await verifyPassword(password, user.password);
        if (!isValidPassword) {
          return null;
        }

        return {
          id: String(user._id),
          email: user.email,
          name: user.name,
          level: user.level,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.level = user.level;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.level = token.level as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
};
