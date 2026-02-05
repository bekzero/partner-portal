import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      role: "partner" | "admin";
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    uid?: string;
    role?: "partner" | "admin";
  }
}
