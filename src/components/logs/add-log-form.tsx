"use client";

import { useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import type { FieldValues, Path, UseFormRegister, UseFormRegisterReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, FileHeart, Pill, Plus, Stethoscope } from "lucide-react";
import {
  bulkMedicationSchema,
  medicationLogSchema,
  type BloodworkInput,
  type DoctorVisitInput,
  type MedicationLogInput
} from "@/lib/validations/logs";
import {
  createBloodworkLog,
  createBulkMedicationLog,
  createDoctorVisitLog,
  createMedicationLog
} from "@/app/actions/logs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type LogType = "medication" | "bulk" | "doctor" | "bloodwork";
type Notice = { type: "success" | "error"; text: string };
type ChildOption = {
  id: string;
  name: string;
};

export function AddLogForm({
  initialType,
  childOptions
}: {
  initialType?: string;
  childOptions: ChildOption[];
}) {
  const [type, setType] = useState<LogType>(normalizeType(initialType));
  const [notice, setNotice] = useState<Notice | null>(null);

  if (childOptions.length === 0) {
    return (
      <div className="space-y-5">
        <PageTitle />
        <Card>
          <div className="rounded-2xl bg-[#f8fafc] p-4 text-sm leading-6 text-slate-600">
            No child profiles are connected to this account yet. Once a child profile is added or shared with you,
            quick logging tools will appear here.
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageTitle />

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {logTypes.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => {
              setType(item.value);
              setNotice(null);
            }}
            className={cn(
              "touch-target rounded-2xl border border-white bg-white p-3 text-left text-sm font-semibold text-slate-600 calm-shadow transition",
              type === item.value && "bg-[#e8f1f8] text-harbor ring-2 ring-[#c9ddec]"
            )}
          >
            <item.icon className="mb-2" size={19} aria-hidden />
            {item.label}
          </button>
        ))}
      </div>

      {notice ? (
        <div
          className={cn(
            "rounded-2xl border p-3 text-sm font-medium",
            notice.type === "success"
              ? "border-[#cde7d6] bg-[#effaf3] text-[#417a54]"
              : "border-[#efcdcd] bg-[#fff7f7] text-[#9d4f4f]"
          )}
        >
          {notice.text}
        </div>
      ) : null}

      {type === "bulk" ? (
        <BulkMedicationForm childOptions={childOptions} onNotice={setNotice} />
      ) : type === "doctor" ? (
        <DoctorVisitForm childOptions={childOptions} onNotice={setNotice} />
      ) : type === "bloodwork" ? (
        <BloodworkForm childOptions={childOptions} onNotice={setNotice} />
      ) : (
        <MedicationForm childOptions={childOptions} onNotice={setNotice} />
      )}
    </div>
  );
}

function MedicationForm({ childOptions, onNotice }: { childOptions: ChildOption[]; onNotice: (notice: Notice) => void }) {
  const { register, handleSubmit, reset, formState } = useForm<MedicationLogInput>({
    defaultValues: defaultMedication(childOptions[0]?.id),
    resolver: zodResolver(medicationLogSchema)
  });

  return (
    <Card>
      <form
        className="space-y-4"
        onSubmit={handleSubmit(async (values) => {
          try {
            await createMedicationLog(values);
            reset(defaultMedication(values.childId));
            onNotice({ type: "success", text: "Medication log saved and added to Records." });
          } catch {
            onNotice({ type: "error", text: "Medication log could not be saved. Please check the fields and try again." });
          }
        })}
      >
        <MedicationFields childOptions={childOptions} register={register} />
        <Button className="w-full" type="submit" disabled={formState.isSubmitting}>
          {formState.isSubmitting ? "Saving..." : "Save medication log"}
        </Button>
      </form>
    </Card>
  );
}

