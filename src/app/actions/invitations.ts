"use server";

import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { UserRole } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeAuditLog } from "@/lib/audit";
import { sendCareNotification } from "@/lib/email";
import { hashPassword, validatePassword } from "@/lib/passwords";

const allowedInviteRoles: UserRole[] = ["FAMILY_MEMBER", "CAREGIVER", "CPS_CASEWORKER", "ADVOCATE", "READ_ONLY"];

export async function inviteUser(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const email = String(formData.get("email") ?? "").toLowerCase().trim();
  const role = String(formData.get("role") ?? "") as UserRole;
  const familyGroupId = optionalString(formData.get("familyGroupId"));
  const caseId = optionalString(formData.get("caseId"));
  const organizationId = optionalString(formData.get("organizationId"));

  if (!email || !allowedInviteRoles.includes(role)) redirect("/settings?inviteError=Invalid%20invite%20details.");
  await assertFamilyAdmin(session.user.id, familyGroupId, caseId);

  const token = randomBytes(32).toString("hex");
  const invite = await prisma.invitation.create({
    data: {
      email,
      role,
      token,
      senderId: session.user.id,
      familyGroupId,
      caseId,
      organizationId,
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    }
  });

  await notifyInvite(invite.email, token);
  await writeAuditLog({
    actorId: session.user.id,
    action: "INVITATION_SENT",
    caseId: invite.caseId ?? undefined,
    message: `Invitation sent to ${invite.email} as ${role}`
  });

  revalidatePath("/settings");
  redirect("/settings?inviteSent=true#family-management");
}

export async function resendInvite(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const invitationId = String(formData.get("invitationId") ?? "");
  const invite = await prisma.invitation.findUnique({ where: { id: invitationId } });
  if (!invite || invite.status !== "PENDING") redirect("/settings?inviteError=Invite%20is%20not%20pending.");
  await assertFamilyAdmin(session.user.id, invite.familyGroupId ?? undefined, invite.caseId ?? undefined);

  await notifyInvite(invite.email, invite.token);
  await writeAuditLog({
    actorId: session.user.id,
    action: "INVITATION_SENT",
    caseId: invite.caseId ?? undefined,
    message: `Invitation resent to ${invite.email}`
  });

  revalidatePath("/settings");
  redirect("/settings?inviteSent=true#family-management");
}

export async function revokeInvite(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const invitationId = String(formData.get("invitationId") ?? "");
  const invite = await prisma.invitation.findUnique({ where: { id: invitationId } });
  if (!invite || invite.status !== "PENDING") redirect("/settings?inviteError=Invite%20is%20not%20pending.");
  await assertFamilyAdmin(session.user.id, invite.familyGroupId ?? undefined, invite.caseId ?? undefined);

  await prisma.invitation.update({
    where: { id: invitationId },
    data: { status: "REVOKED" }
  });

  await writeAuditLog({
    actorId: session.user.id,
    action: "ACCESS_CHANGED",
    caseId: invite.caseId ?? undefined,
    message: `Invitation revoked for ${invite.email}`
  });

  revalidatePath("/settings");
  redirect("/settings?inviteRevoked=true#family-management");
}

