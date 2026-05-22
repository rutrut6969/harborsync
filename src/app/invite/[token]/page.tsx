import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { acceptInvite } from "@/app/actions/invitations";
import { Button } from "@/components/ui/button";

export default async function InvitePage({
  params,
  searchParams
}: {
  params: Promise<{ token: string }>;
  searchParams?: Promise<{ error?: string }>;
}) {
  const { token } = await params;
  const query = await searchParams;
  const invite = await prisma.invitation.findUnique({
    where: { token },
    include: {
      sender: true,
      familyGroup: true,
      case: true,
      organization: true
    }
  });

  if (!invite) notFound();
  const isOpen = invite.status === "PENDING" && invite.expiresAt > new Date();

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <section className="w-full max-w-md rounded-[1.75rem] border border-white bg-white p-6 calm-shadow">
        <div className="mb-6">
          <div className="mb-4 grid size-12 place-items-center rounded-2xl bg-harbor text-xl font-bold text-white">H</div>
          <p className="text-sm font-medium text-teal-soft">Approved invitation</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-deep">Join HarborSync</h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            {invite.sender.name ?? invite.sender.email} invited {invite.email} as {toTitle(invite.role)}.
          </p>
        </div>

        <div className="mb-4 rounded-2xl bg-[#f8fafc] p-3 text-sm text-slate-600">
          <p><span className="font-semibold text-slate-deep">Family:</span> {invite.familyGroup?.name ?? "Not attached"}</p>
          <p><span className="font-semibold text-slate-deep">Case:</span> {invite.case?.title ?? "Not attached"}</p>
          <p><span className="font-semibold text-slate-deep">Organization:</span> {invite.organization?.name ?? "Not attached"}</p>
        </div>

        {query?.error ? (
          <div className="mb-4 rounded-2xl border border-[#efcdcd] bg-[#fff7f7] p-3 text-sm text-[#9d4f4f]">
            {query.error}
          </div>
        ) : null}

        {isOpen ? (
          <form action={acceptInvite} className="space-y-3">
            <input type="hidden" name="token" value={token} />
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-600">Your name</span>
              <input required name="name" autoComplete="name" className={inputClass} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-600">Create password</span>
              <input required type="password" name="password" autoComplete="new-password" minLength={10} className={inputClass} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-600">Confirm password</span>
              <input required type="password" name="confirmPassword" autoComplete="new-password" minLength={10} className={inputClass} />
            </label>
            <p className="text-xs leading-5 text-slate-500">Use at least 10 characters with one letter and one number.</p>
            <Button className="w-full" type="submit">Accept invite</Button>
          </form>
        ) : (
          <div className="rounded-2xl bg-[#fff7f7] p-3 text-sm text-error-muted">
            This invite is no longer active. Ask the family admin to resend access.
          </div>
        )}
      </section>
    </main>
  );
}

const inputClass =
  "touch-target w-full rounded-2xl border border-slate-200 bg-[#f8fafc] px-4 text-base outline-none transition focus:border-harbor focus:bg-white focus:ring-4 focus:ring-[#dfeaf5]";

function toTitle(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
