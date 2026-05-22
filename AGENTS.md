# HarborSync Development Rules

These rules are persistent standards for all future HarborSync development. They are not one-time task notes.

## Product Identity

HarborSync is a calm, trustworthy, emotionally safe, family-centered coordination and case support platform. It serves parents, caregivers, advocates, caseworkers, and family support organizations.

The app should never feel overwhelming, enterprise-heavy, fintech-like, cluttered, harsh, or overly clinical.

Every screen should answer: "Can a stressed parent use this quickly with one hand?"

Prioritize simplicity, mobile usability, emotional clarity, trustworthiness, real-world workflow efficiency, permission safety, and maintainability.

## Design System

Keep and expand the current HarborSync identity:

- Harbor Blue: `#3A6EA5`
- Deep Slate: `#2B3138`
- Soft Teal: `#4FA7A0`
- Background: `#F5F7FA`
- Border: `#DCE4EE`

Use rounded cards, soft shadows, calm spacing, subtle transitions, accessible touch targets, modern typography, and a mobile-native feel. Do not radically redesign the brand.

## Mobile First

All features must work on small screens first.

- Avoid horizontal scrolling.
- Respect iPhone safe areas.
- Avoid keyboard overlap.
- Keep primary actions thumb reachable.
- Desktop should enhance the experience, not define it.

## Demo Mode

HarborSync must maintain a live public demo at `/demo` or a future demo domain.

Demo mode must be safe for investors, organizations, testers, and UI reviews:

- Use fake seeded data only.
- Never expose production data.
- Never send real emails.
- Never modify production records.
- Never allow real invitations.
- Never access production uploads.
- Never expose secrets or tokens.
- Demo uploads must be simulated or isolated to sandbox storage.

The demo should reuse production layouts, components, navigation patterns, styling, and UX wherever practical. Demo differences should affect only data source, permissions, side effects, notifications, uploads, and integrations.

Always display subtle demo context such as: "Demo Mode - sample data only".

## Authentication Direction

HarborSync remains invite-only or approval-based. Users cannot freely create accounts.

Target auth behavior:

- First-time invited users sign in, then create a password if none exists.
- Returning users primarily use email/password or Google.
- Magic link remains secondary/recovery, not the primary daily login.

Password features to implement:

- Create password
- Forgot password
- Reset password
- Change password
- Optional password setup for Google users

Use bcrypt or argon2 hashing. Never store plaintext passwords.

## Navigation

Desktop:

- Do not put Profile in the desktop sidebar.
- Account access belongs in the top-right avatar/profile dropdown.
- Dropdown items: Profile, Account Settings, Organization Access, Sign Out.

Mobile:

- Keep Profile in the bottom navigation.

## Notifications

The notification bell must always do something.

If empty, show an empty state with:

- Icon
- "No notifications yet"
- "Updates, reminders, and case activity will appear here."

Architecture should support reminders, case updates, uploads, organization actions, and family activity.

## Records Center

Desktop keeps TanStack Table.

Mobile uses stacked record cards showing:

- Type
- Patient
- Title
- Date
- Status

Avoid wide horizontal table scrolling on mobile.

## Bulk Medication

Bulk medication entries must use accordion/collapsible cards.

Each collapsed header summarizes:

- Medication
- Patient
- Time

Expanded state shows the full form.

## Documents

Documents UX should support:

- Drag/drop on desktop
- Tap upload on mobile
- Upload progress indicators
- Preview cards
- Empty states

Keep UploadThing-compatible architecture.

## Empty And Loading States

Use reusable empty-state and skeleton components for notifications, records, documents, cases, activity, reminders, organizations, and dashboards.

Tone should be calm, supportive, human, and reassuring.

Avoid layout jumps.

## Component And Architecture Rules

Prefer reusable components, modular architecture, small focused files, scalable patterns, and accessibility support.

Do not replace Tailwind, App Router, Prisma, Auth.js, or the existing architecture without a strong reason.

## Long-Term Direction

Preserve scalability for:

- CPS organizations
- Advocacy groups
- Food pantries
- Housing support
- Assistance applications
- MyChart/FHIR integrations
- Family sponsorship systems

Do not prematurely overengineer these future integrations.
