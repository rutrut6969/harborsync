import { Button } from "@/components/ui/button";

type FamilyOption = {
  id: string;
  name: string;
};

type ChildFormValue = {
  id?: string;
  fullName?: string | null;
  dateOfBirth?: Date | string | null;
  email?: string | null;
  phone?: string | null;
  streetAddress?: string | null;
  allergies?: string | null;
  conditions?: string | null;
  currentMedications?: string | null;
  primaryDoctor?: string | null;
  notes?: string | null;
  emergencyContacts?: unknown;
  caseworkerInfo?: unknown;
};

type ChildProfileFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  child?: ChildFormValue | null;
  families?: FamilyOption[];
  submitLabel: string;
};

export function ChildProfileForm({ action, child, families = [], submitLabel }: ChildProfileFormProps) {
  const emergencyContact = parseFirstContact(child?.emergencyContacts);
  const caseworker = parseCaseworker(child?.caseworkerInfo);

  return (
    <form action={action} className="space-y-5">
      {child?.id ? <input type="hidden" name="childId" value={child.id} /> : null}
      {!child?.id && families.length ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <Label title="Connect to family group">
            <select name="familyGroupId" className={fieldClass} defaultValue={families[0]?.id ?? ""}>
              <option value="">Do not connect yet</option>
              {families.map((family) => (
                <option key={family.id} value={family.id}>
                  {family.name}
                </option>
              ))}
            </select>
          </Label>
          <Label title="Relationship">
            <input name="relationship" defaultValue="Child" className={fieldClass} />
          </Label>
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <Label title="Full name">
          <input name="fullName" required defaultValue={child?.fullName ?? ""} placeholder="Child full name" className={fieldClass} />
        </Label>
        <Label title="Date of birth">
          <input name="dateOfBirth" required type="date" defaultValue={formatDate(child?.dateOfBirth)} className={fieldClass} />
        </Label>
        <Label title="Optional email">
          <input name="email" type="email" defaultValue={child?.email ?? ""} placeholder="Optional" className={fieldClass} />
        </Label>
        <Label title="Optional phone">
          <input name="phone" type="tel" defaultValue={child?.phone ?? ""} placeholder="Optional" className={fieldClass} />
        </Label>
      </div>

      <Label title="Street address">
        <input name="streetAddress" defaultValue={child?.streetAddress ?? ""} placeholder="Address if different or needed" className={fieldClass} />
      </Label>

      <div className="grid gap-3 sm:grid-cols-2">
        <Label title="Allergies">
          <textarea name="allergies" defaultValue={child?.allergies ?? ""} rows={3} placeholder="Known allergies" className={textareaClass} />
        </Label>
        <Label title="Illnesses / conditions">
          <textarea name="conditions" defaultValue={child?.conditions ?? ""} rows={3} placeholder="Conditions, diagnoses, or concerns" className={textareaClass} />
        </Label>
        <Label title="Active medications">
          <textarea name="currentMedications" defaultValue={child?.currentMedications ?? ""} rows={3} placeholder="Medication names, dosage, schedule" className={textareaClass} />
        </Label>
        <Label title="Primary doctor">
          <textarea name="primaryDoctor" defaultValue={child?.primaryDoctor ?? ""} rows={3} placeholder="Doctor, clinic, phone" className={textareaClass} />
        </Label>
      </div>

      <div className="rounded-2xl border border-border bg-[#f8fafc] p-4">
        <p className="font-semibold">Emergency Contact</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <Label title="Name">
            <input name="emergencyContactName" defaultValue={emergencyContact?.name ?? ""} className={fieldClass} />
          </Label>
          <Label title="Relationship">
            <input name="emergencyContactRelationship" defaultValue={emergencyContact?.relationship ?? ""} className={fieldClass} />
          </Label>
          <Label title="Phone">
            <input name="emergencyContactPhone" type="tel" defaultValue={emergencyContact?.phone ?? ""} className={fieldClass} />
          </Label>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-[#f8fafc] p-4">
        <p className="font-semibold">Caseworker Info</p>
        <p className="mt-1 text-sm text-slate-500">Optional, and only visible to approved users with child or case access.</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <Label title="Name">
            <input name="caseworkerName" defaultValue={caseworker?.name ?? ""} className={fieldClass} />
          </Label>
          <Label title="Email">
            <input name="caseworkerEmail" type="email" defaultValue={caseworker?.email ?? ""} className={fieldClass} />
          </Label>
          <Label title="Phone">
            <input name="caseworkerPhone" type="tel" defaultValue={caseworker?.phone ?? ""} className={fieldClass} />
          </Label>
        </div>
      </div>

      <Label title="Notes">
        <textarea name="notes" defaultValue={child?.notes ?? ""} rows={4} placeholder="Care notes, routines, access notes, or reminders" className={textareaClass} />
      </Label>

      <Button type="submit" className="w-full sm:w-auto">
        {submitLabel}
      </Button>
    </form>
  );
}

function Label({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <label className="space-y-1.5">
      <span className="text-sm font-semibold text-slate-700">{title}</span>
      {children}
    </label>
  );
}

function formatDate(value?: Date | string | null) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function parseFirstContact(value: unknown): { name?: string; relationship?: string; phone?: string } | null {
  if (!Array.isArray(value)) return null;
  const first = value[0];
  if (!first || typeof first !== "object") return null;
  return first as { name?: string; relationship?: string; phone?: string };
}

function parseCaseworker(value: unknown): { name?: string; email?: string; phone?: string } | null {
  if (!value || typeof value !== "object") return null;
  return value as { name?: string; email?: string; phone?: string };
}

const fieldClass =
  "min-h-11 w-full rounded-2xl border border-border bg-white px-4 text-sm outline-none transition focus:border-harbor focus:ring-4 focus:ring-[#3A6EA5]/10";
const textareaClass =
  "w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-harbor focus:ring-4 focus:ring-[#3A6EA5]/10";
