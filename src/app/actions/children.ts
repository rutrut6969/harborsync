"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { randomBytes } from "crypto";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeAuditLog } from "@/lib/audit";
import { sendCareNotification } from "@/lib/email";

export async function createChildProfile(formData: FormData) {
  const userId = await requireUser();
  let familyGroupId = String(formData.get("familyGroupId") ?? "");
  if (familyGroupId) {
    await requireFamilyAdmin(userId, familyGroupId);
  } else {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { name: true, email: true } });
    const family = await prisma.familyGroup.create({
      data: {
        name: `${user?.name ?? "My"} Family`,
        description: "Created during child profile setup",
        memberships: { create: { userId, role: "FAMILY_ADMIN" } }
      }
    });
    familyGroupId = family.id;
    await writeAuditLog({ actorId: userId, action: "FAMILY_CREATED", message: `Family group created: ${family.name}` });
  }

  const child = await prisma.childProfile.create({
    data: childData(formData)
  });

  await prisma.familyChild.create({ data: { familyGroupId, childId: child.id, relationship: optional(formData.get("relationship")) ?? "Child" } });

  await prisma.childPermission.create({ data: { childId: child.id, userId, role: "FAMILY_ADMIN" } });
  const creator = await prisma.user.findUnique({ where: { id: userId }, select: { name: true, email: true } });
  await prisma.childRelationship.create({
    data: {
      childId: child.id,
      userId,
      fullName: creator?.name ?? creator?.email ?? "Parent / guardian",
      relationshipType: "PARENT_GUARDIAN",
      role: "FAMILY_ADMIN",
      familyGroupId,
      status: "ACTIVE",
      requestedById: userId,
      approvedById: userId
    }
  });

  if (child.email) {
    await prisma.authorizedEmail.upsert({
      where: { email: child.email.toLowerCase() },
      update: { status: "AUTHORIZED", defaultRole: "READ_ONLY", accountType: "READ_ONLY" },
      create: { email: child.email.toLowerCase(), status: "AUTHORIZED", defaultRole: "READ_ONLY", accountType: "READ_ONLY" }
    });
  }

  await createOptionalRelationshipInvites(formData, child.id, familyGroupId, userId);
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

  await createOptionalRelationshipInvites(formData, child.id, optional(formData.get("familyGroupId")) ?? undefined, userId);
  await writeAuditLog({ actorId: userId, action: "CHILD_UPDATED", childId: child.id, message: `Child profile updated: ${child.fullName}` });
  revalidateCare();
  redirect(`/children/${child.id}`);
}

