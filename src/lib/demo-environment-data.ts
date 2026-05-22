export const demoChildren = [
  {
    id: "demo-avery",
    fullName: "Avery Parker",
    age: "9",
    dob: "Sep 18, 2016",
    allergies: "Amoxicillin",
    conditions: "ITP monitoring",
    medications: "Prednisone 5mg, Vitamin D",
    primaryDoctor: "Dr. Lena Ortiz",
    emergencyContact: "Jane Smith - Parent"
  },
  {
    id: "demo-miles",
    fullName: "Miles Parker",
    age: "7",
    dob: "Feb 7, 2019",
    allergies: "None documented",
    conditions: "Seasonal asthma",
    medications: "Albuterol as needed",
    primaryDoctor: "Dr. Ben Moore",
    emergencyContact: "Sam Parker - Parent"
  }
];

export const demoOrganizations = [
  {
    name: "Raintree Family Support",
    type: "Advocacy organization",
    role: "Family sponsor",
    status: "Active"
  },
  {
    name: "County Child Services",
    type: "CPS",
    role: "Case participant",
    status: "Monitoring"
  }
];

export const demoCases = [
  {
    id: "CASE-A1042",
    title: "Case A-1042",
    child: "Avery Parker",
    organization: "Raintree Family Support",
    status: "Open",
    participants: "Parent, advocate, caseworker"
  },
  {
    id: "CASE-B7781",
    title: "Care Coordination Review",
    child: "Miles Parker",
    organization: "County Child Services",
    status: "Monitoring",
    participants: "Parents, pediatrician, caseworker"
  }
];

export const demoRecords = [
  {
    id: "med-1",
    category: "Medication",
    patient: "Avery Parker",
    title: "Prednisone 5mg",
    date: "2026-05-21",
    status: "Given",
    detail: "Administered at 8:04 AM by Jane Smith. Taken with breakfast."
  },
  {
    id: "med-2",
    category: "Medication",
    patient: "Miles Parker",
    title: "Albuterol inhaler",
    date: "2026-05-20",
    status: "Late",
    detail: "Given after outdoor activity. No side effects reported."
  },
  {
    id: "visit-1",
    category: "Doctor Visit",
    patient: "Miles Parker",
    title: "Asthma action plan review",
    date: "2026-05-18",
    status: "Complete",
    detail: "Dr. Ben Moore updated the action plan. No immediate follow-up required."
  },
  {
    id: "visit-2",
    category: "Doctor Visit",
    patient: "Avery Parker",
    title: "Hematology follow-up",
    date: "2026-05-17",
    status: "Follow-up",
    detail: "Dr. Lena Ortiz requested repeat CBC bloodwork in one week."
  },
  {
    id: "blood-1",
    category: "Bloodwork",
    patient: "Avery Parker",
    title: "CBC panel",
    date: "2026-05-20",
    status: "Follow-up",
    detail: "Platelets 142, hemoglobin 12.8, WBC 6.1. Repeat labs scheduled."
  },
  {
    id: "doc-1",
    category: "Document",
    patient: "Avery Parker",
    title: "CBC Lab Results PDF",
    date: "2026-05-20",
    status: "Uploaded",
    detail: "Attached to Case A-1042 and Avery Parker."
  }
];

export const demoDocuments = [
  {
    id: "demo-doc-1",
    title: "CBC Lab Results",
    type: "PDF",
    attachedTo: "Avery Parker",
    date: "May 20, 2026",
    size: "240 KB"
  },
  {
    id: "demo-doc-2",
    title: "Asthma Action Plan",
    type: "Image",
    attachedTo: "Miles Parker",
    date: "May 18, 2026",
    size: "1.2 MB"
  },
  {
    id: "demo-doc-3",
    title: "Care Coordination Summary",
    type: "PDF",
    attachedTo: "Case A-1042",
    date: "May 15, 2026",
    size: "318 KB"
  }
];

export const demoActivity = [
  "Jane Smith uploaded bloodwork for Avery Parker",
  "Raintree Family Support joined Case A-1042",
  "Sam Parker logged an asthma medication update",
  "Follow-up scheduled with Dr. Lena Ortiz",
  "County Child Services reviewed case participation"
];

export const demoFollowUps = [
  {
    title: "Platelet recheck",
    date: "Tomorrow",
    detail: "Riverbend Lab, 9:30 AM"
  },
  {
    title: "Care plan follow-up",
    date: "Friday",
    detail: "Virtual visit with Dr. Ortiz"
  }
];
