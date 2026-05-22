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
