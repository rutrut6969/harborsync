"use server";

import { redirect } from "next/navigation";
import { randomBytes } from "crypto";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeAuditLog } from "@/lib/audit";
import { sendCareNotification } from "@/lib/email";

export async function completeOnboarding(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const hasActiveCase = formData.get("hasActiveCase") === "on";
  const caseworkerEmail = String(formData.get("caseworkerEmail") ?? "").toLowerCase().trim();
  const caseworkerRole = String(formData.get("caseworkerRole") ?? "CPS_CASEWORKER");

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: String(formData.get("name") ?? "").trim(),
      preferredName: optional(formData.get("preferredName")),
      phone: optional(formData.get("phone")),
      streetAddress: optional(formData.get("streetAddress")),
      city: optional(formData.get("city")),
      state: optional(formData.get("state")),
      zip: optional(formData.get("zip")),
      preferredContact: optional(formData.get("preferredContact")),
      relationshipToChild: optional(formData.get("relationshipToChild")),
      adultMedications: optional(formData.get("adultMedications")),
      adultConditions: optional(formData.get("adultConditions")),
      emergencyContact: optional(formData.get("emergencyContactName"))
        ? {
            name: optional(formData.get("emergencyContactName")),
            phone: optional(formData.get("emergencyContactPhone"))
          }
        : undefined,
      hasActiveCase,
      caseworkerName: optional(formData.get("caseworkerName")),
      caseworkerEmail: caseworkerEmail || null,
      caseworkerPhone: optional(formData.get("caseworkerPhone")),
      onboardingCompleted: true
    }
  });

  await writeAuditLog({
    actorId: session.user.id,
    action: "ACCESS_CHANGED",
    message: "User completed onboarding profile"
  });

  const familyGroupName = optional(formData.get("familyGroupName"));
  const firstChildName = optional(formData.get("firstChildName"));
  const firstChildDob = optional(formData.get("firstChildDob"));
  if (familyGroupName || (firstChildName && firstChildDob)) {
    const existingMembership = await prisma.familyMembership.findFirst({ where: { userId: session.user.id, role: "FAMILY_ADMIN" } });
    const family = existingMembership
      ? await prisma.familyGroup.findUnique({ where: { id: existingMembership.familyGroupId } })
      : await prisma.familyGroup.create({
          data: {
            name: familyGroupName ?? "My Family",
            description: "Created during onboarding",
            memberships: { create: { userId: session.user.id, role: "FAMILY_ADMIN" } }
          }
        });

    if (!existingMembership && family) {
      await writeAuditLog({ actorId: session.user.id, action: "FAMILY_CREATED", message: `Family group created: ${family.name}` });
    }

    if (family && firstChildName && firstChildDob) {
      const child = await prisma.childProfile.create({
        data: {
          fullName: firstChildName,
          dateOfBirth: new Date(firstChildDob)
        }
      });
      await prisma.familyChild.create({ data: { familyGroupId: family.id, childId: child.id, relationship: "Child" } });
      await prisma.childPermission.create({ data: { childId: child.id, userId: session.user.id, role: "FAMILY_ADMIN" } });
      await prisma.childRelationship.create({
        data: {
          childId: child.id,
          userId: session.user.id,
          fullName: String(formData.get("name") ?? "").trim(),
          relationshipType: "PARENT_GUARDIAN",
          role: "FAMILY_ADMIN",
          familyGroupId: family.id,
          status: "ACTIVE",
          requestedById: session.user.id,
          approvedById: session.user.id
        }
      });
      await writeAuditLog({ actorId: session.user.id, action: "CHILD_CREATED", childId: child.id, message: `Child profile created from onboarding: ${child.fullName}` });
    }
  }

  if (caseworkerEmail) {
    const token = randomBytes(32).toString("hex");
    await prisma.invitation.create({
      data: {
        email: caseworkerEmail,
        role: caseworkerRole === "ADVOCATE" ? "ADVOCATE" : "CPS_CASEWORKER",
        token,
        senderId: session.user.id,
        message: "Invited from onboarding caseworker contact information.",
        expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      }
    });
    await writeAuditLog({
      actorId: session.user.id,
      action: "INVITATION_SENT",
      message: `Caseworker invite created from onboarding for ${caseworkerEmail}`
    });
    await notifyInvite(caseworkerEmail, token);
  }

  redirect("/");
}

async function notifyInvite(email: string, token: string) {
  const baseUrl = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const url = `${baseUrl.replace(/\/$/, "")}/invite/${token}`;
  try {
    await sendCareNotification({
      to: [email],
      subject: "You were invited to HarborSync",
      preview: "A HarborSync user added you as a case support contact.",
      body: `Open your HarborSync invite: ${url}`
    });
  } catch (error) {
    console.error("Onboarding invite email failed", { email, error });
  }
}

function optional(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text || null;
}
