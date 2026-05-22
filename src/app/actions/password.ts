"use server";

import { randomBytes } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createResetToken, hashPassword, hashToken, validatePassword, verifyPassword } from "@/lib/passwords";
import { sendCareNotification } from "@/lib/email";

export async function signInWithPassword(formData: FormData) {
  const email = String(formData.get("email") ?? "").toLowerCase().trim();
  const password = String(formData.get("password") ?? "");

  const user = email
    ? await prisma.user.findUnique({
        where: { email },
        select: { id: true, passwordHash: true, platformRole: true, authorizedEmail: { select: { status: true } } }
      })
    : null;

  const isValid = user?.passwordHash ? await verifyPassword(password, user.passwordHash) : false;
  if (!user || !isValid) redirect("/sign-in?error=credentials");
  if (user.authorizedEmail?.status === "SUSPENDED" || user.authorizedEmail?.status === "REVOKED") {
    redirect("/sign-in?error=not-approved");
  }

  await createDatabaseSession(user.id);
  if (user.platformRole === "SUPER_ADMIN" || user.platformRole === "PLATFORM_ADMIN") redirect("/admin");
  redirect("/");
}

export async function createPassword(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  const validationError = validatePassword(password);

  if (validationError) redirect(`/set-password?error=${encodeURIComponent(validationError)}`);
  if (password !== confirmPassword) redirect("/set-password?error=Passwords%20do%20not%20match.");

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      passwordHash: await hashPassword(password),
      passwordSetAt: new Date()
    }
  });

  redirect("/");
}

export async function requestPasswordReset(formData: FormData) {
  const email = String(formData.get("email") ?? "").toLowerCase().trim();
  const user = email ? await prisma.user.findUnique({ where: { email } }) : null;

  if (user) {
    const reset = createResetToken();
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetTokenHash: reset.tokenHash,
        resetTokenExpiresAt: reset.expiresAt
      }
    });

    const baseUrl = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    const url = `${baseUrl.replace(/\/$/, "")}/reset-password?token=${reset.token}`;

    try {
      await sendCareNotification({
        to: [user.email],
        subject: "Reset your HarborSync password",
        preview: "Use this secure link to reset your HarborSync password.",
        body: `Reset your HarborSync password: ${url}\n\nThis link expires in 30 minutes.`
      });
    } catch (error) {
      console.error("Password reset email failed", {
        email: user.email,
        error
      });
    }
  }

  redirect("/forgot-password?sent=true");
}

export async function resetPassword(formData: FormData) {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  const validationError = validatePassword(password);

  if (validationError) redirect(`/reset-password?token=${encodeURIComponent(token)}&error=${encodeURIComponent(validationError)}`);
  if (password !== confirmPassword) redirect(`/reset-password?token=${encodeURIComponent(token)}&error=Passwords%20do%20not%20match.`);

  const tokenHash = hashToken(token);
  const user = await prisma.user.findFirst({
    where: {
      resetTokenHash: tokenHash,
      resetTokenExpiresAt: { gt: new Date() }
    }
  });

  if (!user) redirect("/reset-password?error=Reset%20link%20is%20invalid%20or%20expired.");

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: await hashPassword(password),
      passwordSetAt: new Date(),
      resetTokenHash: null,
      resetTokenExpiresAt: null
    }
  });

  redirect("/sign-in?message=password-reset");
}

export async function changePassword(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const currentPassword = String(formData.get("currentPassword") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  const validationError = validatePassword(password);

  if (validationError) redirect(`/settings?passwordError=${encodeURIComponent(validationError)}`);
  if (password !== confirmPassword) redirect("/settings?passwordError=Passwords%20do%20not%20match.");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/sign-in");

  if (user.passwordHash) {
    const isValid = await verifyPassword(currentPassword, user.passwordHash);
    if (!isValid) redirect("/settings?passwordError=Current%20password%20is%20incorrect.");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: await hashPassword(password),
      passwordSetAt: new Date()
    }
  });

  redirect("/settings?passwordUpdated=true");
}

async function createDatabaseSession(userId: string) {
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const sessionToken = randomBytes(32).toString("hex");

  await prisma.session.create({
    data: {
      sessionToken,
      userId,
      expires
    }
  });

  const cookieStore = await cookies();
  const secureCookie = Boolean(process.env.VERCEL) || process.env.AUTH_URL?.startsWith("https://") || process.env.NEXTAUTH_URL?.startsWith("https://");
  const names = secureCookie ? ["authjs.session-token", "__Secure-authjs.session-token"] : ["authjs.session-token"];

  for (const name of names) {
    cookieStore.set(name, sessionToken, {
      expires,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: secureCookie || name.startsWith("__Secure-")
    });
  }
}