export async function acceptInvite(formData: FormData) {
  const token = String(formData.get("token") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  const validationError = validatePassword(password);

  if (validationError) redirect(`/invite/${token}?error=${encodeURIComponent(validationError)}`);
  if (password !== confirmPassword) redirect(`/invite/${token}?error=Passwords%20do%20not%20match.`);

  const invite = await prisma.invitation.findUnique({
    where: { token },
    include: {
      familyGroup: { include: { children: true } },
      case: { include: { children: true } }
    }
  });

  if (!invite || invite.status !== "PENDING" || invite.expiresAt < new Date()) {
    redirect(`/invite/${token}?error=Invite%20is%20invalid%20or%20expired.`);
  }

  const user = await prisma.user.upsert({
    where: { email: invite.email },
    update: {
      name: name || undefined,
      passwordHash: await hashPassword(password),
      passwordSetAt: new Date()
    },
    create: {
      email: invite.email,
      name: name || undefined,
      passwordHash: await hashPassword(password),
      passwordSetAt: new Date()
    }
  });

  if (invite.familyGroupId) {
    await prisma.familyMembership.upsert({
      where: { familyGroupId_userId: { familyGroupId: invite.familyGroupId, userId: user.id } },
      update: { role: invite.role },
      create: { familyGroupId: invite.familyGroupId, userId: user.id, role: invite.role }
    });

    for (const child of invite.familyGroup?.children ?? []) {
      await grantChildPermission(child.childId, user.id, invite.role);
    }
  }

  if (invite.caseId) {
    await prisma.caseParticipant.upsert({
      where: { caseId_userId: { caseId: invite.caseId, userId: user.id } },
      update: { role: invite.role },
      create: { caseId: invite.caseId, userId: user.id, role: invite.role }
    });

    for (const child of invite.case?.children ?? []) {
      await grantChildPermission(child.childId, user.id, invite.role, invite.caseId);
    }
  }

  if (invite.organizationId) {
    await prisma.organizationMembership.upsert({
      where: { organizationId_userId: { organizationId: invite.organizationId, userId: user.id } },
      update: { role: invite.role, isSeatActive: true },
      create: { organizationId: invite.organizationId, userId: user.id, role: invite.role, isSeatActive: true }
    });
  }

  await prisma.invitation.update({
    where: { id: invite.id },
    data: { status: "ACCEPTED", recipientId: user.id }
  });

  await writeAuditLog({
    actorId: user.id,
    action: "ACCESS_CHANGED",
    caseId: invite.caseId ?? undefined,
    message: `${invite.email} accepted invitation as ${invite.role}`
  });

  redirect("/sign-in?message=invite-accepted");
}

async function assertFamilyAdmin(userId: string, familyGroupId?: string, caseId?: string) {
  if (familyGroupId) {
    const admin = await prisma.familyMembership.findFirst({
      where: { userId, familyGroupId, role: "FAMILY_ADMIN" }
    });
    if (!admin) redirect("/settings?inviteError=Only%20family%20admins%20can%20invite%20for%20this%20family.");
    return;
  }

  if (caseId) {
    const participant = await prisma.caseParticipant.findFirst({
      where: { userId, caseId, role: { in: ["FAMILY_ADMIN", "ADVOCATE", "CPS_CASEWORKER"] } }
    });
    if (!participant) redirect("/settings?inviteError=You%20do%20not%20have%20invite%20access%20for%20this%20case.");
    return;
  }

  const anyAdmin = await prisma.familyMembership.findFirst({
    where: { userId, role: "FAMILY_ADMIN" }
  });
  if (!anyAdmin) redirect("/settings?inviteError=Only%20family%20admins%20can%20send%20invites.");
}

async function grantChildPermission(childId: string, userId: string, role: UserRole, caseId?: string | null) {
  const existing = await prisma.childPermission.findFirst({
    where: { childId, userId, caseId: caseId ?? null }
  });

  if (existing) {
    await prisma.childPermission.update({ where: { id: existing.id }, data: { role } });
  } else {
    await prisma.childPermission.create({ data: { childId, userId, role, caseId: caseId ?? undefined } });
  }
}

async function notifyInvite(email: string, token: string) {
  const baseUrl = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const url = `${baseUrl.replace(/\/$/, "")}/invite/${token}`;

  try {
    await sendCareNotification({
      to: [email],
      subject: "You were invited to HarborSync",
      preview: "Use this secure invite link to access HarborSync.",
      body: `Open your HarborSync invite: ${url}\n\nThis invite is for approved access only.`
    });
  } catch (error) {
    console.error("Invite email failed", { email, error });
  }
}

function optionalString(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text || undefined;
}
