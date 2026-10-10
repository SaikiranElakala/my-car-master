import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { bookingPool } from "@/lib/bookingDb";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = process.env.WHATSAPP_VERIFY_TOKEN;
  if (url.searchParams.get("hub.mode") === "subscribe" && token && url.searchParams.get("hub.verify_token") === token) {
    return new Response(url.searchParams.get("hub.challenge") || "", { status: 200 });
  }
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export async function POST(request: Request) {
  const secret = process.env.WHATSAPP_APP_SECRET;
  const signature = request.headers.get("x-hub-signature-256") || "";
  const raw = await request.text();
  if (!secret || !/^sha256=[a-f0-9]{64}$/i.test(signature)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const expected = `sha256=${createHmac("sha256", secret).update(raw).digest("hex")}`;
  const receivedBytes = Buffer.from(signature);
  const expectedBytes = Buffer.from(expected);
  if (receivedBytes.length !== expectedBytes.length || !timingSafeEqual(receivedBytes, expectedBytes)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  let payload: { entry?: { changes?: { value?: { statuses?: { id?: string; status?: string; errors?: { code?: number }[] }[] } }[] }[] };
  try { payload = JSON.parse(raw); } catch { return NextResponse.json({ error: "Invalid payload" }, { status: 400 }); }
  const pool = bookingPool();
  for (const entry of payload.entry || []) for (const change of entry.changes || []) for (const status of change.value?.statuses || []) {
    if (!status.id || !["sent", "delivered", "read", "failed"].includes(status.status || "")) continue;
    await pool.query(
      `UPDATE booking_notification_jobs SET status=CASE WHEN $2='failed' THEN 'failed' ELSE 'sent' END,
       last_error=CASE WHEN $2='failed' THEN $3 ELSE NULL END WHERE channel='whatsapp' AND provider_message_id=$1`,
      [status.id, status.status, status.errors?.[0]?.code ? `whatsapp_delivery_${status.errors[0].code}` : "whatsapp_delivery_failed"],
    );
  }
  return NextResponse.json({ ok: true });
}
