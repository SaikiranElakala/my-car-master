CREATE TABLE IF NOT EXISTS booking_notification_jobs (
  request_id UUID NOT NULL REFERENCES customer_requests(id) ON DELETE CASCADE,
  channel TEXT NOT NULL CHECK (channel IN ('email', 'whatsapp')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  attempts INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  next_attempt_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_attempt_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  provider_message_id TEXT,
  last_error TEXT,
  PRIMARY KEY (request_id, channel)
);
CREATE INDEX IF NOT EXISTS booking_notification_jobs_retry_idx
  ON booking_notification_jobs (next_attempt_at, created_at) WHERE status = 'pending';
