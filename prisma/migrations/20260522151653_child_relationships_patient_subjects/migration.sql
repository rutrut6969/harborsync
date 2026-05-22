-- CreateEnum
CREATE TYPE "ChildRelationshipStatus" AS ENUM ('ACTIVE', 'INVITED', 'PENDING_APPROVAL', 'DENIED', 'REVOKED');

-- CreateEnum
CREATE TYPE "ChildRelationshipType" AS ENUM ('PARENT_GUARDIAN', 'CAREGIVER', 'EMERGENCY_CONTACT', 'CPS_CASEWORKER', 'ADVOCATE', 'FOSTER_PARENT', 'READ_ONLY');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "AuditAction" ADD VALUE 'GUARDIAN_ASSIGNED';
ALTER TYPE "AuditAction" ADD VALUE 'GUARDIAN_REMOVED';
ALTER TYPE "AuditAction" ADD VALUE 'CAREGIVER_ASSIGNED';
ALTER TYPE "AuditAction" ADD VALUE 'CASEWORKER_ASSIGNED';
ALTER TYPE "AuditAction" ADD VALUE 'EMERGENCY_CONTACT_LINKED';
ALTER TYPE "AuditAction" ADD VALUE 'ACCESS_REQUEST_SUBMITTED';
ALTER TYPE "AuditAction" ADD VALUE 'ACCESS_REQUEST_APPROVED';
ALTER TYPE "AuditAction" ADD VALUE 'ACCESS_REQUEST_DENIED';
ALTER TYPE "AuditAction" ADD VALUE 'CHILD_CONNECTED_TO_FAMILY';
ALTER TYPE "AuditAction" ADD VALUE 'ADDRESS_UPDATED';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PlatformRole" ADD VALUE 'SUPER_ADMIN';
ALTER TYPE "PlatformRole" ADD VALUE 'SUPPORT_ADMIN';

-- AlterTable
ALTER TABLE "BloodworkLog" ADD COLUMN     "patientUserId" TEXT,
ALTER COLUMN "childId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "DoctorVisitLog" ADD COLUMN     "patientUserId" TEXT,
ALTER COLUMN "childId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "patientUserId" TEXT;

-- AlterTable
ALTER TABLE "MedicationLog" ADD COLUMN     "patientUserId" TEXT,
ALTER COLUMN "childId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "ChildRelationship" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "userId" TEXT,
    "invitedEmail" TEXT,
    "fullName" TEXT NOT NULL,
    "relationshipType" "ChildRelationshipType" NOT NULL,
    "role" "UserRole" NOT NULL,
    "familyGroupId" TEXT,
    "caseId" TEXT,
    "organizationId" TEXT,
    "status" "ChildRelationshipStatus" NOT NULL DEFAULT 'ACTIVE',
    "requestedById" TEXT NOT NULL,
    "approvedById" TEXT,
    "canAccessPortal" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChildRelationship_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ChildRelationship_childId_status_idx" ON "ChildRelationship"("childId", "status");

-- CreateIndex
CREATE INDEX "ChildRelationship_userId_status_idx" ON "ChildRelationship"("userId", "status");

-- CreateIndex
CREATE INDEX "ChildRelationship_invitedEmail_status_idx" ON "ChildRelationship"("invitedEmail", "status");

-- CreateIndex
CREATE INDEX "ChildRelationship_relationshipType_status_idx" ON "ChildRelationship"("relationshipType", "status");

-- AddForeignKey
ALTER TABLE "ChildRelationship" ADD CONSTRAINT "ChildRelationship_childId_fkey" FOREIGN KEY ("childId") REFERENCES "ChildProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChildRelationship" ADD CONSTRAINT "ChildRelationship_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChildRelationship" ADD CONSTRAINT "ChildRelationship_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChildRelationship" ADD CONSTRAINT "ChildRelationship_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChildRelationship" ADD CONSTRAINT "ChildRelationship_familyGroupId_fkey" FOREIGN KEY ("familyGroupId") REFERENCES "FamilyGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChildRelationship" ADD CONSTRAINT "ChildRelationship_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChildRelationship" ADD CONSTRAINT "ChildRelationship_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicationLog" ADD CONSTRAINT "MedicationLog_patientUserId_fkey" FOREIGN KEY ("patientUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorVisitLog" ADD CONSTRAINT "DoctorVisitLog_patientUserId_fkey" FOREIGN KEY ("patientUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BloodworkLog" ADD CONSTRAINT "BloodworkLog_patientUserId_fkey" FOREIGN KEY ("patientUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_patientUserId_fkey" FOREIGN KEY ("patientUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
