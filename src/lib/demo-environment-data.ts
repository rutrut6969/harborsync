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

export const demoNotifications = [
  {
    id: "demo-notification-1",
    title: "Bloodwork follow-up due",
    description: "Avery has a repeat CBC scheduled tomorrow at Riverbend Lab.",
    timestamp: "12 min ago",
    status: "Unread",
    type: "Reminder"
  },
  {
    id: "demo-notification-2",
    title: "Lab result uploaded",
    description: "CBC Lab Results PDF was attached to Avery Parker and Case A-1042.",
    timestamp: "Today",
    status: "Unread",
    type: "Document"
  },
  {
    id: "demo-notification-3",
    title: "Case note added",
    description: "Raintree Family Support added a coordination update.",
    timestamp: "Yesterday",
    status: "Read",
    type: "Case"
  }
];

export const demoFamilyMembers = [
  {
    id: "demo-family-1",
    name: "Jordan Parker",
    relationship: "Parent",
    role: "Family Admin",
    access: "Full access",
    status: "Active",
    newCount: 0
  },
  {
    id: "demo-family-2",
    name: "Sam Parker",
    relationship: "Parent",
    role: "Family Member",
    access: "Can log and upload",
    status: "Active",
    newCount: 2
  },
  {
    id: "demo-family-3",
    name: "Maya Chen",
    relationship: "Advocate",
    role: "Advocate",
    access: "Case access",
    status: "Active",
    newCount: 1
  },
  {
    id: "demo-family-4",
    name: "Chris Rowe",
    relationship: "Caregiver",
    role: "Caregiver",
    access: "Medication logs only",
    status: "Invite pending",
    newCount: 0
  }
];

export const demoSettings = {
  name: "Jordan Parker",
  preferredName: "Jordan",
  email: "demo.family@harborsync.test",
  phone: "(555) 014-2264",
  alternateEmail: "careteam-demo@harborsync.test",
  mailingAddress: "Demo address hidden",
  contactMethod: "Email",
  accountStatus: "Demo active",
  googleStatus: "Connected in demo",
  notificationPreferences: [
    "Medication reminders",
    "Bloodwork reminders",
    "Case updates",
    "Document uploads",
    "Organization messages",
    "Weekly summaries"
  ]
};
