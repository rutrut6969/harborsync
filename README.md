# HarborSync

Tagline:
Connected Family Coordination

## Overview

HarborSync is a mobile-first family coordination and support documentation platform designed for parents, caregivers, caseworkers, advocates, nonprofits, and family assistance organizations.

The platform helps families and support teams coordinate child-related care, health documentation, appointments, bloodwork, medications, case activity, uploaded documents, and assistance workflows in one secure place.

HarborSync is not intended to replace doctors, government agencies, or official assistance programs. Instead, it helps families organize information, document activity, share approved records, and coordinate with support organizations more efficiently.

## Core Mission

HarborSync is built around family support, secure documentation, child-centered coordination, organization collaboration, consent-based sharing, and reducing paperwork friction.

The product exists for the real moments when families are under stress and need clarity quickly: medication history, doctor follow-ups, lab results, case activity, emergency contacts, and supporting documents should be easy to find, easy to update, and permission-aware.

Core mission principles:

- Help families stay organized during stressful situations.
- Support child-centered coordination across caregivers and approved professionals.
- Keep access relationship-based instead of globally tying adults together.
- Make documentation easier without replacing official systems of record.
- Give organizations a safer way to support families with consent and clear permissions.
- Reduce repeat paperwork by helping families prepare, store, and share approved records.

## Current MVP Features

### Authentication

- Protected app routes.
- Invite/approved-user access model.
- Email and password sign-in for activated accounts.
- First-time password setup after invite, magic link, or Google activation.
- Forgot password and reset password flow.
- Resend magic link sign-in as a recovery and secondary access method.
- Optional Google sign-in support.
- Auth.js / NextAuth integration.
- Database-backed sessions.

### Family & Child Structure

- Independent user accounts.
- Family groups.
- Child profiles.
- Children can be connected to multiple family groups.
- Relationship-based access.
- Permission-aware data retrieval.

This structure supports separated parents, blended families, relatives, caregivers, advocates, and approved professionals without assuming every adult account should automatically share the same access.

### Roles & Permissions

Current supported role types:

- `FAMILY_ADMIN`
- `FAMILY_MEMBER`
- `CAREGIVER`
- `CPS_CASEWORKER`
- `ADVOCATE`
- `READ_ONLY`

Permissions are designed to be relationship-based instead of tying all parents or adults together globally. A user may have one role for one child, a different role for a case, and no access at all to another family group.

### Organizations

The current data model supports:

- Organizations.
- Organization types.
- Organization approval status.
- Approved domains.
- Organization memberships.
- Organization sponsorships.

This prepares HarborSync for future support organizations, nonprofits, CPS-style agencies, advocacy groups, food pantries, housing support groups, and other family-assistance organizations.

### Cases

The current data model supports:

- Cases.
- Case creator.
- Case status.
- Sponsoring organization.
- Case participants.
- Children attached to cases.
- Case timeline events.
- Case-related permissions.
- Case documents.

Cases are intended to coordinate activity around a child or family support need while preserving consent-based access boundaries.

### Health Logs

The current MVP supports:

- Medication Log.
- Bulk Medication Log.
- Doctor Visit Log.
- Bloodwork Log.

Medication logs include:

- Child/patient.
- Medication name.
- Dosage.
- Dose unit.
- Date/time given.
- Administered by.
- Dose status.
- Notes.
- Side effects.
- Entry method.
- Batch ID for bulk logs.

Dose statuses:

- `GIVEN`
- `LATE`
- `MISSED`
- `REFUSED`

Doctor visit logs include:

- Appointment date/time.
- Doctor name.
- Specialty.
- Reason for visit.
- Diagnosis/outcome.
- Follow-up required.
- Follow-up date.

Bloodwork logs include:

- Bloodwork date.
- Facility.
- Ordering doctor.
- Lab reason.
- Platelet count.
- Hemoglobin.
- White blood cell count.
- Notes.
- Follow-up required.

### Records Center

The current app includes a searchable Records Center that aggregates:

- Medications.
- Doctor visits.
- Bloodwork.
- Documents.
- Activity.

Desktop views use sortable table patterns, while mobile views prioritize stacked cards that are easier to scan and tap with one hand.

### Documents

The current data model supports:

- PDFs.
- Images.
- Lab results.
- Doctor paperwork.
- Other documents.

Documents may attach to:

