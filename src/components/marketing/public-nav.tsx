import Link from "next/link";
import { Menu } from "lucide-react";

const links = [
  { href: "/#features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/#organizations", label: "Organizations" },
  { href: "/apply", label: "Beta Access" },
  { href: "/donate", label: "Donations" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" }
];

export function PublicNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-background/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-2xl bg-harbor text-lg font-bold text-white shadow-sm">H</div>
          <div>
            <p className="text-base font-semibold leading-tight text-slate-deep">HarborSync</p>
            <p className="text-xs text-slate-500">Connected Family Coordination</p>
          </div>
        </Link>
        <div className="hidden items-center gap-5 lg:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-semibold text-slate-600 transition hover:text-harbor">
              {link.label}
            </Link>
          ))}
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <Link href="/sign-in" className="touch-target rounded-2xl px-4 py-2 text-sm font-semibold text-harbor transition hover:bg-[#e8f1f8]">
            Log In
          </Link>
          <Link href="/apply" className="touch-target rounded-2xl bg-harbor px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#315f91]">
            Apply Now
          </Link>
        </div>
        <details className="relative sm:hidden">
          <summary className="grid size-11 cursor-pointer list-none place-items-center rounded-2xl bg-white text-harbor calm-shadow">
            <Menu size={21} aria-hidden />
            <span className="sr-only">Open navigation</span>
          </summary>
          <div className="absolute right-0 mt-2 w-[min(18rem,calc(100vw-2rem))] rounded-3xl border border-white bg-white p-3 calm-shadow">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="block rounded-2xl px-3 py-3 text-sm font-semibold text-slate-600 hover:bg-[#f4f8fb]">
                {link.label}
              </Link>
            ))}
            <div className="mt-2 grid gap-2">
              <Link href="/sign-in" className="touch-target rounded-2xl bg-[#e8f1f8] px-3 text-center text-sm font-semibold text-harbor">Log In</Link>
              <Link href="/apply" className="touch-target rounded-2xl bg-harbor px-3 text-center text-sm font-semibold text-white">Apply Now</Link>
            </div>
          </div>
        </details>
      </nav>
    </header>
  );
}
