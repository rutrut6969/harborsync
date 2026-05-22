"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function submitApplication(formData: FormData) {
  const type = String(formData.get("type") ?? "FAMILY");
  const email = String(formData.get("email") ?? "").toLowerCase().trim();
  const name = String(formData.get("name") ?? "").trim();
  const organizationName = String(formData.get("organizationName") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  const intendedUse = String(formData.get("intendedUse") ?? "").trim();
  const teamSize = String(formData.get("teamSize") ?? "").trim();
  const goals = String(formData.get("goals") ?? "").trim();
  const returnPath = String(formData.get("returnPath") ?? "/apply");

  if (!email) redirect(`${returnPath}?error=Email%20is%20required.`);

  await prisma.application.create({
    data: {
      type: type === "ORGANIZATION" ? "ORGANIZATION" : type === "CASEWORKER" ? "CASEWORKER" : type === "ADVOCATE" ? "ADVOCATE" : "FAMILY",
      email,
      name,
      organizationName: organizationName || null,
      notes: [intendedUse, teamSize, goals, notes].filter(Boolean).join("\n\n") || null,
      metadata: {
        intendedUse,
        teamSize,
        goals
      }
    }
  });

  redirect(`${returnPath}?submitted=true`);
}
