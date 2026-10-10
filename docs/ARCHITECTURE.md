# My Car Master — System Architecture (mycarmaster.in)

Status: planning document. Only Phase 1 (frontend, no backend) is implemented in this repository.
All business facts (phone, address, certificate details, coverage, 24/7 claims) are placeholders until verified by the client.

## 1. System architecture

```
Browser ──HTTPS──► CDN (Vercel Edge) ──► Next.js frontend (SSR/SSG)
                                              │  REST/JSON (HTTPS, cookies)
                                              ▼
                                  FastAPI backend (stateless, N instances)
                                  ├── PostgreSQL (managed, PITR backups)
                                  ├── Object storage (S3 / R2 / GCS, private)
                                  ├── Razorpay (orders, webhooks)
                                  ├── Email provider (abstraction)
                                  ├── WhatsApp Business API (templates)
                                  └── Task queue (RQ/Celery + Redis) for PDFs, notifications
```

- Frontend and backend are deployed independently. The frontend never holds secrets.
- Domain: `mycarmaster.in` + `www` (redirect to apex), HTTPS only, HSTS.
- Client owns domain, hosting, Razorpay, analytics, Search Console, WhatsApp/Meta, email, storage.

## 2. Frontend architecture

- Next.js (App Router) + TypeScript + Tailwind + Lucide icons.
- `app/` routes, `components/ui` (primitives), `components/sections` (page sections), `components/vehicle` (selector), `components/layout`.
- `config/` holds site, nav and client placeholders. `services/` holds data access (mock now, API later). `types/` shared typed models.
- Server components by default; client components only where interaction is needed (selector, nav, FAQ, forms).
- Prices come from `services/pricing.ts` (mock now; `GET /api/services` later). Never hardcoded in components.
- Analytics via a thin `lib/analytics.ts` wrapper (no-op until GA is configured).

## 3. Backend architecture (Phase 4+)

Layered: `api` (routers) → `services` (business logic) → `repositories` (SQLAlchemy queries) → `models`.
Cross-cutting: `auth`, `payments`, `notifications`, `storage`, `config`, `utils`. Pydantic schemas at the API boundary.
Rules: transactions in the service layer, no business logic in routers, no raw SQL string building.

## 4. Database architecture

PostgreSQL + SQLAlchemy 2.x + Alembic. UUID primary keys, `created_at/updated_at`, `deleted_at` soft delete on catalog and content tables, FK constraints, indexes on lookups (reference, status, slot, brand/model).
Money stored as integer paise. Prices versioned (`service_prices`) so history is preserved.

## 5. ER description

- User 1—0..1 Customer / Inspector (role on User: SUPER_ADMIN, ADMIN, INSPECTOR, SUPPORT_STAFF, CUSTOMER)
- Brand 1—N VehicleModel 1—N VehicleVariant
- Customer 1—N Vehicle (FK brand, model, variant, plus registration, year, fuel, transmission, km)
- Service 1—N ServicePrice (effective_from/to), Service 1—N InspectionChecklist
- Location 1—N AvailabilitySlot (service, date, start, end, inspector, capacity) — unique(service, location, date, start, inspector)
- Booking N—1 Customer, Service, Vehicle, Location, AvailabilitySlot; stores `price_paise_snapshot`, `reference` (MCM-YYYYMM-NNNNNN), status
- Booking 1—N Payment 1—N PaymentAttempt; WebhookEvent (unique provider_event_id) for idempotency
- Booking 1—0..1 Inspection (inspector) 1—N InspectionItem (checklist item, status GOOD/ATTENTION/CRITICAL/NOT_CHECKED, notes, measurement) 1—N InspectionPhoto, InspectionFinding
- Inspection 1—0..1 InspectionReport (pdf storage key, scores JSON, score_config_version); Certificate (only where service issues one)
- Notification (channel, event, status, provider response), AuditLog (user, action, entity, entity_id, metadata, ts)
- Content: FAQ, Review, Certification, BlogPost, Setting (key/value for client placeholders)

## 6. API architecture

REST, `/api/v1`, JSON, Pydantic validation, consistent error envelope `{error:{code,message,fields?}}`.
Public: services, brands, models, variants, locations, availability, bookings (create/get by reference + token), payments (create-order, verify, webhook), enquiries (roadside, finance, insurance, contact).
Customer: bookings, vehicles, reports. Inspector: inspections, checklist, photos, submit. Admin: CRUD per module.
Status codes: 400/422 validation, 401, 403, 404, 409 conflict (slot taken), 429 rate limit, 5xx generic message (no stack traces).

## 7. Authentication

- Argon2id password hashing. Short-lived access JWT + rotating refresh token in `HttpOnly; Secure; SameSite=Lax` cookies.
- CSRF token for cookie-authenticated mutating requests. Rate limiting on login, reset, enquiries.
- Password reset via single-use, expiring token (hashed in DB). Account deactivation revokes sessions.
- RBAC enforced by backend dependencies; frontend route guards are UX only.
- Guest booking allowed; booking lookup requires reference + phone/OTP or signed token.

