"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { UserRole } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeAuditLog } from "@/lib/audit";

export async function createFamilyGroup(formData: FormData) {
  const userId = await requireUser();
  const name = String(formData.get("name") ?? "").trim();
  const description = optional(formData.get("description"));
  if (!name) redirect("/settings/family?error=Family%20name%20is%20required.");

  const family = await prisma.familyGroup.create({ data: { name, description } });
  await prisma.familyMembership.create({ data: { familyGroupId: family.id, userId, role: "FAMILY_ADMIN" } });
  await writeAuditLog({ actorId: userId, action: "FAMILY_CREATED", message: `Family group created: ${name}` });
  revalidateSettings();
  redirect("/settings/family");
}

export async function updateFamilyGroup(formData: FormData) {
  const userId = await requireUser();
  const familyGroupId = String(formData.get("familyGroupId") ?? "");
  await requireFamilyAdmin(userId, familyGroupId);

  const family = await prisma.familyGroup.update({
    where: { id: familyGroupId },
    data: {
      name: String(formData.get("name") ?? "").trim(),
      description: optional(formData.get("description"))
    }
  });
  await writeAuditLog({ actorId: userId, action: "FAMILY_UPDATED", message: `Family group updated: ${family.name}` });
  revalidateSettings();
  redirect("/settings/family");
}

export async function updateFamilyMemberRole(formData: FormData) {
  const userId = await requireUser();
  const membershipId = String(formData.get("membershipId") ?? "");
  const role = String(formData.get("role") ?? "READ_ONLY") as UserRole;
  const membership = await prisma.familyMembership.findUnique({ where: { id: membershipId } });
  if (!membership) redirect("/settings/family?error=Membership%20not%20found.");
  await requireFamilyAdmin(userId, membership.familyGroupId);
  await prisma.familyMembership.update({ where: { id: membershipId }, data: { role } });
  await writeAuditLog({ actorId: userId, action: "ACCESS_CHANGED", message: `Family member role changed to ${role}` });
  revalidateSettings();
  redirect("/settings/family");
}

export async function removeFamilyMember(formData: FormData) {
  const userId = await requireUser();
  const membershipId = String(formData.get("membershipId") ?? "");
  const membership = await prisma.familyMembership.findUnique({ where: { id: membershipId } });
  if (!membership) redirect("/settings/family?error=Membership%20not%20found.");
  await requireFamilyAdmin(userId, membership.familyGroupId);
  if (membership.userId === userId) redirect("/settings/family?error=You%20cannot%20remove%20yourself.");
  await prisma.familyMembership.delete({ where: { id: membershipId } });
  await writeAuditLog({ actorId: userId, action: "ACCESS_CHANGED", message: "Family member removed" });
  revalidateSettings();
  redirect("/settings/family");
}

async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");
  return session.user.id;
}

async function requireFamilyAdmin(userId: string, familyGroupId: string) {
  const membership = await prisma.familyMembership.findFirst({ where: { userId, familyGroupId, role: "FAMILY_ADMIN" } });
  if (!membership) redirect("/settings/family?error=Family%20admin%20access%20required.");
}

function revalidateSettings() {
  revalidatePath("/settings");
  revalidatePath("/settings/family");
}

function optional(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text || null;
}
