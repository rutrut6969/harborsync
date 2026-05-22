import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Adapter, AdapterSession } from "next-auth/adapters";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const resendApiKey = cleanEnv(process.env.AUTH_RESEND_KEY ?? process.env.RESEND_API_KEY);
const emailFrom = cleanEnv(process.env.EMAIL_FROM) ?? "HarborSync <notifications@harborsync.app>";
const googleClientId = cleanEnv(process.env.AUTH_GOOGLE_ID ?? process.env.GOOGLE_CLIENT_ID);
const googleClientSecret = cleanEnv(process.env.AUTH_GOOGLE_SECRET ?? process.env.GOOGLE_CLIENT_SECRET);
const authSecret = cleanEnv(process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET);

export const isGoogleAuthEnabled = Boolean(googleClientId && googleClientSecret);
const adapter = PrismaAdapter(prisma) as Adapter;

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: {
    ...adapter,
    async deleteSession(sessionToken): Promise<AdapterSession | undefined> {
      try {
        return await prisma.session.delete({
          where: { sessionToken }
        });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
          return undefined;
        }

        throw error;
      }
    }
  },
  secret: authSecret,
  trustHost: true,
  session: {
    strategy: "database"
  },
  pages: {
    signIn: "/sign-in"
  },
  providers: [
    ...(isGoogleAuthEnabled
      ? [
          Google({
            clientId: googleClientId,
            clientSecret: googleClientSecret
          })
        ]
      : []),
    Resend({
      apiKey: resendApiKey,
      from: emailFrom,
      async sendVerificationRequest({ identifier, provider, url }) {
        if (!provider.apiKey) {
          console.error("Resend magic link failed: missing API key env");
          throw new Error("Resend API key is not configured");
        }

        const host = new URL(url).host;
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${provider.apiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            from: provider.from,
            to: identifier,
            subject: `Sign in to HarborSync`,
            html: magicLinkHtml(url, host),
            text: `Sign in to HarborSync\n\n${url}\n\nIf you did not request this email, you can ignore it.`
          })
        });

        if (!response.ok) {
          const body = await response.text();
          console.error("Resend magic link failed", {
            status: response.status,
            body,
            from: provider.from,
            to: identifier
          });
          throw new Error(`Resend magic link failed with status ${response.status}`);
        }
      }
    })
  ],
  callbacks: {
    authorized({ auth: session, request }) {
      const isAuthenticated = Boolean(session?.user);
      const isAuthRoute = request.nextUrl.pathname.startsWith("/sign-in");
      if (isAuthRoute) return true;
      return isAuthenticated;
    },
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    }
  }
});

function cleanEnv(value?: string) {
  const cleaned = value?.trim().replace(/^["']|["']$/g, "");
  return cleaned || undefined;
}

function magicLinkHtml(url: string, host: string) {
  return `
    <div style="font-family:Inter,Arial,sans-serif;line-height:1.5;color:#2B3138">
      <h1 style="font-size:22px;margin-bottom:12px">Sign in to HarborSync</h1>
      <p>Use the secure link below to continue to ${host}.</p>
      <p style="margin:24px 0">
        <a href="${url}" style="background:#3A6EA5;color:#fff;padding:12px 18px;border-radius:12px;text-decoration:none;font-weight:700">
          Open HarborSync
        </a>
      </p>
      <p style="font-size:13px;color:#667085">If you did not request this email, you can safely ignore it.</p>
    </div>
  `;
}
