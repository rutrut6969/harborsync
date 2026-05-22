import { Mail, ShieldCheck } from "lucide-react";
import { isGoogleAuthEnabled } from "@/lib/auth";
import { requestMagicLink, signInWithGoogle } from "@/app/sign-in/actions";
import { Button } from "@/components/ui/button";

export default async function SignInPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
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
            Private records, coordinated care, and case documentation for the people invited to support a child.
          </p>
        </div>

        {params.error ? (
          <div className="mb-4 rounded-2xl border border-[#efcdcd] bg-[#fff7f7] p-3 text-sm text-[#9d4f4f]">
            {errorCopy[params.error] ?? errorCopy.email}
          </div>
        ) : null}

        <form
          className="space-y-3"
          action={requestMagicLink}
        >
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-600">Email address</span>
            <input
              required
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="touch-target w-full rounded-2xl border border-slate-200 bg-[#f8fafc] px-4 text-base outline-none transition focus:border-harbor focus:bg-white focus:ring-4 focus:ring-[#dfeaf5]"
            />
          </label>
          <Button className="w-full" type="submit">
            <Mail size={18} aria-hidden />
            Send magic link
          </Button>
        </form>

        {isGoogleAuthEnabled ? (
          <form className="mt-3" action={signInWithGoogle}>
            <Button className="w-full" type="submit" variant="secondary">
              Continue with Google
            </Button>
          </form>
        ) : null}

        <div className="mt-6 flex gap-3 rounded-2xl bg-[#eef8f6] p-3 text-sm text-slate-600">
          <ShieldCheck className="shrink-0 text-teal-soft" size={20} aria-hidden />
          <p>Access is invitation and relationship based. There is no public anonymous access.</p>
        </div>
      </section>
    </main>
  );
}

const errorCopy: Record<string, string> = {
  email:
    "We could not send the magic link. Check the email provider settings or try again in a moment.",
  google:
    "Google sign-in is not available right now. Try magic link sign-in instead.",
  "google-not-configured":
    "Google sign-in has not been configured for this deployment yet."
};