- Child profiles.
- Cases.
- Medication logs.
- Doctor visit logs.
- Bloodwork logs.

The upload architecture is UploadThing-ready, with the UI structured for drag/drop on desktop and tap-to-upload on mobile.

### Audit / Activity System

The current app supports audit logging for:

- Log creation.
- Document uploads.
- Invitations.
- Invitation acceptance.
- Role and access changes.
- Case updates.
- Access changes.
- Organization approvals.
- Family creation.
- Child creation.
- Child updates and safe archiving.
- Platform admin approval actions.
- Sensitive data view/update events when enabled.

The activity system is designed to answer who did what, when, and in relation to which child, case, or document.

### Platform Admin

HarborSync now includes a platform admin role separate from family and case roles. Platform admins can access `/admin` to review applications, manage authorized emails, approve or deny access, monitor families, children, cases, organizations, invite activity, and recent audit logs.

Primary seeded super admin:

- Email: `isaac.rutledgev@obsidian-systems.tech`
- Local/demo password: `HarborSyncTest123!`

Super/platform admin access is intentionally separate from `FAMILY_ADMIN`. A family admin manages their own family context, while the super admin manages system-level access and approvals. The Isaac admin account is not attached to seeded family groups, child permissions, or demo cases by default.

### Authorized Email Access

HarborSync is approval-based. Users can activate accounts only when their email is authorized by the platform admin, approved through an application, or invited through an allowed family/case workflow.

Authorized email statuses:

- `AUTHORIZED`
- `INVITED`
- `ACTIVE`
- `SUSPENDED`
- `REVOKED`

Google sign-in is also permission-gated. If an unknown or unauthorized Google account tries to sign in, the app shows:

> "This email has not been approved for HarborSync access yet."

### Onboarding

First-time users are guided through onboarding if their profile is incomplete. Adult onboarding collects contact information, address details, preferred contact method, relationship context, optional medical notes, optional emergency contact, and optional caseworker contact information.

If a parent enters caseworker contact details during onboarding, HarborSync can create an invite flow so the professional receives access only after approval and assignment.

### Sensitive Data Architecture

The data model includes a `SensitiveProfileData` structure for future sensitive fields such as SSN, medical ID, Medicaid ID, and sensitive notes.

Sensitive data features are disabled safely unless `FIELD_ENCRYPTION_KEY` is configured. When enabled, sensitive values are encrypted server-side, full SSNs are never displayed after save, and access should be tightly permissioned and audited.

## Current Tech Stack

- Next.js 15 App Router.
- TypeScript.
- Tailwind CSS.
- Prisma ORM.
- PostgreSQL.
- Auth.js / NextAuth.
- Resend.
- UploadThing-ready architecture.
- React Hook Form.
- Zod.
- TanStack Table.
- Vercel deployment.

## Design Philosophy

HarborSync is mobile-first and built for real-world stressful situations. The interface should feel calm, trustworthy, simple, low-friction, readable, touch-friendly, family-centered, and professional enough for organizations.

The guiding UX question is:

> "Can a stressed parent use this quickly with one hand?"

Design choices favor quick scanning, gentle contrast, clear hierarchy, large tap targets, minimal typing, familiar controls, and reduced cognitive load. HarborSync should not feel like an EMR, a corporate dashboard, or a flashy startup product. It should feel reliable, quiet, and useful when the user is already carrying a lot.

## Demo Mode Vision

HarborSync should include a public, safe demo environment that reuses the same production components and UI, but uses fake sample data.

Demo mode should:

- Never expose production data.
- Use seeded fake families, children, logs, cases, organizations, and documents.
- Avoid real notifications, emails, uploads, invitations, or integrations.
- Be safe to share with organizations, testers, advisors, and potential partners.
- Automatically reflect UI improvements because it shares the real app components.

The intended shareable route is `/demo`, with a subtle "Demo Mode - sample data only" banner and sandboxed interactions.

## Future Roadmap

### Near-Term Improvements

- Password-based login after first invite/magic link activation.
- Forgot password/reset password.
- Account dropdown on desktop.
- Functional notification popover.
- Mobile record cards.
- Collapsible bulk medication entries.
- Real upload flow.
- Reusable empty states.
- Improved mobile spacing.
- Demo mode.

### Organization Platform Features

