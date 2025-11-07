
import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import AzureADProvider from "next-auth/providers/azure-ad";
import bcrypt from "bcryptjs";
import { prisma } from "./db";
import { env, hasGoogleOAuthConfigured, hasMicrosoftOAuthConfigured } from "./env";
import { UserRole } from "@prisma/client";

/**
 * Auth Helper Functions for Role-Based Access Control
 * SUPER_ADMIN has unrestricted access to everything
 */

export function isSuperAdmin(role?: string | null): boolean {
  return role === 'SUPER_ADMIN';
}

export function isAdmin(role?: string | null): boolean {
  return role === 'ADMIN' || isSuperAdmin(role);
}

export function isBoardMember(role?: string | null): boolean {
  return role === 'BOARD_MEMBER' || isAdmin(role);
}

export function isResident(role?: string | null): boolean {
  return role === 'RESIDENT' || isBoardMember(role);
}

export function hasAdminAccess(role?: string | null): boolean {
  return isSuperAdmin(role) || role === 'ADMIN';
}

export function hasBoardAccess(role?: string | null): boolean {
  return isSuperAdmin(role) || role === 'ADMIN' || role === 'BOARD_MEMBER';
}

export function hasResidentAccess(role?: string | null): boolean {
  return !!role; // Any role has at least resident access
}

/**
 * Check if user can perform admin actions
 * SUPER_ADMIN bypasses all restrictions
 */
export function canManageUsers(role?: string | null): boolean {
  return isSuperAdmin(role) || role === 'ADMIN';
}

export function canManageOrganization(role?: string | null): boolean {
  return isSuperAdmin(role) || role === 'ADMIN';
}

export function canAccessAllData(role?: string | null): boolean {
  return isSuperAdmin(role);
}

/**
 * Build providers array based on configured OAuth credentials
 * Only include OAuth providers if they're properly configured
 */
const buildProviders = () => {
  const providers = [];

  // Always include credentials provider
  providers.push(
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        });

        if (!user || !user.password || !user.isActive) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name || `${user.firstName} ${user.lastName}`,
          role: user.role,
          organizationId: user.organizationId || null,
          unitNumber: user.unitNumber || undefined,
          onboardingCompleted: user.onboardingCompleted,
        };
      }
    })
  );

  // Only add Google OAuth if properly configured
  if (hasGoogleOAuthConfigured()) {
    providers.push(
      GoogleProvider({
        clientId: env.GOOGLE_CLIENT_ID!,
        clientSecret: env.GOOGLE_CLIENT_SECRET!,
        // SECURITY: Email account linking is disabled by default
        // Only enable in development if you understand the security implications
        allowDangerousEmailAccountLinking: env.NODE_ENV === 'development',
      })
    );
  }

  // Only add Microsoft OAuth if properly configured
  if (hasMicrosoftOAuthConfigured()) {
    providers.push(
      AzureADProvider({
        clientId: env.MICROSOFT_CLIENT_ID!,
        clientSecret: env.MICROSOFT_CLIENT_SECRET!,
        tenantId: env.MICROSOFT_TENANT_ID || "common",
        // SECURITY: Email account linking is disabled by default
        // Only enable in development if you understand the security implications
        allowDangerousEmailAccountLinking: env.NODE_ENV === 'development',
      })
    );
  }

  return providers;
};

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
  },
  providers: buildProviders(),
  callbacks: {
    async jwt({ token, user, account, trigger }) {
      if (user) {
        token.role = (user as any).role;
        token.organizationId = (user as any).organizationId;
        token.unitNumber = (user as any).unitNumber;
        token.onboardingCompleted = (user as any).onboardingCompleted;
      }
      
      // For OAuth sign-ins or session updates, fetch the user's data from the database
      if (account && (account.provider === "google" || account.provider === "azure-ad")) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email! },
        });
        if (dbUser) {
          token.role = dbUser.role;
          token.organizationId = dbUser.organizationId;
          token.unitNumber = dbUser.unitNumber || undefined;
          token.onboardingCompleted = dbUser.onboardingCompleted;
        }
      }
      
      // Refresh onboarding status on update trigger
      if (trigger === "update") {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email! },
          select: { onboardingCompleted: true, role: true, organizationId: true, unitNumber: true }
        });
        if (dbUser) {
          token.onboardingCompleted = dbUser.onboardingCompleted;
          token.role = dbUser.role;
          token.organizationId = dbUser.organizationId;
          token.unitNumber = dbUser.unitNumber || undefined;
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
        session.user.organizationId = token.organizationId as string | null;
        session.user.unitNumber = token.unitNumber as string;
        session.user.onboardingCompleted = token.onboardingCompleted as boolean;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // For OAuth providers, ensure user exists in the database
      if (account && (account.provider === "google" || account.provider === "azure-ad")) {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        // If user doesn't exist, create them with RESIDENT role by default
        if (!existingUser) {
          try {
            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name || "",
                firstName: user.name?.split(" ")[0] || "",
                lastName: user.name?.split(" ").slice(1).join(" ") || "",
                role: "RESIDENT",
                isActive: true,
                emailVerified: new Date(),
              },
            });
          } catch (error) {
            console.error("Error creating OAuth user:", error);
          }
        }
      }
      
      return true;
    },
  }
};
