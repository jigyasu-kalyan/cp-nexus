import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    backendToken?: string;
    user: {
      id: string;
      username: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    username: string;
    backendToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    backendToken?: string;
    id: string;
    username: string;
  }
}
