"use server";

import { AuthError } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";
import { isGoogleAuthEnabled, signIn } from "@/lib/auth";

export async function requestMagicLink(formData: FormData) {
  try {
    await signIn("resend", {
      email: String(formData.get("email") ?? ""),
      redirectTo: "/"
    });
  } catch (error) {
    if (isRedirectError(error)) throw error;

    console.error("Magic link sign-in failed", formatAuthError(error));
    redirect("/sign-in?error=email");
  }
}

export async function signInWithGoogle() {
  if (!isGoogleAuthEnabled) {
    redirect("/sign-in?error=google-not-configured");
  }

  try {
    await signIn("google", { redirectTo: "/" });
  } catch (error) {
    if (isRedirectError(error)) throw error;

    console.error("Google sign-in failed", formatAuthError(error));
    redirect("/sign-in?error=google");
  }
}

function formatAuthError(error: unknown) {
  if (error instanceof AuthError) {
    return {
      type: error.type,
      cause: error.cause
    };
  }

  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message
    };
  }

  return error;
}
