-- Add onboarding fields to User table
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "onboardingStep" INTEGER NOT NULL DEFAULT 0;
