"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeAuditLog } from "@/lib/audit";
import {
  bloodworkSchema,
  bulkMedicationSchema,
  doctorVisitSchema,
  medicationLogSchema
} from "@/lib/validations/logs";

export async function createMedicationLog(input: unknown) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const data = medicationLogSchema.parse(input);

  const log = await prisma.medicationLog.create({
    data: {
      childId: data.childId,
      medicationName: data.medicationName,
      dosage: data.dosage,
      doseUnit: data.doseUnit,
      dateGiven: new Date(data.dateGiven),
      timeGiven: data.timeGiven,
      administeredById: session.user.id,
      administeredByName: data.administeredByName,
      status: data.status,
      notes: data.notes,
      sideEffects: data.sideEffects
    }
  });

  await writeAuditLog({
    actorId: session.user.id,
    action: "LOG_CREATED",
    childId: data.childId,
    message: `Medication logged: ${data.medicationName}`
  });

  revalidateCarePages();
  return log;
}

export async function createBulkMedicationLog(input: unknown) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const data = bulkMedicationSchema.parse(input);
  const batchId = crypto.randomUUID();

  const logs = await prisma.medicationLog.createMany({
    data: data.entries.map((entry) => ({
      childId: entry.childId,
      medicationName: entry.medicationName,
      dosage: entry.dosage,
      doseUnit: entry.doseUnit,
      dateGiven: new Date(entry.dateGiven),
      timeGiven: entry.timeGiven,
      administeredById: session.user.id,
      administeredByName: entry.administeredByName,
      status: entry.status,
      notes: entry.notes,
      sideEffects: entry.sideEffects,
      batchId,
      entryMethod: "bulk"
    }))
  });

  await writeAuditLog({
    actorId: session.user.id,
    action: "LOG_CREATED",
    message: `Bulk medication log created with ${data.entries.length} entries`,
    metadata: { batchId }
  });

  revalidateCarePages();
  return logs;
}

export async function createDoctorVisitLog(input: unknown) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const data = doctorVisitSchema.parse(input);

  const log = await prisma.doctorVisitLog.create({
    data: {
      childId: data.childId,
      appointmentDate: new Date(data.appointmentDate),
      appointmentTime: data.appointmentTime,
      doctorName: data.doctorName,
      specialty: data.specialty,
      reasonForVisit: data.reasonForVisit,
      diagnosisOutcome: data.diagnosisOutcome,
      followUpRequired: data.followUpRequired,
      followUpDate: data.followUpDate ? new Date(data.followUpDate) : undefined,
      createdById: session.user.id
    }
  });

  await writeAuditLog({
    actorId: session.user.id,
    action: "LOG_CREATED",
    childId: data.childId,
    message: `Doctor visit logged: ${data.reasonForVisit}`
  });

  revalidateCarePages();
  return log;
}

export async function createBloodworkLog(input: unknown) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const data = bloodworkSchema.parse(input);

  const log = await prisma.bloodworkLog.create({
    data: {
      childId: data.childId,
      bloodworkDate: new Date(data.bloodworkDate),
      facility: data.facility,
      orderingDoctor: data.orderingDoctor,
      labReason: data.labReason,
      plateletCount: data.plateletCount,
      hemoglobin: data.hemoglobin,
      whiteBloodCellCount: data.whiteBloodCellCount,
      notes: data.notes,
      followUpRequired: data.followUpRequired,
      createdById: session.user.id
    }
  });

  await writeAuditLog({
    actorId: session.user.id,
    action: "LOG_CREATED",
    childId: data.childId,
    message: `Bloodwork logged${data.facility ? ` from ${data.facility}` : ""}`
  });

  revalidateCarePages();
  return log;
}

function revalidateCarePages() {
  revalidatePath("/");
  revalidatePath("/records");
  revalidatePath("/documents");
}
