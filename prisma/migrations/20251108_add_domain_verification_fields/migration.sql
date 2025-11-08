-- AlterTable
ALTER TABLE "organizations"
ADD COLUMN IF NOT EXISTS "domainVerificationToken" TEXT,
ADD COLUMN IF NOT EXISTS "domainVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "domainVerifiedAt" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "sslCertificateStatus" TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS "sslCertificateExpiry" TIMESTAMP(3);
