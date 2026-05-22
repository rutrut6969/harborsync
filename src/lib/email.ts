import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

type NotificationInput = {
  to: string[];
  subject: string;
  preview: string;
  body: string;
};

export async function sendCareNotification(input: NotificationInput) {
  if (!resend) {
    return { skipped: true, reason: "RESEND_API_KEY is not configured" };
  }

  return resend.emails.send({
    from: process.env.EMAIL_FROM ?? "HarborSync <notifications@harborsync.app>",
    to: input.to,
    subject: input.subject,
    text: `${input.preview}\n\n${input.body}`
  });
}

export function newLogNotification(childName: string, logType: string) {
  return {
    subject: `${logType} added for ${childName}`,
    preview: `A new ${logType.toLowerCase()} was added in HarborSync.`,
    body: "Open HarborSync to review the record, attached documents, and any follow-up details."
  };
}
