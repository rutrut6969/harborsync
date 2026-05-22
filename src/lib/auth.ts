import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "database"
  },
  pages: {
    signIn: "/sign-in"
  },
  providers: [
    Google,
    Resend({
      from: process.env.EMAIL_FROM ?? "HarborSync <notifications@harborsync.app>"
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
