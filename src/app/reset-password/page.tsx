import Link from "next/link";
import { resetPassword } from "@/app/actions/password";
import { Button } from "@/components/ui/button";

export default async function ResetPasswordPage({
  searchParams
}: {
  searchParams: Promise<{ token?: string; error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <section className="w-full max-w-md rounded-[1.75rem] border border-white bg-white p-6 calm-shadow">
        <div className="mb-6">
          <div className="mb-4 grid size-12 place-items-center rounded-2xl bg-harbor text-xl font-bold text-white">H</div>
          <p className="text-sm font-medium text-teal-soft">Password recovery</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-deep">Choose a new password</h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">Reset links expire after 30 minutes.</p>
        </div>

        {params.error ? (
          <div className="mb-4 rounded-2xl border border-[#efcdcd] bg-[#fff7f7] p-3 text-sm text-[#9d4f4f]">
            {params.error}
          </div>
        ) : null}

        {params.token ? (
          <form className="space-y-3" action={resetPassword}>
            <input type="hidden" name="token" value={params.token} />
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-600">New password</span>
              <input required type="password" name="password" autoComplete="new-password" className={inputClass} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-600">Confirm password</span>
              <input required type="password" name="confirmPassword" autoComplete="new-password" className={inputClass} />
            </label>
            <p className="text-xs leading-5 text-slate-500">Use at least 10 characters with one letter and one number.</p>
            <Button className="w-full" type="submit">Reset password</Button>
          </form>
        ) : (
          <div className="rounded-2xl bg-[#f8fafc] p-3 text-sm text-slate-600">Reset token is missing.</div>
        )}

        <Link href="/sign-in" className="mt-4 block text-center text-sm font-semibold text-harbor">
          Back to sign in
        </Link>
      </section>
    </main>
  );
}

const inputClass =
  "touch-target w-full rounded-2xl border border-slate-200 bg-[#f8fafc] px-4 text-base outline-none transition focus:border-harbor focus:bg-white focus:ring-4 focus:ring-[#dfeaf5]";
