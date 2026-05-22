import Link from "next/link";
import { KeyRound, Mail, ShieldCheck } from "lucide-react";
import { requestMagicLink, signInWithGoogle } from "@/app/sign-in/actions";
import { signInWithPassword } from "@/app/actions/password";
import { Button } from "@/components/ui/button";

export default async function SignInPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <section className="w-full max-w-md rounded-[1.75rem] border border-white bg-white p-6 calm-shadow">
        <div className="mb-8">
          <div className="mb-4 grid size-12 place-items-center rounded-2xl bg-harbor text-xl font-bold text-white">
            H
          </div>
          <p className="text-sm font-medium text-teal-soft">Connected Family Coordination</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-deep">Sign in to HarborSync</h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Use your approved account to access family coordination records and case activity.
          </p>
        </div>

        {params.error ? (
          <div className="mb-4 rounded-2xl border border-[#efcdcd] bg-[#fff7f7] p-3 text-sm text-[#9d4f4f]">
            {errorCopy[params.error] ?? errorCopy.credentials}
          </div>
        ) : null}

        {params.message ? (
          <div className="mb-4 rounded-2xl border border-[#cde7d6] bg-[#effaf3] p-3 text-sm text-[#417a54]">
            {messageCopy[params.message] ?? "Your account was updated."}
          </div>
        ) : null}

        <form className="space-y-3" action={signInWithPassword}>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-600">Email address</span>
            <input
              required
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@example.com"
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-600">Password</span>
            <input
              required
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="Your password"
              className={inputClass}
            />
          </label>
          <Button className="w-full" type="submit">
            <KeyRound size={18} aria-hidden />
            Sign in
          </Button>
        </form>

        <div className="mt-3 flex items-center justify-between gap-3 text-sm">
          <Link href="/forgot-password" className="font-semibold text-harbor">
            Forgot password?
          </Link>
          <span className="text-slate-400">Invite-only access</span>
        </div>

        <form className="mt-4" action={signInWithGoogle}>
          <Button className="w-full" type="submit" variant="secondary">
            Continue with Google
          </Button>
        </form>

        <details className="mt-4 rounded-2xl bg-[#f8fafc] p-3 text-sm text-slate-600">
          <summary className="cursor-pointer font-semibold text-slate-deep">Use magic link instead</summary>
          <form className="mt-3 space-y-3" action={requestMagicLink}>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-600">Email address</span>
              <input required type="email" name="email" autoComplete="email" placeholder="you@example.com" className={inputClass} />
            </label>
            <Button className="w-full" type="submit" variant="secondary">
              <Mail size={18} aria-hidden />
              Send magic link
            </Button>
          </form>
        </details>

        <div className="mt-6 flex gap-3 rounded-2xl bg-[#eef8f6] p-3 text-sm text-slate-600">
          <ShieldCheck className="shrink-0 text-teal-soft" size={20} aria-hidden />
          <p>Accounts must be invited or approved before sign-in.</p>
        </div>
      </section>
    </main>
  );
}

const inputClass =
  "touch-target w-full rounded-2xl border border-slate-200 bg-[#f8fafc] px-4 text-base outline-none transition focus:border-harbor focus:bg-white focus:ring-4 focus:ring-[#dfeaf5]";

const errorCopy: Record<string, string> = {
  credentials: "Email or password is incorrect, or this approved account has not set a password yet.",
  email: "We could not send the magic link. Check the email provider settings or try again in a moment.",
  google: "Google sign-in is not available right now. Try password or magic link sign-in instead.",
  "google-not-configured": "Google sign-in has not been configured for this deployment yet.",
  "not-approved": "This email has not been approved for HarborSync access yet."
};

const messageCopy: Record<string, string> = {
  "password-reset": "Password updated. You can sign in with your new password.",
  "invite-accepted": "Invite accepted. Sign in with the password you just created."
};