function BulkMedicationForm({ childOptions, onNotice }: { childOptions: ChildOption[]; onNotice: (notice: Notice) => void }) {
  const batchId = useMemo(() => `batch-${Date.now().toString(36)}`, []);
  const [openIndex, setOpenIndex] = useState(0);
  const { register, control, handleSubmit, reset, formState, watch } = useForm<{ entries: MedicationLogInput[] }>({
    defaultValues: { entries: [defaultMedication(childOptions[0]?.id)] },
    resolver: zodResolver(bulkMedicationSchema)
  });
  const { fields, append, remove } = useFieldArray({ control, name: "entries" });
  const watchedEntries = watch("entries");

  return (
    <Card>
      <form
        className="space-y-4"
        onSubmit={handleSubmit(async (values) => {
          try {
            await createBulkMedicationLog(values);
            reset({ entries: [defaultMedication(values.entries[0]?.childId ?? childOptions[0]?.id)] });
            setOpenIndex(0);
            onNotice({ type: "success", text: `${values.entries.length} medication entries saved to Records.` });
          } catch {
            onNotice({ type: "error", text: "Bulk medication log could not be saved. Please review each entry." });
          }
        })}
      >
        <div className="rounded-2xl bg-[#f4f8fb] p-3 text-sm text-slate-500">
          Batch ID: <span className="font-semibold text-slate-deep">{batchId}</span> - Entry method: bulk
        </div>
        {fields.map((field, index) => (
          <div key={field.id} className="overflow-hidden rounded-2xl border border-slate-100">
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              className="touch-target flex w-full items-center justify-between gap-3 bg-[#f8fafc] px-3 py-3 text-left"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Entry {index + 1}</p>
                <p className="mt-1 font-semibold text-slate-deep">{entrySummary(watchedEntries?.[index], childOptions)}</p>
              </div>
              <ChevronDown className={cn("shrink-0 text-slate-400 transition", openIndex === index && "rotate-180")} size={18} aria-hidden />
            </button>
            {openIndex === index ? (
              <div className="space-y-3 p-3">
              {fields.length > 1 ? (
                <button
                  type="button"
                  className="text-sm font-semibold text-error-muted"
                  onClick={() => {
                    remove(index);
                    setOpenIndex(Math.max(0, index - 1));
                  }}
                >
                  Remove
                </button>
              ) : null}
                <MedicationFields childOptions={childOptions} prefix={`entries.${index}.`} register={register} />
              </div>
            ) : null}
          </div>
        ))}
        <Button
          type="button"
          variant="secondary"
          className="w-full"
          onClick={() => {
            append(defaultMedication(childOptions[0]?.id));
            setOpenIndex(fields.length);
          }}
        >
          <Plus size={18} aria-hidden />
          Add Entry
        </Button>
        <Button className="w-full" type="submit" disabled={formState.isSubmitting}>
          {formState.isSubmitting ? "Saving..." : "Save bulk log"}
        </Button>
      </form>
    </Card>
  );
}

function entrySummary(entry: MedicationLogInput | undefined, childOptions: ChildOption[]) {
  const childName = childOptions.find((child) => child.id === entry?.childId)?.name ?? "Choose patient";
  const medication = entry?.medicationName || "Medication";
  const time = entry?.timeGiven || "Time";
  return `${medication} - ${childName} - ${time}`;
}

function DoctorVisitForm({ childOptions, onNotice }: { childOptions: ChildOption[]; onNotice: (notice: Notice) => void }) {
  const { register, handleSubmit, reset, formState } = useForm<DoctorVisitInput>({
    defaultValues: { childId: childOptions[0]?.id }
  });

  return (
    <Card>
      <form
        className="space-y-4"
        onSubmit={handleSubmit(async (values) => {
          try {
            await createDoctorVisitLog(values);
            reset({ childId: values.childId });
            onNotice({ type: "success", text: "Doctor visit saved and added to Records." });
          } catch {
            onNotice({ type: "error", text: "Doctor visit could not be saved. Please check required fields." });
          }
        })}
      >
        <PatientSelect childOptions={childOptions} register={register("childId")} />
        <Field label="Appointment date" type="date" {...register("appointmentDate")} />
        <Field label="Appointment time" type="time" {...register("appointmentTime")} />
        <Field label="Doctor name" {...register("doctorName")} />
        <Field label="Specialty" {...register("specialty")} />
        <Textarea label="Reason for visit" {...register("reasonForVisit")} />
        <Textarea label="Diagnosis / outcome" {...register("diagnosisOutcome")} />
        <label className="flex items-center justify-between rounded-2xl bg-[#f4f8fb] p-3 text-sm font-medium">
          Follow-up required
          <input type="checkbox" className="size-5 accent-[#3A6EA5]" {...register("followUpRequired")} />
        </label>
        <Field label="Follow-up date" type="date" {...register("followUpDate")} />
        <Button className="w-full" type="submit" disabled={formState.isSubmitting}>
          {formState.isSubmitting ? "Saving..." : "Save doctor visit"}
        </Button>
      </form>
    </Card>
  );
}

