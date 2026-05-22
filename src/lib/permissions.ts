import type { UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const writeRoles: UserRole[] = ["FAMILY_ADMIN", "FAMILY_MEMBER", "CAREGIVER", "CPS_CASEWORKER", "ADVOCATE"];

export async function canAccessChild(userId: string, childId: string) {
  const permission = await prisma.childPermission.findFirst({
    where: { userId, childId }
  });

  if (permission) return true;

  const membership = await prisma.familyMembership.findFirst({
    where: {
      userId,
      familyGroup: {
        children: {
          some: { childId }
        }
      }
    }
  });

  return Boolean(membership);
}

export async function canWriteChildRecord(userId: string, childId: string) {
  const permission = await prisma.childPermission.findFirst({
    where: {
      userId,
      childId,
      role: { in: writeRoles }
    }
  });

  if (permission) return true;

  const membership = await prisma.familyMembership.findFirst({
    where: {
      userId,
      role: { in: writeRoles },
      familyGroup: {
        children: {
          some: { childId }
        }
      }
    }
  });

  return Boolean(membership);
}
