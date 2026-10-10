import { bookingPool } from "@/lib/bookingDb";
import { createBookingRequestPdf } from "@/lib/bookingRequestPdf";

type CustomerRequest = {
  id: string;
  request_type: string;
  customer_name: string;
  phone: string;
  details: Record<string, string>;
  email_attempts: number;
};

type BookingNotification = {
  id: string;
  channel: "email" | "whatsapp";
  attempts: number;
  customer_name: string;
  phone: string;
  details: Record<string, string>;
  created_at: Date;
};

export async function saveCustomerRequest(request: {
  id: string;
  type: "booking" | "roadside" | "finance" | "insurance" | "contact";
  name: string;
  phone: string;
  details: Record<string, string>;
}) {
  const connection = await bookingPool().connect();
  try {
    await connection.query("BEGIN");
    await connection.query(
    `INSERT INTO customer_requests (id, request_type, customer_name, phone, details)
     VALUES ($1, $2, $3, $4, $5::jsonb)`,
    [request.id, request.type, request.name, request.phone, JSON.stringify(request.details)],
    );
    if (request.type === "booking") {
      await connection.query(
        `INSERT INTO booking_notification_jobs (request_id, channel)
         VALUES ($1, 'email'), ($1, 'whatsapp') ON CONFLICT (request_id, channel) DO NOTHING`,
        [request.id],
      );
    }
    await connection.query("COMMIT");
  } catch (error) {
    await connection.query("ROLLBACK");
    throw error;
  } finally {
    connection.release();
  }
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);
}

function resendErrorCode(status: number, data: unknown) {
  const name = data && typeof data === "object" && "name" in data && typeof data.name === "string"
    ? data.name.toLowerCase().replace(/[^a-z0-9_]+/g, "_").slice(0, 48)
    : "provider_error";
  return `resend_http_${status}_${name}`;
}

async function deliverBookingNotification(requestId?: string, channel?: BookingNotification["channel"]) {
  const connection = await bookingPool().connect();
  try {
    await connection.query("BEGIN");
    const result = await connection.query<BookingNotification>(
      `SELECT j.request_id AS id, j.channel, j.attempts, r.customer_name, r.phone, r.details, r.created_at
       FROM booking_notification_jobs j JOIN customer_requests r ON r.id = j.request_id
       WHERE j.status = 'pending' AND j.next_attempt_at <= NOW() AND j.attempts < $1
         AND ($2::uuid IS NULL OR j.request_id = $2::uuid)
         AND ($3::text IS NULL OR j.channel = $3::text)
       ORDER BY j.next_attempt_at, j.created_at LIMIT 1 FOR UPDATE OF j SKIP LOCKED`,
      [Math.max(1, Number(process.env.NOTIFICATION_MAX_ATTEMPTS) || 8), requestId ?? null, channel ?? null],
    );
    const job = result.rows[0];
    if (!job) { await connection.query("COMMIT"); return { attempted: false, sent: false, channel: null }; }

    const d = job.details;
    const reference = job.id;
    const fields = [
      ["Booking reference", reference], ["Service", d.service], ["Customer", job.customer_name],
      ["Phone", job.phone], ["Vehicle", [d.brand, d.model, d.vehicleType].filter(Boolean).join(" ")],
      ["Preferred appointment", d.preferredDate], ["Location", [d.area, d.city].filter(Boolean).join(", ")],
      ["Created", job.created_at.toISOString()],
    ].filter(([, v]) => Boolean(v)) as [string, string][];
    const plainText = fields.map(([label, value]) => `${label}: ${value}`).join("\n");
    const apiKey = process.env.RESEND_API_KEY;
    const sender = process.env.EMAIL_FROM || process.env.BOOKING_FROM_EMAIL;
    const recipient = process.env.BOOKING_NOTIFICATION_EMAIL || process.env.BOOKING_TO_EMAIL;
    const waToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const waPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const maxAttempts = Math.max(1, Number(process.env.NOTIFICATION_MAX_ATTEMPTS) || 8);
    let sent = false;
    let messageId: string | null = null;
    let errorCode = "configuration_error";
    try {
      if (job.channel === "email" && apiKey && sender && recipient) {
        const pdf = createBookingRequestPdf({
          id: reference,
          customerName: job.customer_name,
          phone: job.phone,
          details: d,
          createdAt: job.created_at,
        });
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "Idempotency-Key": `booking-${reference}` },
          body: JSON.stringify({ from: sender, to: [recipient], subject: `New Booking Request – My Car Master – ${reference}`, text: `${plainText}\n\nThe booking request summary is attached as a PDF. The appointment is not confirmed yet.`, html: `<h2>New booking request</h2><table>${fields.map(([k,v]) => `<tr><th align="left">${escapeHtml(k)}</th><td>${escapeHtml(v)}</td></tr>`).join("")}</table><p>The booking request summary is attached as a PDF. The appointment is not confirmed yet.</p>`, attachments: [{ filename: `booking-request-${reference.slice(0, 8)}.pdf`, content: pdf.toString("base64") }] }),
          signal: AbortSignal.timeout(8_000),
        });
        const data = await response.json().catch(() => ({}));
        sent = response.ok; messageId = typeof data.id === "string" ? data.id : null; errorCode = response.ok ? "" : resendErrorCode(response.status, data);
      } else if (job.channel === "whatsapp" && waToken && waPhoneId && process.env.WHATSAPP_OPT_IN_CONFIRMED === "true" && process.env.WHATSAPP_TEMPLATE_NAME && process.env.WHATSAPP_TEMPLATE_LANGUAGE) {
        const response = await fetch(`https://graph.facebook.com/v21.0/${encodeURIComponent(waPhoneId)}/messages`, {
          method: "POST", headers: { Authorization: `Bearer ${waToken}`, "Content-Type": "application/json" },
          body: JSON.stringify({ messaging_product: "whatsapp", to: (process.env.WHATSAPP_RECIPIENT_NUMBER || "").replace(/\D/g, ""), type: "template", template: { name: process.env.WHATSAPP_TEMPLATE_NAME, language: { code: process.env.WHATSAPP_TEMPLATE_LANGUAGE }, components: [{ type: "body", parameters: [reference, d.service || "Booking", job.customer_name, d.preferredDate || "Not specified", [d.area, d.city].filter(Boolean).join(", ") || "Not specified"].map((text) => ({ type: "text", text })) }] } }),
          signal: AbortSignal.timeout(8_000),
        });
        const data = await response.json().catch(() => ({}));
        sent = response.ok; messageId = data.messages?.[0]?.id || null; errorCode = response.ok ? "" : `whatsapp_http_${response.status}`;
      }
    } catch (error) {
      errorCode = error instanceof Error && error.name === "TimeoutError" ? "provider_timeout_uncertain" : "provider_network_error";
    }
    const attempts = job.attempts + 1;
    const backoffMinutes = Math.min(1440, 2 ** Math.min(attempts, 10));
    await connection.query(
      `UPDATE booking_notification_jobs SET status=$3, attempts=$2, last_attempt_at=NOW(),
       next_attempt_at=NOW()+($4 * INTERVAL '1 minute'), provider_message_id=$5, last_error=$6,
       sent_at=CASE WHEN $3='sent' THEN NOW() ELSE sent_at END WHERE request_id=$1 AND channel=$7`,
      [job.id, attempts, sent ? "sent" : attempts >= maxAttempts ? "failed" : "pending", backoffMinutes, messageId, sent ? null : errorCode, job.channel],
    );
    await connection.query("COMMIT");
    return { attempted: true, sent, channel: job.channel };
  } catch (error) { await connection.query("ROLLBACK"); throw error; }
  finally { connection.release(); }
}

