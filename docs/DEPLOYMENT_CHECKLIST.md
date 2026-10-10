# Production deployment checklist

The only deployable service in this repository is the Next.js app in `frontend/`. Deploy it to Vercel with **Root Directory** set to `frontend`.

## 1. Database

- Set `BOOKING_DATABASE_URL` in Vercel Production to the PostgreSQL connection string used by the app.
- Download the Supabase database root certificate and set `BOOKING_DATABASE_CA_BASE64` in Vercel Production to the Base64-encoded PEM certificate. Production database connections verify this CA.
- In the intended Supabase project, run these migrations in order if they have not already been applied:
  1. `frontend/db/migrations/001_customer_requests.sql`
  2. `frontend/db/migrations/002_booking_notification_jobs.sql`
  3. `frontend/db/migrations/003_customer_request_rls.sql`
- Confirm the database role in `BOOKING_DATABASE_URL` can write to the request tables and that public `anon` and `authenticated` roles cannot access customer request records.

The application has already connected to the Supabase project and booking records exist. Verify migration state against the production database before applying migrations again.

## 2. Email delivery

- Set `BOOKING_NOTIFICATION_EMAIL=hello@mycarmaster.in` for booking notifications.
- Set `BOOKING_TO_EMAIL=hello@mycarmaster.in` for other customer requests.
- Set both `EMAIL_FROM` and `BOOKING_FROM_EMAIL` to the intended sender address on a domain verified for sending in Resend. Bookings use `EMAIL_FROM` first; other request emails use `BOOKING_FROM_EMAIL`.
- Set `RESEND_API_KEY` to a Resend API key with sending permission for that domain.
- Confirm Resend accepts the sender and destination. A previously observed booking email attempt returned HTTP 403; the saved request needs a retry after the sender/key configuration is corrected.

Do not put secrets in any `NEXT_PUBLIC_` variable. Keep these values in Vercel's server-side Production environment.

## 3. Other production variables

Set the values appropriate for the business:

- `NEXT_PUBLIC_SITE_URL`: final public site URL.
- `NEXT_PUBLIC_CONTACT_PHONE`, optional `NEXT_PUBLIC_CONTACT_PHONE_SECONDARY`, `NEXT_PUBLIC_CONTACT_EMAIL`, and `NEXT_PUBLIC_WHATSAPP_NUMBER`: approved public contact details.
- `CRON_SECRET`: long random secret. The scheduled retry and retention endpoint requires it.
- WhatsApp variables only if the approved WhatsApp template and opt-in are ready: `WHATSAPP_RECIPIENT_NUMBER`, `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_VERIFY_TOKEN`, `WHATSAPP_APP_SECRET`, `WHATSAPP_TEMPLATE_NAME`, and `WHATSAPP_TEMPLATE_LANGUAGE`. Set `WHATSAPP_OPT_IN_CONFIRMED=true` only after confirming opt-in.

`NOTIFICATION_MAX_ATTEMPTS` is optional and defaults to 8.

## 4. Deploy and verify

1. Add or update Production environment variables in Vercel.
2. Apply any migrations that are not already present.
3. Deploy the `frontend` project.
4. Submit one clearly identified test booking and one test enquiry.
5. Confirm each request is saved and the email arrives at `hello@mycarmaster.in`. Booking notification emails should include a one-page PDF request summary. Check Resend logs and Vercel function logs if delivery fails.
6. Confirm the retry cron is listed in Vercel project settings and has a matching `CRON_SECRET`.

The current cron schedule runs daily. On Vercel Hobby, schedules can run only once per day, so a failed email retry can wait until the next run. The booking handler still tries to send the booking email immediately when the customer submits the form.

## Local development

Copy `frontend/.env.example` to `frontend/.env.local` and add local credentials there. Restart the local server after changing environment values. Never commit `.env.local` or paste credentials into chat.