- Organization applications.
- Organization admin dashboards.
- Domain-based organization onboarding.
- Approval-gated organization members.
- Seat management.
- Sponsored family slots.
- Caseworker/advocate assignment tools.
- Family sponsorship controls.
- Organization billing later.

### Family Assistance Features

- Family applications.
- Assistance profile.
- Household size.
- Income tracking.
- Paystub uploads.
- AI-assisted income extraction.
- Proof-of-income document organization.
- Assistance eligibility preparation.
- Local organization recommendations.

### Application Coordination Features

Future HarborSync may help families prepare and coordinate applications for:

- SNAP.
- Medicaid.
- Disability.
- Housing assistance.
- Food assistance.
- Transportation assistance.
- Childcare support.
- Local nonprofit programs.

HarborSync does not approve applications or guarantee outcomes. It helps families and support teams organize documentation, track requirements, and coordinate the process more efficiently.

### Health Data Integrations

Future integrations may include:

- MyChart / Epic.
- FHIR.
- Apple Health Records.
- CommonHealth.
- Provider data imports.

All health data integrations should be guardian-approved, consent-based, and permission-controlled.

### Native Apps

Future mobile plans:

- iOS app.
- Android app.
- Push notifications.
- Camera/document scanning.
- Biometric unlock.
- Better offline support.

## Product Boundaries

V1 intentionally does not include:

- Billing.
- MyChart/FHIR integration.
- AI income extraction.
- Government application automation.
- SMS reminders.
- Native mobile apps.
- Advanced analytics.
- Enterprise dashboards.

The architecture is being designed to support those future directions without pulling them into the current MVP too early.

## Local Setup

1. Copy `.env.example` to `.env`.
2. Set `DATABASE_URL`.
3. Set `AUTH_SECRET` and `NEXTAUTH_SECRET` to the same secure value.
4. Configure Resend for magic links, password reset, and future email notifications.
5. Configure Google OAuth if Google sign-in is used.
6. Install dependencies with `npm install`.
7. Run `npm run prisma:migrate`.
8. Start the local app with `npm run dev`.

For Resend magic links before a custom domain is verified, use:

```env
EMAIL_FROM="HarborSync <onboarding@resend.dev>"
AUTH_RESEND_KEY="your-resend-api-key"
AUTH_TRUST_HOST="true"
```

On Vercel, set both `AUTH_SECRET` and `NEXTAUTH_SECRET` to the same value for Auth.js compatibility.

For Google sign-in, create a Google Auth Platform web client and set:

```env
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
```

Useful local commands:

```bash
npm install
npm run prisma:migrate
npm run db:seed
npm run dev
npm run typecheck
npm run build
```

### Seeded Test Accounts

Local/demo seeding creates these safe fake users for testing only:

| Role | Email | Password |
| --- | --- | --- |
| Super admin | `isaac.rutledgev@obsidian-systems.tech` | `HarborSyncTest123!` |
| Parent / family admin | `jane.parent@harborsync.test` | `HarborSyncTest123!` |
| Parent / family member | `sam.parent@harborsync.test` | `HarborSyncTest123!` |
| Caseworker | `caseworker.demo@harborsync.test` | `HarborSyncTest123!` |
| Advocate | `advocate.demo@harborsync.test` | `HarborSyncTest123!` |

These accounts use fake data and are intended for local development, UI review, and demo validation. Do not use real family data in seeded accounts.

`rutledgeisaac6969@gmail.com` is kept as an authorized blank account for Google sign-in testing. It is intentionally not connected to seeded family, child, case, or organization data.

## Deployment

HarborSync is designed for Vercel deployment with PostgreSQL provided by Prisma Postgres or another compatible hosted Postgres provider.

Deployments run `prisma migrate deploy` during `npm run build`, so Vercel applies committed migrations before building the app. Required environment variables should be configured in the Vercel project settings before deployment:

- `DATABASE_URL`
- `AUTH_SECRET`
- `NEXTAUTH_SECRET`
- `AUTH_RESEND_KEY` or `RESEND_API_KEY`
- `EMAIL_FROM`
- `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` if Google sign-in is enabled
- `FIELD_ENCRYPTION_KEY` when sensitive-data storage is enabled
- Upload provider variables when real uploads are enabled

## Product Status

Active MVP development - deployed, functional, and being refined toward production readiness.

Persistent HarborSync product, UX, demo, and architecture standards live in `AGENTS.md`. Future changes should follow those rules unless the product direction is intentionally updated.