export async function tryBookingEmailNow(id: string) {
  return deliverBookingNotification(id, "email");
}

export async function retryBookingNotifications(limit = 10) {
  const summary = { attempted: 0, sent: 0, email: 0, whatsapp: 0 };
  for (let i = 0; i < limit; i++) {
    const result = await deliverBookingNotification();
    if (!result.attempted) break;
    summary.attempted++;
    if (result.sent) summary.sent++;
    if (result.channel) summary[result.channel]++;
  }
  return summary;
}

async function deliverOne(requestId?: string) {
  const connection = await bookingPool().connect();
  try {
    await connection.query("BEGIN");
    const result = await connection.query<CustomerRequest>(
      `SELECT id, request_type, customer_name, phone, details, email_attempts
       FROM customer_requests
       WHERE request_type <> 'booking' AND email_status = 'pending' AND next_email_attempt_at <= NOW()
         AND ($1::uuid IS NULL OR id = $1::uuid)
       ORDER BY created_at
       LIMIT 1
       FOR UPDATE SKIP LOCKED`,
      [requestId ?? null],
    );
    const request = result.rows[0];
    if (!request) {
      await connection.query("COMMIT");
      return { attempted: false, sent: false };
    }

    const apiKey = process.env.RESEND_API_KEY;
    const sender = process.env.BOOKING_FROM_EMAIL;
    const recipient = process.env.BOOKING_TO_EMAIL;
    let sent = false;
    let failureStatus = "configuration_error";

    if (apiKey && sender && recipient) {
      try {
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "Idempotency-Key": `request-${request.id}`,
          },
          body: JSON.stringify({
            from: sender,
            to: [recipient],
            subject: `New ${request.request_type} request — ${request.customer_name}`,
            text: [
              `New ${request.request_type} request`,
              "",
              `Customer: ${request.customer_name}`,
              `Mobile: ${request.phone}`,
              ...Object.entries(request.details).map(([key, value]) => `${key}: ${value}`),
              `Reference: ${request.id}`,
            ].join("\n"),
          }),
          signal: AbortSignal.timeout(5_000),
        });
        const data = await response.json().catch(() => ({}));
        sent = response.ok;
        failureStatus = response.ok ? "" : resendErrorCode(response.status, data);
      } catch {
        failureStatus = "resend_network_error";
      }
    }

    const attempts = request.email_attempts + 1;
    if (sent) {
      await connection.query(
        `UPDATE customer_requests
         SET email_status = 'sent', email_attempts = $2,
             email_sent_at = NOW(), last_email_error = NULL
         WHERE id = $1`,
        [request.id, attempts],
      );
    } else {
      const retryMinutes = Math.min(60, 2 ** Math.min(attempts, 6));
      await connection.query(
        `UPDATE customer_requests
         SET email_attempts = $2,
             next_email_attempt_at = NOW() + ($3 * INTERVAL '1 minute'),
             last_email_error = $4
         WHERE id = $1`,
        [request.id, attempts, retryMinutes, failureStatus],
      );
    }
    await connection.query("COMMIT");
    return { attempted: true, sent };
  } catch (error) {
    await connection.query("ROLLBACK");
    throw error;
  } finally {
    connection.release();
  }
}

export async function tryCustomerRequestEmailNow(id: string) {
  return deliverOne(id);
}

export async function retryPendingCustomerRequestEmails(limit = 5) {
  let attempted = 0;
  let sent = 0;
  for (let index = 0; index < limit; index += 1) {
    const result = await deliverOne();
    if (!result.attempted) break;
    attempted += 1;
    if (result.sent) sent += 1;
  }
  return { attempted, sent };
}
