# My Car Master — Quality Audit

**Audit date:** 10 October 2026  
**Overall status:** Needs attention before production launch

## Scope and limits

Reviewed the Next.js frontend, API routes, SQL migrations, deployment configuration, environment variable names, legal pages, and responsive layouts. Built and ran the production app locally. A read-only database query confirmed booking notification rows exist and one email attempt was rejected with HTTP 403; no database records were changed, no valid request was submitted, and no email/WhatsApp was sent. The workspace has no Git metadata, so tracked-file and working-tree state could not be audited.

## Verified checks

- `npm run build`: passed on this audit run after the wording fix.
- `npm run lint` (TypeScript check): passed on this audit run.
- `npm ls --depth=0`: passed; installed top-level dependencies resolve.
- Local production HTTP smoke check: 18 pages/utility routes returned 200 (home, service pages, booking, contact, about, locations, privacy, terms, robots and sitemap). Removed refund-policy and disclaimer routes return 404 as intended.
- Booking and enquiry API invalid JSON / missing fields returned 400; oversized 17 KB JSON returned 413. No valid POST was made, avoiding test data and notifications.
- Browser check at 360, 390, 768, 1024, 1440 and 1920 CSS pixels found no document-level horizontal overflow. Mobile navigation opened and exposed its links. Booking labels were associated with fields and empty required fields failed browser validity checks. The browser console and failed network requests were not exhaustively captured, and not every link/button was individually activated.
- Local page response timings ranged from 78 ms to 745 ms; these are localhost measurements and say nothing about production performance.
- Source scan found no hard-coded provider credential patterns. Local `.env.local` values were not printed in full; the request recipients were updated to the business inbox. Example files do not contain personal recipients.

## Findings and required actions

### High — protect customer request tables

Migrations 001/002 create tables in `public` without enabling RLS. The actual Supabase project's RLS settings and grants were not queried. Migration `frontend/db/migrations/003_customer_request_rls.sql` has been added to enable RLS and revoke API-role table access. Run it against the intended database after confirming the site's server connection uses the owner/service database role; verify public `anon` and `authenticated` access is denied. Until applied and verified, treat customer contact details as potentially exposed. Supabase recommends RLS for tables exposed through its Data API: [RLS guide](https://supabase.com/docs/guides/database/postgres/row-level-security).

### High — configure the scheduled job

`CRON_SECRET` is empty in the local environment. A request without a matching bearer secret returns 401, as expected. Set a long random secret in Vercel Production and ensure the cron route receives it. The Vercel schedule is daily, so retries/one-year cleanup can be delayed by up to about a day. Confirm the cron is active after deployment.

### High — email delivery is unverified

No live message was sent. Resend account/domain verification, sender authorization, inbox delivery, spam placement, and production environment variables were not inspected. Verify the sending domain, use a sender on that domain, and make a clearly identified test booking after deployment. A provider acceptance response does not prove inbox delivery.

### Medium — public endpoint abuse and duplicate submissions

The public booking/enquiry routes have a 16 KiB request-body limit now, but no rate limit, CAPTCHA, or deduplication/idempotency key. Repeated public requests can still consume database storage and email quota, and a browser retry can create a duplicate request. Add edge-level rate limiting and a deduplication strategy before advertising the site broadly.


### Medium — customer reference and replay behavior

Booking references are UUIDs rather than customer-friendly codes, and the success state is held only in client memory, so it is not restored after a refresh. The server creates a new UUID for every POST and does not accept an idempotency key; duplicate submissions are therefore not prevented across retries or concurrent requests. The UI blocks a second click while its request is in progress, but this is not server-side idempotency. A durable human-friendly reference/replay design needs a database/API decision and a dedicated database test; it was not changed in this pass.
### Medium — notification and persistence boundary

Email delivery can be delayed/retried. “Sent” reflects provider acceptance in this flow, not confirmed inbox delivery; no Resend delivery webhook was tested. WhatsApp credentials were not present for an end-to-end check. A read-only query to the connected database succeeded, but write operations, migrations, rollback, cascade deletion, backup/restore, and one-year cleanup were not exercised against a dedicated test database.

### Medium — pricing/business facts conflict

The service cards visibly show segment prices (Used Car Evaluation ₹499/₹799/₹1,299 and New Car PDI ₹799/₹1,299/₹1,999), while the supplied audit brief expects base prices of ₹1,000 and ₹1,500 and the shared pricing config returns “On enquiry.” Confirm the approved rates and make the cards/config consistent before launch. No rates were changed because the business-approved figures are unknown.

### Low — enquiry success wording corrected

The enquiry confirmation label now says “Enquiry received” so it does not imply that a service or appointment has been confirmed.

### Medium — legal text needs owner review

The privacy page contains placeholder privacy contact details and describes data categories/purposes that do not fully match the current booking form. The generic booking terms dialog presents PDI-specific wording for other services. Have the business/legal owner confirm the Privacy Policy, Terms, collected-data description, contact/grievance details, retention language, and service-specific conditions. Refund Policy and Disclaimer pages/links have been removed per the requested site change; cancellation/refund rules still need to be defined before accepting payments.

### Low — dependency vulnerability check unavailable

`npm audit` could not reach the npm advisory endpoint due network failure. Vulnerability status is therefore unverified; do not interpret this as a clean audit. Re-run `npm audit` in a network-enabled environment.

## Product coverage and readiness

This repository's deployable application is Next.js with PostgreSQL request storage and email retry code. A separate FastAPI backend, authentication, and payment processing are not implemented. The site may open on mobile browsers, and the tested layouts had no page-level horizontal overflow; browser/device coverage is not exhaustive.

## Launch checklist

1. Apply migrations 001, 002, and 003 to the intended database; verify server connectivity and deny Data API reads/writes to public roles.
2. Configure the production database URL, Resend sending domain/key, recipient/sender, contact values, site URL, and `CRON_SECRET` in Vercel; redeploy.
3. Confirm cron registration and run a one-year retention/cleanup check against a disposable test database.
4. Add rate limiting and idempotent submission handling; confirm approved prices and legal text.
5. Submit one authorized test booking and enquiry; verify database rows, Resend logs and actual inbox delivery; inspect production logs.
6. Re-run dependency audit when npm registry access is available and verify backups/restore procedures.


