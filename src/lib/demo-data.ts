export const children = [
  {
    id: "child-1",
    name: "Avery Parker",
    dob: "2016-09-18",
    allergies: "Amoxicillin",
    conditions: "ITP monitoring",
    medications: "Prednisone 5mg",
    doctor: "Dr. Lena Ortiz"
  },
  {
    id: "child-2",
    name: "Miles Parker",
    dob: "2019-02-07",
    allergies: "None documented",
    conditions: "Seasonal asthma",
    medications: "Albuterol as needed",
    doctor: "Dr. Ben Moore"
  }
];

export const upcoming = [
  { title: "Platelet recheck", date: "Tomorrow", detail: "Riverbend Lab, 9:30 AM" },
  { title: "Care plan follow-up", date: "Fri", detail: "Virtual visit with Dr. Ortiz" }
];

export const recentLogs = [
  {
    type: "Medication",
    child: "Avery Parker",
    title: "Prednisone 5mg",
    meta: "Given at 8:04 AM by Jane"
  },
  {
    type: "Bloodwork",
    child: "Avery Parker",
    title: "Platelets 142",
    meta: "Uploaded from Riverbend Lab"
  },
  {
    type: "Doctor Visit",
    child: "Miles Parker",
    title: "Asthma action plan reviewed",
    meta: "Follow-up not required"
  }
];

export const activity = [
  "Jane Smith uploaded bloodwork for Avery Parker",
  "Raintree Advocate joined Case A-1042",
  "Sam Parker logged a missed dose for Avery Parker",
  "Follow-up scheduled with Dr. Lena Ortiz"
];

export const records = [
  {
    id: "rec-1",
    category: "Medication",
    patient: "Avery Parker",
    title: "Prednisone 5mg",
    date: "2026-05-21",
    status: "Given"
  },
  {
    id: "rec-2",
    category: "Bloodwork",
    patient: "Avery Parker",
    title: "CBC panel",
    date: "2026-05-20",
    status: "Follow-up"
  },
  {
    id: "rec-3",
    category: "Doctor Visit",
    patient: "Miles Parker",
    title: "Pediatric check-in",
    date: "2026-05-18",
    status: "Complete"
  },
  {
    id: "rec-4",
    category: "Document",
    patient: "Avery Parker",
    title: "Lab result PDF",
    date: "2026-05-20",
    status: "Uploaded"
  }
];

export const documents = [
  {
    id: "doc-1",
    title: "CBC Lab Results",
    type: "PDF",
    attachedTo: "Avery Parker",
    date: "May 20, 2026"
  },
  {
    id: "doc-2",
    title: "Asthma Action Plan",
    type: "Image",
    attachedTo: "Miles Parker",
    date: "May 18, 2026"
  }
];