## 8. Payment architecture (Razorpay)

1. Client sends service, vehicle, slot, customer details. 2. Backend validates and computes the price from DB (ignores any client amount).
3. Booking created (NEW, slot held with expiry). Razorpay order created in paise; PaymentAttempt stored.
4. Frontend opens Checkout with public key and order id. 5. On success callback, frontend posts payment id/order id/signature to `/payments/verify`; backend verifies HMAC-SHA256 — still only marks PENDING→PAID once consistent.
6. Webhook (signature verified with webhook secret, raw body) is the source of truth; idempotent via unique event id.
Statuses: CREATED, PENDING, AUTHORIZED, PAID, FAILED, CANCELLED, REFUNDED, PARTIALLY_REFUNDED. Multiple attempts per booking; one PAID max (unique partial index). Refunds via admin with audit log.

## 9. Vehicle catalog

Tables Brand → VehicleModel → VehicleVariant with `is_active`, search indexes. Admin CRUD with disable/re-enable.
Backend validates brand/model/variant relationship on every booking. Frontend `services/vehicleCatalog.ts` is a repository interface (`getBrands`, `getModels(brandId)`, `getVariants(modelId)`); mock implementation now, HTTP implementation later. Dev data is explicitly marked "development data — not a verified catalog".

## 10. Booking architecture

Steps: service → vehicle → location → date → time → customer → summary → payment → confirmation.
Slot reservation inside a DB transaction (`SELECT … FOR UPDATE` / unique constraint) to prevent double booking; unpaid holds expire.
Status machine: NEW → CONTACTED → CONFIRMED → INSPECTOR_ASSIGNED → INSPECTION_SCHEDULED → INSPECTION_IN_PROGRESS → COMPLETED → REPORT_GENERATED → REPORT_SENT; CANCELLED from any pre-completed state. Transitions validated server-side and audit logged.

## 11. Inspector architecture

Separate `/inspector` area. Sees only assigned inspections. Workflow: ASSIGNED → ACCEPTED → SCHEDULED → STARTED → CHECKLIST → PHOTOS → FINDINGS → COMPLETED → SUBMITTED. Checklist is generated from admin-configured checklist templates per service. Photo upload via presigned URLs with type/size validation; offline-tolerant draft saving.

## 12. Report architecture

Scores computed by a documented, configurable scoring config (weights per category, penalty per ATTENTION/CRITICAL; versioned and stored with the report). PDF generated asynchronously (HTML template → PDF), stored privately; customers receive short-lived signed URLs. Certificates are a separate entity, generated only for services configured to issue one. Disclaimer text is admin-managed and client-approved.

## 13. Notification architecture

Event bus inside the backend → notification service → channel providers (email, WhatsApp Business templates, SMS) behind interfaces. Every send logged in `notifications` with status and retries (queue + backoff). Events: booking created, payment success/failed, confirmed, inspector assigned, scheduled, completed, report generated/sent, roadside/finance/insurance enquiry.

## 14. Admin architecture

`/admin` with module-based sidebar: Dashboard, Bookings, Customers, Services & Pricing, Brands/Models/Variants, Locations & Availability, Payments, Inspectors, Inspections, Reports, Leads (roadside/finance/insurance), Reviews, FAQs, Certifications, Blog, Website content, Notifications, Audit logs, Settings. Dashboard metrics are real aggregate queries only. Permissions matrix per role.

## 15. Deployment architecture

Frontend: Vercel. Backend: container on Render/Railway/AWS (health check `/healthz`). Managed PostgreSQL with daily backups + PITR, 14–30 day retention (to be confirmed). Private object storage with versioning. Redis for queue/rate limiting. Alembic migrations run on deploy. Monitoring: Sentry + uptime checks + structured logs (no secrets/PII). Recovery runbook in `/docs` before launch.

## 16. Security architecture

HTTPS/HSTS, secure cookies, CORS allow-list, CSRF, rate limiting, input validation, ORM-only queries, output escaping, CSP headers, file validation (extension + MIME + magic bytes + size), private storage, webhook signature verification, RBAC + object-level authorization (customer/inspector ownership checks), audit logging, secrets only in environment/secret manager, generic production errors, dependency scanning.

## 17. Folder structure

```
my-car-master/
├── docs/                 architecture, roadmap, client information needed
├── frontend/             deployable Next.js app
│   ├── app/  components/  config/  db/  lib/  services/  types/  public/
│   └── .env.example      frontend environment template
├── docs/                 deployment, architecture, and client notes
└── .gitignore
```

## 18. Development roadmap

| Phase | Scope |
|---|---|
| 1 | Foundation + premium UI (this delivery) |
| 2 | Vehicle system (reusable selector, repository abstraction) |
| 3 | Complete service experiences and forms |
| 4 | FastAPI, PostgreSQL, bookings |
| 5 | Razorpay integration |
| 6 | Admin dashboard |
| 7 | Inspector system |
| 8 | Reports, PDFs, certificates, customer portal |
| 9 | Notifications + business integrations |
| 10 | Production launch (security audit, backups, monitoring, QA) |
