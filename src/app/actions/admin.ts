"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { AccountType, AuthorizedEmailStatus, PlatformRole, UserRole } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeAuditLog } from "@/lib/audit";
import { inviteUser, resendInvite, revokeInvite } from "@/app/actions/invitations";

export { resendInvite, revokeInvite };

export async function addAuthorizedEmail(formData: FormData) {
  const adminId = await requirePlatformAdmin();
  const email = String(formData.get("email") ?? "").toLowerCase().trim();
  const name = optional(formData.get("name"));
  const defaultRole = String(formData.get("defaultRole") ?? "READ_ONLY") as UserRole;
  const accountType = String(formData.get("accountType") ?? "FAMILY") as AccountType;
  const status = String(formData.get("status") ?? "AUTHORIZED") as AuthorizedEmailStatus;

  if (!email) redirect("/admin?error=Email%20is%20required.");

  const user = await prisma.user.upsert({
    where: { email },
    update: { name: name ?? undefined },
    create: { email, name }
  });

  await prisma.authorizedEmail.upsert({
    where: { email },
    update: { name, defaultRole, accountType, status, userId: user.id, createdById: adminId },
    create: { email, name, defaultRole, accountType, status, userId: user.id, createdById: adminId }
  });

  await writeAuditLog({
    actorId: adminId,
    action: "USER_APPROVED",
    message: `Authorized email added: ${email}`
  });

  revalidatePath("/admin");
  redirect("/admin?authorized=added");
}

export async function updateAuthorizedEmailStatus(formData: FormData) {
  const adminId = await requirePlatformAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "AUTHORIZED") as AuthorizedEmailStatus;

  const authorized = await prisma.authorizedEmail.update({ where: { id }, data: { status } });
  await writeAuditLog({
    actorId: adminId,
    action: status === "REVOKED" || status === "SUSPENDED" ? "ACCESS_CHANGED" : "USER_APPROVED",
    message: `Authorized email ${authorized.email} set to ${status}`
  });

  revalidatePath("/admin");
  redirect("/admin");
}

export async function updateAuthorizedEmail(formData: FormData) {
  const adminId = await requirePlatformAdmin();
  const id = String(formData.get("id") ?? "");
  const email = String(formData.get("email") ?? "").toLowerCase().trim();
  const name = optional(formData.get("name"));
  const defaultRole = String(formData.get("defaultRole") ?? "READ_ONLY") as UserRole;
  const accountType = String(formData.get("accountType") ?? "FAMILY") as AccountType;
  const status = String(formData.get("status") ?? "AUTHORIZED") as AuthorizedEmailStatus;
  await prisma.authorizedEmail.update({ where: { id }, data: { email, name, defaultRole, accountType, status } });
  await writeAuditLog({ actorId: adminId, action: "ACCESS_CHANGED", message: `Authorized email updated: ${email}` });
  revalidatePath("/admin");
  redirect("/admin?authorized=updated");
}

export async function createAdminAccount(formData: FormData) {
  const adminId = await requireSuperAdmin();
  const email = String(formData.get("email") ?? "").toLowerCase().trim();
  const name = optional(formData.get("name"));
  const platformRole = String(formData.get("platformRole") ?? "PLATFORM_ADMIN") as PlatformRole;
  if (!email || platformRole === "USER") redirect("/admin?error=Invalid%20admin%20details.");
  const user = await prisma.user.upsert({
    where: { email },
    update: { name: name ?? undefined, platformRole, onboardingCompleted: true },
    create: { email, name, platformRole, onboardingCompleted: true }
  });
  await prisma.authorizedEmail.upsert({
    where: { email },
    update: { status: "AUTHORIZED", accountType: "ORGANIZATION_ADMIN", userId: user.id },
    create: { email, name, status: "AUTHORIZED", accountType: "ORGANIZATION_ADMIN", userId: user.id }
  });
  await writeAuditLog({ actorId: adminId, action: "USER_APPROVED", message: `Admin account created/promoted: ${email} (${platformRole})` });
  revalidatePath("/admin");
  redirect("/admin?admin=created");
}

export async function updatePlatformRole(formData: FormData) {
  const adminId = await requireSuperAdmin();
  const userId = String(formData.get("userId") ?? "");
  const platformRole = String(formData.get("platformRole") ?? "USER") as PlatformRole;
  const target = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, platformRole: true } });
  if (!target) redirect("/admin?error=User%20not%20found.");
  if (target.email === "isaac.rutledgev@obsidian-systems.tech" && platformRole !== "SUPER_ADMIN") redirect("/admin?error=Primary%20super%20admin%20cannot%20be%20demoted.");
  await prisma.user.update({ where: { id: userId }, data: { platformRole } });
  await writeAuditLog({ actorId: adminId, action: "ACCESS_CHANGED", message: `Platform role changed for ${target.email} to ${platformRole}` });
  revalidatePath("/admin");
  redirect("/admin?admin=updated");
}

export async function approveApplication(formData: FormData) {
  const adminId = await requirePlatformAdmin();
  const id = String(formData.get("id") ?? "");
  const application = await prisma.application.update({
    where: { id },
    data: { status: "APPROVED", reviewedById: adminId, reviewedAt: new Date() }
  });

  await prisma.authorizedEmail.upsert({
    where: { email: application.email },
    update: { status: "AUTHORIZED", name: application.name },
    create: { email: application.email, name: application.name, status: "AUTHORIZED" }
  });

  await writeAuditLog({ actorId: adminId, action: "USER_APPROVED", message: `Application approved for ${application.email}` });
  revalidatePath("/admin");
  redirect("/admin");
}

export async function denyApplication(formData: FormData) {
  const adminId = await requirePlatformAdmin();
  const id = String(formData.get("id") ?? "");
  const application = await prisma.application.update({
    where: { id },
    data: { status: "DENIED", reviewedById: adminId, reviewedAt: new Date() }
  });
  await writeAuditLog({ actorId: adminId, action: "USER_DENIED", message: `Application denied for ${application.email}` });
  revalidatePath("/admin");
  redirect("/admin");
}

export async function adminSendInvite(formData: FormData) {
  await requirePlatformAdmin();
  return inviteUser(formData);
}

async function requirePlatformAdmin() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { platformRole: true } });
  if (user?.platformRole !== "PLATFORM_ADMIN" && user?.platformRole !== "SUPER_ADMIN") redirect("/");
  return session.user.id;
}

async function requireSuperAdmin() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { platformRole: true } });
  if (user?.platformRole !== "SUPER_ADMIN") redirect("/admin?error=Super%20admin%20access%20required.");
  return session.user.id;
}

function optional(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text || null;
}
