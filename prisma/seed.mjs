import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const testPassword = await bcrypt.hash("HarborSyncTest123!", 12);
  const user = await prisma.user.upsert({
    where: { email: "demo@harborsync.app" },
    update: {},
    create: {
      email: "demo@harborsync.app",
      name: "Jane Smith"
    }
  });

  const adminUsers = await Promise.all(
    ["isaac.rutledgev@obsidian-systems.tech"].map((email) =>
      prisma.user.upsert({
        where: { email },
        update: {
          name: "Isaac Rutledge",
          platformRole: "PLATFORM_ADMIN",
          onboardingCompleted: true
        },
        create: {
          email,
          name: "Isaac Rutledge",
          platformRole: "PLATFORM_ADMIN",
          onboardingCompleted: true,
          passwordHash: testPassword,
          passwordSetAt: new Date()
        }
      })
    )
  );

  await prisma.authorizedEmail.upsert({
    where: { email: "rutledgeisaac6969@gmail.com" },
    update: { status: "AUTHORIZED", defaultRole: "FAMILY_ADMIN", accountType: "FAMILY" },
    create: { email: "rutledgeisaac6969@gmail.com", status: "AUTHORIZED", defaultRole: "FAMILY_ADMIN", accountType: "FAMILY" }
  });

  const janeParent = await prisma.user.upsert({
    where: { email: "jane.parent@harborsync.test" },
    update: { name: "Jane Parker", onboardingCompleted: true, passwordHash: testPassword, passwordSetAt: new Date() },
    create: { email: "jane.parent@harborsync.test", name: "Jane Parker", onboardingCompleted: true, passwordHash: testPassword, passwordSetAt: new Date() }
  });

  const samParent = await prisma.user.upsert({
    where: { email: "sam.parent@harborsync.test" },
    update: { name: "Sam Parker", onboardingCompleted: true, passwordHash: testPassword, passwordSetAt: new Date() },
    create: { email: "sam.parent@harborsync.test", name: "Sam Parker", onboardingCompleted: true, passwordHash: testPassword, passwordSetAt: new Date() }
  });

  const caseworkerUser = await prisma.user.upsert({
    where: { email: "caseworker.demo@harborsync.test" },
    update: { name: "Casey Walker", onboardingCompleted: true, passwordHash: testPassword, passwordSetAt: new Date() },
    create: { email: "caseworker.demo@harborsync.test", name: "Casey Walker", onboardingCompleted: true, passwordHash: testPassword, passwordSetAt: new Date() }
  });

  const advocateUser = await prisma.user.upsert({
    where: { email: "advocate.demo@harborsync.test" },
    update: { name: "Ava Advocate", onboardingCompleted: true, passwordHash: testPassword, passwordSetAt: new Date() },
    create: { email: "advocate.demo@harborsync.test", name: "Ava Advocate", onboardingCompleted: true, passwordHash: testPassword, passwordSetAt: new Date() }
  });

  for (const seededUser of [
    { user: adminUsers[0], role: "FAMILY_ADMIN", accountType: "FAMILY" },
    { user: janeParent, role: "FAMILY_ADMIN", accountType: "FAMILY" },
    { user: samParent, role: "FAMILY_MEMBER", accountType: "FAMILY" },
    { user: caseworkerUser, role: "CPS_CASEWORKER", accountType: "CASEWORKER" },
    { user: advocateUser, role: "ADVOCATE", accountType: "ADVOCATE" }
  ]) {
    await prisma.authorizedEmail.upsert({
      where: { email: seededUser.user.email },
      update: { status: "ACTIVE", defaultRole: seededUser.role, accountType: seededUser.accountType, userId: seededUser.user.id },
      create: { email: seededUser.user.email, name: seededUser.user.name, status: "ACTIVE", defaultRole: seededUser.role, accountType: seededUser.accountType, userId: seededUser.user.id }
    });
  }

  const family = await prisma.familyGroup.upsert({
    where: { id: "demo-family-parker" },
    update: {},
    create: {
      id: "demo-family-parker",
      name: "Parker Family",
      description: "Primary care coordination group"
    }
  });

  for (const member of [
    { userId: user.id, role: "FAMILY_ADMIN" },
    { userId: janeParent.id, role: "FAMILY_ADMIN" },
    { userId: samParent.id, role: "FAMILY_MEMBER" }
  ]) {
    await prisma.familyMembership.upsert({
      where: { familyGroupId_userId: { familyGroupId: family.id, userId: member.userId } },
      update: { role: member.role },
      create: { familyGroupId: family.id, userId: member.userId, role: member.role }
    });
  }

  for (const adminUser of adminUsers) {
    await prisma.familyMembership.upsert({
      where: {
        familyGroupId_userId: {
          familyGroupId: family.id,
          userId: adminUser.id
        }
      },
      update: { role: "FAMILY_ADMIN" },
      create: {
        familyGroupId: family.id,
        userId: adminUser.id,
        role: "FAMILY_ADMIN"
      }
    });
  }

  const avery = await prisma.childProfile.upsert({
    where: { id: "demo-child-avery" },
    update: {},
    create: {
      id: "demo-child-avery",
      fullName: "Avery Parker",
      dateOfBirth: new Date("2016-09-18"),
      allergies: "Amoxicillin",
      conditions: "ITP monitoring",
      currentMedications: "Prednisone 5mg",
      emergencyContacts: [
        { name: "Jane Smith", relationship: "Parent", phone: "(555) 010-4100" },
        { name: "Dr. Lena Ortiz", relationship: "Primary doctor", phone: "(555) 010-2200" }
      ],
      primaryDoctor: "Dr. Lena Ortiz"
    }
  });

  const miles = await prisma.childProfile.upsert({
    where: { id: "demo-child-miles" },
    update: {},
    create: {
      id: "demo-child-miles",
      fullName: "Miles Parker",
      dateOfBirth: new Date("2019-02-07"),
      allergies: "None documented",
      conditions: "Seasonal asthma",
      currentMedications: "Albuterol as needed",
      emergencyContacts: [
        { name: "Jane Smith", relationship: "Parent", phone: "(555) 010-4100" }
      ],
      primaryDoctor: "Dr. Ben Moore"
    }
  });

  for (const child of [avery, miles]) {
    await prisma.familyChild.upsert({
      where: {
        familyGroupId_childId: {
          familyGroupId: family.id,
          childId: child.id
        }
      },
      update: {},
      create: {
        familyGroupId: family.id,
        childId: child.id,
        relationship: "Parent"
      }
    });

    await prisma.childPermission.create({
      data: {
        childId: child.id,
        userId: user.id,
        role: "FAMILY_ADMIN"
      }
    }).catch(() => undefined);

    for (const adminUser of [...adminUsers, janeParent, samParent]) {
      await prisma.childPermission.create({
        data: {
          childId: child.id,
          userId: adminUser.id,
          role: "FAMILY_ADMIN"
        }
      }).catch(() => undefined);
    }
  }

  const organization = await prisma.organization.upsert({
    where: { slug: "raintree-family-support" },
    update: {},
    create: {
      name: "Raintree Family Support",
      slug: "raintree-family-support",
      type: "ADVOCACY",
      status: "ACTIVE",
      approvedDomain: "raintree.org"
    }
  });

  const careCase = await prisma.case.upsert({
    where: { id: "demo-case-a1042" },
    update: {},
    create: {
      id: "demo-case-a1042",
      title: "Case A-1042",
      createdById: user.id,
      sponsoringOrganizationId: organization.id
    }
  });

  await prisma.caseChild.upsert({
    where: {
      caseId_childId: {
        caseId: careCase.id,
        childId: avery.id
      }
    },
    update: {},
    create: {
      caseId: careCase.id,
      childId: avery.id
    }
  });

  for (const adminUser of adminUsers) {
    await prisma.caseParticipant.upsert({
      where: {
        caseId_userId: {
          caseId: careCase.id,
          userId: adminUser.id
        }
      },
      update: { role: "FAMILY_ADMIN" },
      create: {
        caseId: careCase.id,
        userId: adminUser.id,
        role: "FAMILY_ADMIN"
      }
    });
  }

  for (const participant of [
    { userId: janeParent.id, role: "FAMILY_ADMIN" },
    { userId: samParent.id, role: "FAMILY_MEMBER" },
    { userId: caseworkerUser.id, role: "CPS_CASEWORKER" },
    { userId: advocateUser.id, role: "ADVOCATE" }
  ]) {
    await prisma.caseParticipant.upsert({
      where: { caseId_userId: { caseId: careCase.id, userId: participant.userId } },
      update: { role: participant.role },
      create: { caseId: careCase.id, userId: participant.userId, role: participant.role }
    });
    await prisma.childPermission.create({ data: { childId: avery.id, userId: participant.userId, role: participant.role, caseId: careCase.id } }).catch(() => undefined);
  }

  await prisma.medicationLog.create({
    data: {
      childId: avery.id,
      medicationName: "Prednisone",
      dosage: new Prisma.Decimal(5),
      doseUnit: "mg",
      dateGiven: new Date(),
      timeGiven: "08:04",
      administeredById: user.id,
      administeredByName: "Jane Smith",
      status: "GIVEN",
      notes: "Taken with breakfast",
      entryMethod: "single"
    }
  });

  await prisma.bloodworkLog.create({
    data: {
      childId: avery.id,
      bloodworkDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
      facility: "Riverbend Lab",
      orderingDoctor: "Dr. Lena Ortiz",
      labReason: "CBC recheck",
      plateletCount: new Prisma.Decimal(142),
      hemoglobin: new Prisma.Decimal(12.8),
      whiteBloodCellCount: new Prisma.Decimal(6.1),
      notes: "Follow-up scheduled",
      followUpRequired: true,
      createdById: user.id
    }
  });

  await prisma.doctorVisitLog.create({
    data: {
      childId: miles.id,
      appointmentDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      appointmentTime: "14:30",
      doctorName: "Dr. Ben Moore",
      specialty: "Pediatrics",
      reasonForVisit: "Asthma action plan review",
      diagnosisOutcome: "Plan updated; no follow-up required",
      createdById: user.id
    }
  });

  await prisma.document.create({
    data: {
      title: "CBC Lab Results",
      type: "PDF",
      fileUrl: "https://example.com/cbc-lab-results.pdf",
      fileKey: "demo/cbc-lab-results.pdf",
      mimeType: "application/pdf",
      sizeBytes: 245760,
      uploadedById: user.id,
      childId: avery.id,
      caseId: careCase.id
    }
  });

  await prisma.auditLog.createMany({
    data: [
      {
        actorId: user.id,
        action: "DOCUMENT_UPLOADED",
        message: "Jane Smith uploaded bloodwork for Avery Parker",
        childId: avery.id,
        caseId: careCase.id
      },
      {
        actorId: user.id,
        action: "CASE_UPDATED",
        message: "Raintree Advocate joined Case A-1042",
        childId: avery.id,
        caseId: careCase.id
      },
      {
        actorId: user.id,
        action: "LOG_CREATED",
        message: "Jane Smith logged medication for Avery Parker",
        childId: avery.id
      }
    ]
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
