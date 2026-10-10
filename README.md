# My Car Master

The deployable application is the Next.js site in `frontend/`. Set the Vercel project Root Directory to `frontend`. A separate FastAPI backend, payments, and admin dashboard are not part of this deployment.

## Run locally

```powershell
cd frontend
npm ci
npm run dev
```

For a production build and TypeScript check:

```powershell
npm run lint
npm run build
```

Use `frontend/.env.example` as the only environment-variable template. Put local secrets in the ignored `frontend/.env.local`; never commit or share that file.

## Before production

Follow [the deployment checklist](docs/DEPLOYMENT_CHECKLIST.md). The important external setup is:

1. Configure Vercel's Production variables, including the PostgreSQL connection and `CRON_SECRET`.
2. Apply and verify the three SQL migrations in `frontend/db/migrations/`.
3. Set both request recipients to `hello@mycarmaster.in` and configure Resend with a verified sending-domain address and sending API key.
4. Deploy, submit an approved test request, and confirm it appears in the database and the recipient inbox.

The most recent local lint and production build passed. Booking notification emails include a one-page PDF request summary. Email delivery still needs production configuration and a live delivery check; a previously observed booking email attempt received HTTP 403 from Resend.

## Project notes

- [Deployment checklist](docs/DEPLOYMENT_CHECKLIST.md): production setup and verification steps.
- [Client information required](docs/CLIENT_INFORMATION_REQUIRED.md): business facts and approvals still needed.
- [Architecture](docs/ARCHITECTURE.md): product architecture and future roadmap.
- [Quality audit](docs/QUALITY_AUDIT.md): current findings and limits of verification.
