-- CreateEnum
CREATE TYPE "PlatformRole" AS ENUM ('USER', 'PLATFORM_ADMIN');

-- CreateEnum
CREATE TYPE "AuthorizedEmailStatus" AS ENUM ('AUTHORIZED', 'INVITED', 'ACTIVE', 'SUSPENDED', 'REVOKED');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'NEEDS_REVIEW', 'APPROVED', 'DENIED', 'WAITLISTED');

-- CreateEnum
CREATE TYPE "ApplicationType" AS ENUM ('FAMILY', 'CASEWORKER', 'ADVOCATE', 'ORGANIZATION');

-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('FAMILY', 'CAREGIVER', 'CASEWORKER', 'ADVOCATE', 'ORGANIZATION_ADMIN', 'READ_ONLY');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "AuditAction" ADD VALUE 'INVITATION_ACCEPTED';
ALTER TYPE "AuditAction" ADD VALUE 'ORGANIZATION_DENIED';
ALTER TYPE "AuditAction" ADD VALUE 'FAMILY_UPDATED';
ALTER TYPE "AuditAction" ADD VALUE 'CHILD_UPDATED';
ALTER TYPE "AuditAction" ADD VALUE 'CHILD_ARCHIVED';
ALTER TYPE "AuditAction" ADD VALUE 'USER_APPROVED';
ALTER TYPE "AuditAction" ADD VALUE 'USER_DENIED';
ALTER TYPE "AuditAction" ADD VALUE 'SENSITIVE_DATA_UPDATED';
ALTER TYPE "AuditAction" ADD VALUE 'SENSITIVE_DATA_VIEWED';
ALTER TYPE "AuditAction" ADD VALUE 'EXPORT_CREATED';

-- AlterTable
ALTER TABLE "ChildProfile" ADD COLUMN     "archivedAt" TIMESTAMP(3),
ADD COLUMN     "caseworkerInfo" JSONB,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "streetAddress" TEXT;

-- AlterTable
ALTER TABLE "Invitation" ADD COLUMN     "accountType" "AccountType",
ADD COLUMN     "message" TEXT,
ADD COLUMN     "name" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "adultConditions" TEXT,
ADD COLUMN     "adultMedications" TEXT,
ADD COLUMN     "caseworkerEmail" TEXT,
ADD COLUMN     "caseworkerName" TEXT,
ADD COLUMN     "caseworkerPhone" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "emergencyContact" JSONB,
ADD COLUMN     "hasActiveCase" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "platformRole" "PlatformRole" NOT NULL DEFAULT 'USER',
ADD COLUMN     "preferredContact" TEXT,
ADD COLUMN     "preferredName" TEXT,
ADD COLUMN     "relationshipToChild" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "streetAddress" TEXT,
ADD COLUMN     "zip" TEXT;

-- CreateTable
CREATE TABLE "AuthorizedEmail" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "defaultRole" "UserRole" NOT NULL DEFAULT 'READ_ONLY',
    "accountType" "AccountType" NOT NULL DEFAULT 'FAMILY',
    "status" "AuthorizedEmailStatus" NOT NULL DEFAULT 'AUTHORIZED',
    "userId" TEXT,
    "organizationId" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuthorizedEmail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "type" "ApplicationType" NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "email" TEXT NOT NULL,
    "name" TEXT,
    "organizationName" TEXT,
    "organizationId" TEXT,
    "submittedById" TEXT,
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "notes" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SensitiveProfileData" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "childId" TEXT,
    "encryptedSSN" TEXT,
    "ssnLast4" TEXT,
    "encryptedMedicalId" TEXT,
    "encryptedMedicaidId" TEXT,
    "encryptedNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SensitiveProfileData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AuthorizedEmail_email_key" ON "AuthorizedEmail"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AuthorizedEmail_userId_key" ON "AuthorizedEmail"("userId");

-- CreateIndex
CREATE INDEX "AuthorizedEmail_status_idx" ON "AuthorizedEmail"("status");

-- CreateIndex
CREATE INDEX "Application_status_type_idx" ON "Application"("status", "type");

-- CreateIndex
CREATE INDEX "Application_email_idx" ON "Application"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SensitiveProfileData_userId_key" ON "SensitiveProfileData"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SensitiveProfileData_childId_key" ON "SensitiveProfileData"("childId");

-- AddForeignKey
ALTER TABLE "AuthorizedEmail" ADD CONSTRAINT "AuthorizedEmail_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthorizedEmail" ADD CONSTRAINT "AuthorizedEmail_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SensitiveProfileData" ADD CONSTRAINT "SensitiveProfileData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SensitiveProfileData" ADD CONSTRAINT "SensitiveProfileData_childId_fkey" FOREIGN KEY ("childId") REFERENCES "ChildProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
