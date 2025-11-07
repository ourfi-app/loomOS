
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      organizationId?: string | null;
      unitNumber?: string;
      onboardingCompleted?: boolean;
    }
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
    organizationId?: string | null;
    unitNumber?: string;
    onboardingCompleted?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    organizationId?: string | null;
    unitNumber?: string;
    onboardingCompleted?: boolean;
  }
}
