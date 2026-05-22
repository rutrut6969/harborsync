# HarborSync

Connected Family Coordination.

HarborSync is a mobile-first family coordination and health/case documentation MVP for families, caregivers, advocates, and organizations supporting children.

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Prisma ORM with PostgreSQL
- NextAuth/Auth.js with magic links and Google sign-in
- React Hook Form and Zod
- UploadThing-ready upload architecture
- Resend email notifications
- TanStack Table for records

## Local Setup

1. Copy `.env.example` to `.env`.
2. Set `DATABASE_URL`, `AUTH_SECRET`, Google OAuth, Resend, and UploadThing values.
3. Install dependencies with `npm install`.
4. Run `npm run prisma:migrate`.
5. Start with `npm run dev`.

Deployments run `prisma migrate deploy` during `npm run build`, so Vercel applies committed migrations before building the app.

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

## Product Boundaries

V1 intentionally excludes billing, AI features, SMS, MyChart/FHIR/Apple Health integrations, advanced analytics, enterprise dashboards, and marketplace APIs.
