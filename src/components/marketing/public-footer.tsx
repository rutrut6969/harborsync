import Link from "next/link";

export function PublicFooter() {
  return (
    <footer className="border-t border-white/80 bg-white/70">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-2xl bg-harbor text-lg font-bold text-white">H</div>
            <div>
              <p className="font-semibold">HarborSync</p>
              <p className="text-sm text-slate-500">Connected Family Coordination</p>
            </div>
          </div>
          <p className="max-w-md text-sm leading-6 text-slate-500">Built with care for families, caregivers, advocates, caseworkers, and support organizations.</p>
          <p className="mt-4 text-xs font-semibold text-teal-soft">Private Beta Development</p>
        </div>
        <div>
          <p className="font-semibold">Explore</p>
          <div className="mt-3 grid gap-2 text-sm text-slate-500">
            <Link href="/pricing">Pricing</Link>
            <Link href="/apply">Apply</Link>
            <Link href="/donate">Donations</Link>
            <Link href="/faq">FAQ</Link>
          </div>
        </div>
        <div>
          <p className="font-semibold">Contact</p>
          <div className="mt-3 grid gap-2 text-sm text-slate-500">
            <Link href="/contact">Contact HarborSync</Link>
            <span>hello@harborsync.app</span>
            <span>Privacy Policy placeholder</span>
            <span>Terms placeholder</span>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-100 px-4 py-4 text-center text-xs text-slate-400">© 2026 HarborSync. All rights reserved.</div>
    </footer>
  );
}
