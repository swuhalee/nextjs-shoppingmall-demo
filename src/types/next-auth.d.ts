import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      level: string;
    } & DefaultSession["user"];
  }

  interface User {
    level: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    level?: string;
  }
}
