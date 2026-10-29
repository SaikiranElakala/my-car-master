import { bookingPool } from "@/lib/bookingDb";
import { createBookingRequestPdf } from "@/lib/bookingRequestPdf";
import { client, formatContactPhone } from "@/config/client";

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
  channel: "email" | "whatsapp" | "customer_email";
  attempts: number;
  customer_name: string;
  phone: string;
  customer_email: string;
  request_type: string;
  details: Record<string, string>;
  created_at: Date;
};

export async function saveCustomerRequest(request: {
  id: string;
  type: "booking" | "roadside" | "finance" | "insurance" | "contact";
  name: string;
  phone: string;
  email: string;
  details: Record<string, string>;
}) {
  const connection = await bookingPool().connect();
  try {
    await connection.query("BEGIN");
    await connection.query(
    `INSERT INTO customer_requests (id, request_type, customer_name, phone, customer_email, details)
     VALUES ($1, $2, $3, $4, $5, $6::jsonb)`,
    [request.id, request.type, request.name, request.phone, request.email, JSON.stringify(request.details)],
    );
    if (request.type === "booking") {
      await connection.query(
        `INSERT INTO booking_notification_jobs (request_id, channel)
         VALUES ($1, 'email'), ($1, 'customer_email') ON CONFLICT (request_id, channel) DO NOTHING`,
        [request.id],
      );
    } else {
      await connection.query(
        `INSERT INTO booking_notification_jobs (request_id, channel)
         VALUES ($1, 'customer_email') ON CONFLICT (request_id, channel) DO NOTHING`,
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

function customerConfirmationEmail(name: string, service: string, reference: string) {
  const siteUrl = `https://${client.domain}`;
  const contactPhone = client.phone || client.secondaryPhone || client.whatsappNumber || client.additionalPhone;
  const displayPhone = formatContactPhone(contactPhone) || contactPhone;
  const dialPhone = contactPhone.replace(/[^+\d]/g, "");
  const text = [
    `Hi ${name},`,
    "",
    "YOUR REQUEST IS IN GOOD HANDS",
    `We received your ${service} request successfully. Our team will reach out to you shortly.`,
    "",
    `Service: ${service}`,
    `Request reference: ${reference}`,
    "",
    "This email confirms receipt of your request; it does not confirm an appointment or service availability.",
    "",
    `Questions? Call us at ${displayPhone} or visit ${siteUrl}.`,
    "",
    "My Car Master",
  ].join("\n");
  const html = `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#f3f1ed;font-family:Arial,Helvetica,sans-serif;color:#202124;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f3f1ed;padding:28px 12px;">
      <tr><td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:18px;overflow:hidden;">
          <tr><td style="padding:22px 32px;border-bottom:1px solid #eee9e2;">
            <a href="${siteUrl}" style="text-decoration:none;"><img src="${siteUrl}/images/brand/my-car-master-logo.png" width="230" alt="My Car Master" style="display:block;width:230px;max-width:100%;height:auto;border:0;"></a>
          </td></tr>
          <tr><td style="height:6px;background:#ed174c;font-size:0;line-height:0;">&nbsp;</td></tr>
          <tr><td style="padding:34px 32px 14px;">
            <span style="display:inline-block;padding:7px 11px;border-radius:20px;background:#fff1e6;color:#a94300;font-size:11px;font-weight:700;letter-spacing:1px;">SERVICE REQUEST RECEIVED</span>
            <h1 style="margin:18px 0 10px;font-size:28px;line-height:1.25;color:#17191d;">We’re on it, ${escapeHtml(name)}.</h1>
            <p style="margin:0;font-size:16px;line-height:1.65;color:#545963;">Thanks for choosing My Car Master. Our team has received your request and will reach out to you shortly.</p>
          </td></tr>
          <tr><td style="padding:16px 32px 8px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f8f6f2;border:1px solid #eee8df;border-radius:14px;">
              <tr><td style="padding:20px 22px;">
                <p style="margin:0 0 7px;color:#737780;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Your selected service</p>
                <p style="margin:0;color:#17191d;font-size:19px;font-weight:700;line-height:1.4;">${escapeHtml(service)}</p>
                <p style="margin:16px 0 5px;color:#737780;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Request reference</p>
                <p style="margin:0;color:#30343a;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.5;word-break:break-all;">${escapeHtml(reference)}</p>
              </td></tr>
            </table>
          </td></tr>
          <tr><td style="padding:18px 32px 28px;">
            <p style="margin:0;color:#777c84;font-size:12px;line-height:1.6;">This confirms we received your request. Your appointment and service availability will be confirmed by our team separately.</p>
          </td></tr>
          <tr><td style="padding:24px 32px;background:#17191d;color:#ffffff;">
            <p style="margin:0 0 8px;color:#ffffff;font-size:15px;font-weight:700;">Need help? We’re easy to reach.</p>
            <p style="margin:0 0 16px;color:#d5d6d8;font-size:13px;line-height:1.6;">Call our team or visit our website for more information.</p>
            <a href="tel:${dialPhone}" style="display:inline-block;padding:12px 18px;border-radius:24px;background:#ed174c;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;">Call ${escapeHtml(displayPhone)}</a>
            <p style="margin:18px 0 0;font-size:12px;"><a href="${siteUrl}" style="color:#ffc080;text-decoration:none;">mycarmaster.in</a></p>
          </td></tr>
          <tr><td style="padding:18px 32px;text-align:center;color:#8a8d93;font-size:11px;line-height:1.5;">© My Car Master · Inspect. Evaluate. Drive with Confidence.</td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
  return { text, html };
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
      `SELECT j.request_id AS id, j.channel, j.attempts, r.customer_name, r.phone, r.customer_email, r.request_type, r.details, r.created_at
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
    const service = d.service || d.serviceName || (job.request_type === "roadside"
      ? `Roadside Assistance${d.type ? ` - ${d.type}` : ""}`
      : job.request_type === "finance" ? "Used Car Finance"
      : job.request_type === "insurance" ? `Car Insurance${d.type ? ` - ${d.type}` : ""}`
      : job.request_type === "booking" ? "Service"
      : "Customer enquiry");
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
      if (job.channel === "customer_email" && apiKey && sender && job.customer_email) {
        const confirmation = customerConfirmationEmail(job.customer_name, service, reference);
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "Idempotency-Key": `customer-confirmation-${reference}` },
          body: JSON.stringify({
            from: sender,
            to: [job.customer_email],
            subject: `We received your ${service} request - My Car Master`,
            text: confirmation.text,
            html: confirmation.html,
          }),
          signal: AbortSignal.timeout(8_000),
        });
        const data = await response.json().catch(() => ({}));
        sent = response.ok; messageId = typeof data.id === "string" ? data.id : null; errorCode = response.ok ? "" : resendErrorCode(response.status, data);
      } else if (job.channel === "email" && apiKey && sender && recipient) {
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

export async function tryCustomerConfirmationEmailNow(id: string) {
  return deliverBookingNotification(id, "customer_email");
}

export async function retryBookingNotifications(limit = 10) {
  const summary = { attempted: 0, sent: 0, email: 0, whatsapp: 0, customer_email: 0 };
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
    // Keep enquiry delivery compatible with the variables used by booking emails.
    const sender = process.env.EMAIL_FROM || process.env.BOOKING_FROM_EMAIL;
    const recipient = process.env.BOOKING_TO_EMAIL || process.env.BOOKING_NOTIFICATION_EMAIL;
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
