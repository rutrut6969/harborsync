import type { AuditAction, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type AuditInput = {
  actorId?: string;
  action: AuditAction;
  message: string;
  childId?: string;
  caseId?: string;
  metadata?: Prisma.InputJsonValue;
};

export async function writeAuditLog(input: AuditInput) {
  return prisma.auditLog.create({
    data: {
      actorId: input.actorId,
      action: input.action,
      message: input.message,
      childId: input.childId,
      caseId: input.caseId,
      metadata: input.metadata
    }
  });
}
