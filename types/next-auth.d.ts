import NextAuth from "next-auth";
import { Role } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      name: string;
      email: string;
      image: string;
      role: Role;
    };
  }
}
