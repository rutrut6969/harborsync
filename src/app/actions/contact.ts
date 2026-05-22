"use server";

import { redirect } from "next/navigation";
import { sendCareNotification } from "@/lib/email";

export async function submitContactInquiry(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").toLowerCase().trim();
  const subject = String(formData.get("subject") ?? "HarborSync inquiry").trim();
  const message = String(formData.get("message") ?? "").trim();
  const organization = String(formData.get("organization") ?? "").trim();
  const topic = String(formData.get("topic") ?? "General question").trim();

  if (!email || !message) redirect("/contact?error=Email%20and%20message%20are%20required.");

  const to = process.env.CONTACT_INBOX_EMAIL ?? process.env.EMAIL_FROM?.match(/<(.+)>/)?.[1] ?? "isaac.rutledgev@obsidian-systems.tech";
  try {
    await sendCareNotification({
      to: [to],
      subject: `HarborSync contact: ${subject}`,
      preview: `${topic} from ${name || email}`,
      body: [
        `Name: ${name || "Not provided"}`,
        `Email: ${email}`,
        `Organization: ${organization || "Not provided"}`,
        `Topic: ${topic}`,
        "",
        message
      ].join("\n")
    });
  } catch (error) {
    console.error("Contact inquiry email failed", { email, error });
  }

  redirect("/contact?submitted=true");
}
