import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

const resendApiKey = cleanEnv(process.env.AUTH_RESEND_KEY ?? process.env.RESEND_API_KEY);
const emailFrom = cleanEnv(process.env.EMAIL_FROM) ?? "HarborSync <notifications@harborsync.app>";
const googleClientId = cleanEnv(process.env.AUTH_GOOGLE_ID ?? process.env.GOOGLE_CLIENT_ID);
const googleClientSecret = cleanEnv(process.env.AUTH_GOOGLE_SECRET ?? process.env.GOOGLE_CLIENT_SECRET);
const authSecret = cleanEnv(process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET);

export const isGoogleAuthEnabled = Boolean(googleClientId && googleClientSecret);

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
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
      from: emailFrom
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
