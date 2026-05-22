"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeAuditLog } from "@/lib/audit";

export async function createChildProfile(formData: FormData) {
  const userId = await requireUser();
  const familyGroupId = String(formData.get("familyGroupId") ?? "");
  if (familyGroupId) await requireFamilyAdmin(userId, familyGroupId);

  const child = await prisma.childProfile.create({
    data: childData(formData)
  });

  if (familyGroupId) {
    await prisma.familyChild.create({ data: { familyGroupId, childId: child.id, relationship: optional(formData.get("relationship")) ?? "Child" } });
  }

  await prisma.childPermission.create({ data: { childId: child.id, userId, role: "FAMILY_ADMIN" } });
  await writeAuditLog({ actorId: userId, action: "CHILD_CREATED", childId: child.id, message: `Child profile created: ${child.fullName}` });
  revalidateCare();
  redirect(`/children/${child.id}`);
}

export async function updateChildProfile(formData: FormData) {
  const userId = await requireUser();
  const childId = String(formData.get("childId") ?? "");
  await requireChildAdmin(userId, childId);

  const child = await prisma.childProfile.update({
    where: { id: childId },
    data: childData(formData)
  });

  await writeAuditLog({ actorId: userId, action: "CHILD_UPDATED", childId: child.id, message: `Child profile updated: ${child.fullName}` });
  revalidateCare();
  redirect(`/children/${child.id}`);
}

export async function archiveChildProfile(formData: FormData) {
  const userId = await requireUser();
  const childId = String(formData.get("childId") ?? "");
  await requireChildAdmin(userId, childId);
  const child = await prisma.childProfile.update({ where: { id: childId }, data: { archivedAt: new Date() } });
  await writeAuditLog({ actorId: userId, action: "CHILD_ARCHIVED", childId, message: `Child profile archived: ${child.fullName}` });
  revalidateCare();
  redirect("/settings/children");
}

export async function connectChildToFamily(formData: FormData) {
  const userId = await requireUser();
  const childId = String(formData.get("childId") ?? "");
  const familyGroupId = String(formData.get("familyGroupId") ?? "");
  await requireChildAdmin(userId, childId);
  await requireFamilyAdmin(userId, familyGroupId);
  await prisma.familyChild.upsert({
    where: { familyGroupId_childId: { familyGroupId, childId } },
    update: {},
    create: { familyGroupId, childId, relationship: optional(formData.get("relationship")) ?? "Child" }
  });
  await writeAuditLog({ actorId: userId, action: "ACCESS_CHANGED", childId, message: "Child connected to family group" });
  revalidateCare();
  redirect("/settings/children");
}

function childData(formData: FormData) {
  return {
    fullName: String(formData.get("fullName") ?? "").trim(),
    dateOfBirth: new Date(String(formData.get("dateOfBirth") ?? "")),
    email: optional(formData.get("email")),
    phone: optional(formData.get("phone")),
    streetAddress: optional(formData.get("streetAddress")),
    allergies: optional(formData.get("allergies")),
    conditions: optional(formData.get("conditions")),
    currentMedications: optional(formData.get("currentMedications")),
    primaryDoctor: optional(formData.get("primaryDoctor")),
    notes: optional(formData.get("notes")),
    caseworkerInfo: optional(formData.get("caseworkerName"))
      ? {
          name: optional(formData.get("caseworkerName")),
          email: optional(formData.get("caseworkerEmail")),
          phone: optional(formData.get("caseworkerPhone"))
        }
      : undefined,
    emergencyContacts: optional(formData.get("emergencyContactName"))
      ? [
          {
            name: optional(formData.get("emergencyContactName")),
            relationship: optional(formData.get("emergencyContactRelationship")),
            phone: optional(formData.get("emergencyContactPhone"))
          }
        ]
      : undefined
  };
}

async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");
  return session.user.id;
}

async function requireChildAdmin(userId: string, childId: string) {
  const permission = await prisma.childPermission.findFirst({ where: { userId, childId, role: "FAMILY_ADMIN" } });
  const familyAdmin = await prisma.familyMembership.findFirst({
    where: { userId, role: "FAMILY_ADMIN", familyGroup: { children: { some: { childId } } } }
  });
  if (!permission && !familyAdmin) redirect("/settings/children?error=Child%20admin%20access%20required.");
}

async function requireFamilyAdmin(userId: string, familyGroupId: string) {
  const membership = await prisma.familyMembership.findFirst({ where: { userId, familyGroupId, role: "FAMILY_ADMIN" } });
  if (!membership) redirect("/settings/children?error=Family%20admin%20access%20required.");
}

function revalidateCare() {
  revalidatePath("/");
  revalidatePath("/profile");
  revalidatePath("/settings/children");
}

function optional(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text || null;
}
