ALTER TABLE public.customer_requests
  ADD COLUMN IF NOT EXISTS customer_email TEXT;

ALTER TABLE public.booking_notification_jobs
  DROP CONSTRAINT IF EXISTS booking_notification_jobs_channel_check;

ALTER TABLE public.booking_notification_jobs
  ADD CONSTRAINT booking_notification_jobs_channel_check
  CHECK (channel IN ('email', 'whatsapp', 'sms', 'whatsapp_customer', 'customer_email'));
