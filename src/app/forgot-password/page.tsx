import Link from "next/link";
import { requestPasswordReset } from "@/app/actions/password";
import { Button } from "@/components/ui/button";

export default async function ForgotPasswordPage({
  searchParams
}: {
  searchParams: Promise<{ sent?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <section className="w-full max-w-md rounded-[1.75rem] border border-white bg-white p-6 calm-shadow">
        <div className="mb-6">
          <div className="mb-4 grid size-12 place-items-center rounded-2xl bg-harbor text-xl font-bold text-white">H</div>
          <p className="text-sm font-medium text-teal-soft">Password recovery</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-deep">Reset your password</h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Enter your approved account email. If it exists, HarborSync will send a reset link.
          </p>
        </div>

        {params.sent ? (
          <div className="mb-4 rounded-2xl border border-[#cde7d6] bg-[#effaf3] p-3 text-sm text-[#417a54]">
            If that email is approved, a reset link has been sent.
          </div>
        ) : null}

        <form className="space-y-3" action={requestPasswordReset}>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-600">Email address</span>
            <input required type="email" name="email" autoComplete="email" placeholder="you@example.com" className={inputClass} />
          </label>
          <Button className="w-full" type="submit">Send reset link</Button>
        </form>

        <Link href="/sign-in" className="mt-4 block text-center text-sm font-semibold text-harbor">
          Back to sign in
        </Link>
      </section>
    </main>
  );
}

const inputClass =
  "touch-target w-full rounded-2xl border border-slate-200 bg-[#f8fafc] px-4 text-base outline-none transition focus:border-harbor focus:bg-white focus:ring-4 focus:ring-[#dfeaf5]";
