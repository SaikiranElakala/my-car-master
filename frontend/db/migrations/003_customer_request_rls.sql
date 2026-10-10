-- Customer request data includes contact details and must not be exposed by the Supabase Data API.
-- The website uses a server-side PostgreSQL connection, so public API roles need no table access.
ALTER TABLE public.customer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_notification_jobs ENABLE ROW LEVEL SECURITY;

REVOKE ALL PRIVILEGES ON TABLE public.customer_requests FROM PUBLIC, anon, authenticated;
REVOKE ALL PRIVILEGES ON TABLE public.booking_notification_jobs FROM PUBLIC, anon, authenticated;