export async function requestGuardianAccess(formData: FormData) {
  const userId = await requireUser();
  const childName = String(formData.get("childName") ?? "").trim();
  const dateOfBirth = String(formData.get("dateOfBirth") ?? "");
  const knownGuardianEmail = optional(formData.get("knownGuardianEmail"));
  if (!childName || !dateOfBirth) redirect("/settings/children?error=Child%20name%20and%20birthdate%20are%20required.");

  const child = await prisma.childProfile.findFirst({
    where: {
      fullName: { equals: childName, mode: "insensitive" },
      dateOfBirth: new Date(dateOfBirth)
    },
    include: { relationships: { where: { status: "ACTIVE", relationshipType: { in: ["PARENT_GUARDIAN", "FOSTER_PARENT", "CPS_CASEWORKER"] } } } }
  });
  if (!child) redirect("/settings/children?requested=true");

  const requester = await prisma.user.findUnique({ where: { id: userId }, select: { name: true, email: true } });
  await prisma.childRelationship.create({
    data: {
      childId: child.id,
      userId,
      fullName: requester?.name ?? requester?.email ?? "Guardian request",
      relationshipType: "PARENT_GUARDIAN",
      role: "FAMILY_ADMIN",
      status: "PENDING_APPROVAL",
      requestedById: userId,
      notes: knownGuardianEmail ? `Known guardian email: ${knownGuardianEmail}` : undefined
    }
  });

  await writeAuditLog({
    actorId: userId,
    action: "ACCESS_REQUEST_SUBMITTED",
    childId: child.id,
    message: "Guardian access request submitted"
  });
  redirect("/settings/children?requested=true");
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
  await writeAuditLog({ actorId: userId, action: "CHILD_CONNECTED_TO_FAMILY", childId, message: "Child connected to family group" });
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

async function createOptionalRelationshipInvites(formData: FormData, childId: string, familyGroupId: string | undefined, requestedById: string) {
  const additionalEmail = optional(formData.get("additionalGuardianEmail"))?.toLowerCase();
  const additionalName = optional(formData.get("additionalGuardianName"));
  const joinFamily = String(formData.get("additionalGuardianFamilyMode") ?? "join") === "join";
  if (additionalEmail) {
    const user = await prisma.user.findUnique({ where: { email: additionalEmail }, select: { id: true, name: true, email: true } });
    const token = randomBytes(32).toString("hex");
    await prisma.authorizedEmail.upsert({
      where: { email: additionalEmail },
      update: { status: user ? "ACTIVE" : "INVITED", defaultRole: "FAMILY_ADMIN", accountType: "FAMILY", userId: user?.id },
      create: { email: additionalEmail, name: additionalName, status: user ? "ACTIVE" : "INVITED", defaultRole: "FAMILY_ADMIN", accountType: "FAMILY", userId: user?.id }
    });
    await prisma.childRelationship.create({
      data: {
        childId,
        userId: user?.id,
        invitedEmail: user ? undefined : additionalEmail,
        fullName: additionalName ?? user?.name ?? additionalEmail,
        relationshipType: "PARENT_GUARDIAN",
        role: "FAMILY_ADMIN",
        familyGroupId: joinFamily ? familyGroupId : undefined,
        status: user ? "ACTIVE" : "INVITED",
        requestedById,
        approvedById: requestedById,
        notes: joinFamily ? "Add to creator family group" : "Create separate family group after activation"
      }
    });
    await prisma.invitation.create({
      data: {
        email: additionalEmail,
        name: additionalName,
        role: "FAMILY_ADMIN",
        accountType: "FAMILY",
        token,
        senderId: requestedById,
        familyGroupId: joinFamily ? familyGroupId : undefined,
        expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        message: joinFamily ? "Parent/guardian access invite" : "Parent/guardian access invite for a separate family group"
      }
    });
    await writeAuditLog({ actorId: requestedById, action: "GUARDIAN_ASSIGNED", childId, message: `Guardian invited/assigned: ${additionalEmail}` });
    await notifyInvite(additionalEmail, token);
  }

  const caseworkerEmail = optional(formData.get("caseworkerEmail"))?.toLowerCase();
  if (caseworkerEmail) {
    const caseworker = await prisma.user.findUnique({ where: { email: caseworkerEmail }, select: { id: true, name: true, email: true } });
    await prisma.authorizedEmail.upsert({
      where: { email: caseworkerEmail },
      update: { status: caseworker ? "ACTIVE" : "INVITED", defaultRole: "CPS_CASEWORKER", accountType: "CASEWORKER", userId: caseworker?.id },
      create: { email: caseworkerEmail, name: optional(formData.get("caseworkerName")), status: caseworker ? "ACTIVE" : "INVITED", defaultRole: "CPS_CASEWORKER", accountType: "CASEWORKER", userId: caseworker?.id }
    });
    await prisma.childRelationship.create({
      data: {
        childId,
        userId: caseworker?.id,
        invitedEmail: caseworker ? undefined : caseworkerEmail,
        fullName: optional(formData.get("caseworkerName")) ?? caseworker?.name ?? caseworkerEmail,
        relationshipType: "CPS_CASEWORKER",
        role: "CPS_CASEWORKER",
        status: caseworker ? "ACTIVE" : "INVITED",
        requestedById,
        approvedById: requestedById
      }
    });
    await writeAuditLog({ actorId: requestedById, action: "CASEWORKER_ASSIGNED", childId, message: `Caseworker invited/assigned: ${caseworkerEmail}` });
  }

  const emergencyName = optional(formData.get("emergencyContactName"));
  if (emergencyName) {
    await prisma.childRelationship.create({
      data: {
        childId,
        invitedEmail: optional(formData.get("emergencyContactEmail"))?.toLowerCase(),
        fullName: emergencyName,
        relationshipType: "EMERGENCY_CONTACT",
        role: "READ_ONLY",
        familyGroupId,
        status: "ACTIVE",
        requestedById,
        approvedById: requestedById,
        canAccessPortal: String(formData.get("emergencyContactPortalAccess") ?? "") === "on",
        notes: optional(formData.get("emergencyContactNotes"))
      }
    });
    await writeAuditLog({ actorId: requestedById, action: "EMERGENCY_CONTACT_LINKED", childId, message: `Emergency contact added: ${emergencyName}` });
  }
}

async function notifyInvite(email: string, token: string) {
  const baseUrl = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  try {
    await sendCareNotification({
      to: [email],
      subject: "You were invited to HarborSync",
      preview: "Use this secure invite link to access HarborSync.",
      body: `Open your HarborSync invite: ${baseUrl.replace(/\/$/, "")}/invite/${token}`
    });
  } catch (error) {
    console.error("Child relationship invite email failed", { email, error });
  }
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