function BloodworkForm({ childOptions, onNotice }: { childOptions: ChildOption[]; onNotice: (notice: Notice) => void }) {
  const { register, handleSubmit, reset, formState } = useForm<BloodworkInput>({
    defaultValues: { childId: childOptions[0]?.id }
  });

  return (
    <Card>
      <form
        className="space-y-4"
        onSubmit={handleSubmit(async (values) => {
          try {
            await createBloodworkLog(values);
            reset({ childId: values.childId });
            onNotice({ type: "success", text: "Bloodwork saved and added to Records." });
          } catch {
            onNotice({ type: "error", text: "Bloodwork could not be saved. Please check required fields." });
          }
        })}
      >
        <PatientSelect childOptions={childOptions} register={register("childId")} />
        <Field label="Bloodwork date" type="date" {...register("bloodworkDate")} />
        <Field label="Facility" {...register("facility")} />
        <Field label="Ordering doctor" {...register("orderingDoctor")} />
        <Textarea label="Lab reason" {...register("labReason")} />
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Platelets" inputMode="decimal" {...register("plateletCount")} />
          <Field label="Hemoglobin" inputMode="decimal" {...register("hemoglobin")} />
          <Field label="WBC" inputMode="decimal" {...register("whiteBloodCellCount")} />
        </div>
        <Textarea label="Notes" {...register("notes")} />
        <label className="flex items-center justify-between rounded-2xl bg-[#f4f8fb] p-3 text-sm font-medium">
          Follow-up required
          <input type="checkbox" className="size-5 accent-[#3A6EA5]" {...register("followUpRequired")} />
        </label>
        <Button className="w-full" type="submit" disabled={formState.isSubmitting}>
          {formState.isSubmitting ? "Saving..." : "Save bloodwork"}
        </Button>
      </form>
    </Card>
  );
}

function MedicationFields<T extends FieldValues>({
  childOptions,
  register,
  prefix = ""
}: {
  childOptions: ChildOption[];
  register: UseFormRegister<T>;
  prefix?: string;
}) {
  const field = (name: string) => `${prefix}${name}` as Path<T>;

  return (
    <div className="space-y-3">
      <PatientSelect childOptions={childOptions} register={register(field("childId"))} />
      <Field label="Medication name" {...register(field("medicationName"))} />
      <div className="grid grid-cols-[1fr_7rem] gap-3">
        <Field label="Dosage" inputMode="decimal" {...register(field("dosage"))} />
        <Field label="Unit" placeholder="mg" {...register(field("doseUnit"))} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Date given" type="date" {...register(field("dateGiven"))} />
        <Field label="Time" type="time" {...register(field("timeGiven"))} />
      </div>
      <Field label="Administered by" {...register(field("administeredByName"))} />
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-slate-600">Dose status</span>
        <select className={inputClass} {...register(field("status"))}>
          <option value="GIVEN">Given</option>
          <option value="LATE">Late</option>
          <option value="MISSED">Missed</option>
          <option value="REFUSED">Refused</option>
        </select>
      </label>
      <Textarea label="Notes" {...register(field("notes"))} />
      <Textarea label="Side effects" {...register(field("sideEffects"))} />
    </div>
  );
}

function PatientSelect({ childOptions, register }: { childOptions: ChildOption[]; register: UseFormRegisterReturn }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-600">Patient</span>
      <select className={inputClass} {...register}>
        <option value="">Choose patient</option>
        {childOptions.map((child) => (
          <option key={child.id} value={child.id}>
            {child.name}
          </option>
        ))}
      </select>
    </label>
  );
}

function Field({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-600">{label}</span>
      <input className={inputClass} {...props} />
    </label>
  );
}

function Textarea({ label, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-600">{label}</span>
      <textarea rows={3} className={cn(inputClass, "min-h-24 py-3")} {...props} />
    </label>
  );
}

function defaultMedication(childId = ""): MedicationLogInput {
  const now = new Date();
  return {
    childId,
    medicationName: "",
    dosage: 1,
    doseUnit: "mg",
    dateGiven: now.toISOString().slice(0, 10),
    timeGiven: now.toTimeString().slice(0, 5),
    administeredByName: "",
    status: "GIVEN",
    notes: "",
    sideEffects: ""
  };
}

function normalizeType(type?: string): LogType {
  if (type === "doctor") return "doctor";
  if (type === "bloodwork") return "bloodwork";
  if (type === "bulk") return "bulk";
  return "medication";
}

function PageTitle() {
  return (
    <div>
      <p className="text-sm font-medium text-teal-soft">Fast daily entry</p>
      <h1 className="text-2xl font-semibold">Add Log</h1>
    </div>
  );
}

const logTypes = [
  { value: "medication" as const, label: "Medication", icon: Pill },
  { value: "bulk" as const, label: "Bulk Meds", icon: Plus },
  { value: "doctor" as const, label: "Doctor Visit", icon: Stethoscope },
  { value: "bloodwork" as const, label: "Bloodwork", icon: FileHeart }
];

const inputClass =
  "touch-target w-full rounded-2xl border border-slate-200 bg-[#f8fafc] px-4 text-base outline-none transition focus:border-harbor focus:bg-white focus:ring-4 focus:ring-[#dfeaf5]";
