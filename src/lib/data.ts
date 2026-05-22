import { format } from "date-fns";
import { prisma } from "@/lib/prisma";

export async function getAccessibleChildren(userId: string) {
  return prisma.childProfile.findMany({
    where: {
      OR: [
        {
          permissions: {
            some: { userId }
          }
        },
        {
          families: {
            some: {
              familyGroup: {
                memberships: {
                  some: { userId }
                }
              }
            }
          }
        }
      ]
    },
    orderBy: { fullName: "asc" }
  });
}

export async function getDashboardData(userId: string) {
  const children = await getAccessibleChildren(userId);
  const childIds = children.map((child) => child.id);

  const [medicationLogs, bloodworkLogs, doctorVisits, auditLogs] = await Promise.all([
    prisma.medicationLog.findMany({
      where: { childId: { in: childIds } },
      include: { child: true },
      orderBy: { createdAt: "desc" },
      take: 5
    }),
    prisma.bloodworkLog.findMany({
      where: { childId: { in: childIds } },
      include: { child: true },
      orderBy: { createdAt: "desc" },
      take: 5
    }),
    prisma.doctorVisitLog.findMany({
      where: { childId: { in: childIds } },
      include: { child: true },
      orderBy: { createdAt: "desc" },
      take: 5
    }),
    prisma.auditLog.findMany({
      where: { childId: { in: childIds } },
      orderBy: { createdAt: "desc" },
      take: 5
    })
  ]);

  const recentLogs = [
    ...medicationLogs.map((log) => ({
      type: "Medication",
      child: log.child.fullName,
      title: `${log.medicationName} ${log.dosage.toString()}${log.doseUnit}`,
      meta: `${toTitle(log.status)} at ${log.timeGiven} by ${log.administeredByName ?? "care team"}`,
      createdAt: log.createdAt
    })),
    ...bloodworkLogs.map((log) => ({
      type: "Bloodwork",
      child: log.child.fullName,
      title: log.plateletCount ? `Platelets ${log.plateletCount.toString()}` : "Bloodwork logged",
      meta: log.facility ? `Uploaded from ${log.facility}` : "Lab results added",
      createdAt: log.createdAt
    })),
    ...doctorVisits.map((log) => ({
      type: "Doctor Visit",
      child: log.child.fullName,
      title: log.diagnosisOutcome ?? log.reasonForVisit,
      meta: log.followUpRequired ? "Follow-up required" : "Follow-up not required",
      createdAt: log.createdAt
    }))
  ]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  const upcoming = [
    ...bloodworkLogs
      .filter((log) => log.followUpRequired)
      .map((log) => ({
        title: "Bloodwork follow-up",
        date: "Soon",
        detail: `${log.child.fullName}${log.facility ? ` · ${log.facility}` : ""}`
      })),
    ...doctorVisits
      .filter((log) => log.followUpRequired && log.followUpDate)
      .map((log) => ({
        title: "Doctor follow-up",
        date: log.followUpDate ? format(log.followUpDate, "MMM d") : "Soon",
        detail: `${log.child.fullName} · ${log.doctorName}`
      }))
  ].slice(0, 4);

  return {
    children,
    recentLogs,
    upcoming,
    activity: auditLogs.map((log) => log.message)
  };
}

export async function getRecords(userId: string) {
  const children = await getAccessibleChildren(userId);
  const childIds = children.map((child) => child.id);

  const [medication, bloodwork, visits, documents, activity] = await Promise.all([
    prisma.medicationLog.findMany({
      where: { childId: { in: childIds } },
      include: { child: true },
      orderBy: { createdAt: "desc" }
    }),
    prisma.bloodworkLog.findMany({
      where: { childId: { in: childIds } },
      include: { child: true },
      orderBy: { createdAt: "desc" }
    }),
    prisma.doctorVisitLog.findMany({
      where: { childId: { in: childIds } },
      include: { child: true },
      orderBy: { createdAt: "desc" }
    }),
    prisma.document.findMany({
      where: { childId: { in: childIds } },
      include: { child: true },
      orderBy: { createdAt: "desc" }
    }),
    prisma.auditLog.findMany({
      where: { childId: { in: childIds } },
      orderBy: { createdAt: "desc" }
    })
  ]);

  return [
    ...medication.map((item) => ({
      id: item.id,
      category: "Medication",
      patient: item.child.fullName,
      title: item.medicationName,
      date: format(item.createdAt, "yyyy-MM-dd"),
      status: toTitle(item.status)
    })),
    ...bloodwork.map((item) => ({
      id: item.id,
      category: "Bloodwork",
      patient: item.child.fullName,
      title: item.labReason ?? "Bloodwork",
      date: format(item.bloodworkDate, "yyyy-MM-dd"),
      status: item.followUpRequired ? "Follow-up" : "Complete"
    })),
    ...visits.map((item) => ({
      id: item.id,
      category: "Doctor Visit",
      patient: item.child.fullName,
      title: item.reasonForVisit,
      date: format(item.appointmentDate, "yyyy-MM-dd"),
      status: item.followUpRequired ? "Follow-up" : "Complete"
    })),
    ...documents.map((item) => ({
      id: item.id,
      category: "Document",
      patient: item.child?.fullName ?? "Case file",
      title: item.title,
      date: format(item.createdAt, "yyyy-MM-dd"),
      status: "Uploaded"
    })),
    ...activity.map((item) => ({
      id: item.id,
      category: "Activity",
      patient: "Care team",
      title: item.message,
      date: format(item.createdAt, "yyyy-MM-dd"),
      status: toTitle(item.action)
    }))
  ].sort((a, b) => b.date.localeCompare(a.date));
}

export async function getDocuments(userId: string) {
  const children = await getAccessibleChildren(userId);
  const childIds = children.map((child) => child.id);

  return prisma.document.findMany({
    where: {
      OR: [
        { childId: { in: childIds } },
        {
          case: {
            children: {
              some: { childId: { in: childIds } }
            }
          }
        }
      ]
    },
    include: { child: true },
    orderBy: { createdAt: "desc" }
  });
}

export async function getChildForUser(userId: string, childId: string) {
  return prisma.childProfile.findFirst({
    where: {
      id: childId,
      OR: [
        { permissions: { some: { userId } } },
        {
          families: {
            some: {
              familyGroup: {
                memberships: {
                  some: { userId }
                }
              }
            }
          }
        }
      ]
    }
  });
}

export async function getProfileData(userId: string) {
  const [familyMemberships, organizationMemberships, caseParticipants] = await Promise.all([
    prisma.familyMembership.findMany({
      where: { userId },
      include: {
        familyGroup: {
          include: {
            children: {
              include: { child: true }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    }),
    prisma.organizationMembership.findMany({
      where: { userId },
      include: { organization: true },
      orderBy: { createdAt: "desc" }
    }),
    prisma.caseParticipant.findMany({
      where: { userId },
      include: {
        case: {
          include: {
            sponsoringOrganization: true,
            children: {
              include: { child: true }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    })
  ]);

  return {
    familyMemberships,
    organizationMemberships,
    caseParticipants
  };
}

function toTitle(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
