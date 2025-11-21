
import NextAuth from "next-auth";
import { validateAuth, createErrorResponse, createSuccessResponse } from '@/lib/api-utils';
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

// Force dynamic rendering to prevent webpack errors during static generation
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export { handler as GET, handler as POST };
