import { Building2, ShieldCheck, UsersRound } from "lucide-react";
import { Card, SectionHeader } from "@/components/ui/card";

export default function ProfilePage() {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-medium text-teal-soft">Account and access</p>
        <h1 className="text-2xl font-semibold">Profile</h1>
      </div>

      <Card>
        <SectionHeader title="Relationship-Based Access" />
        <div className="grid gap-3 sm:grid-cols-3">
          {items.map((item) => (
            <div key={item.title} className="rounded-2xl bg-[#f4f8fb] p-4">
              <item.icon className="mb-3 text-harbor" size={22} aria-hidden />
              <p className="font-semibold">{item.title}</p>
              <p className="mt-1 text-sm text-slate-500">{item.text}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SectionHeader title="Organization Registration" />
        <p className="text-sm leading-6 text-slate-500">
          Organization accounts support approved domains, inactive seats until approval, administrators,
          caseworkers, advocates, and family sponsorships. Domain-based matching can prefill requests, but
          activation remains approval gated.
        </p>
      </Card>
    </div>
  );
}

const items = [
  {
    title: "Family Groups",
    text: "Separated parents and blended families can coordinate independently.",
    icon: UsersRound
  },
  {
    title: "Case Roles",
    text: "A user can have different permissions for each child and case.",
    icon: ShieldCheck
  },
  {
    title: "Organizations",
    text: "Approved teams can sponsor families and assign professionals.",
    icon: Building2
  }
];
