import { z } from "zod";

export const medicationLogSchema = z.object({
  childId: z.string().min(1, "Choose a patient"),
  medicationName: z.string().min(1, "Medication is required"),
  dosage: z.coerce.number().positive("Dose must be greater than zero"),
  doseUnit: z.string().min(1, "Dose unit is required"),
  dateGiven: z.string().min(1, "Date is required"),
  timeGiven: z.string().min(1, "Time is required"),
  administeredByName: z.string().optional(),
  status: z.enum(["GIVEN", "LATE", "MISSED", "REFUSED"]),
  notes: z.string().optional(),
  sideEffects: z.string().optional()
});

export const bulkMedicationSchema = z.object({
  entries: z.array(medicationLogSchema).min(1)
});

export const doctorVisitSchema = z.object({
  childId: z.string().min(1, "Choose a patient"),
  appointmentDate: z.string().min(1),
  appointmentTime: z.string().optional(),
  doctorName: z.string().min(1),
  specialty: z.string().optional(),
  reasonForVisit: z.string().min(1),
  diagnosisOutcome: z.string().optional(),
  followUpRequired: z.coerce.boolean().default(false),
  followUpDate: z.string().optional()
});

export const bloodworkSchema = z.object({
  childId: z.string().min(1, "Choose a patient"),
  bloodworkDate: z.string().min(1),
  facility: z.string().optional(),
  orderingDoctor: z.string().optional(),
  labReason: z.string().optional(),
  plateletCount: z.coerce.number().optional(),
  hemoglobin: z.coerce.number().optional(),
  whiteBloodCellCount: z.coerce.number().optional(),
  notes: z.string().optional(),
  followUpRequired: z.coerce.boolean().default(false)
});

export type MedicationLogInput = z.infer<typeof medicationLogSchema>;
export type DoctorVisitInput = z.infer<typeof doctorVisitSchema>;
export type BloodworkInput = z.infer<typeof bloodworkSchema>;
