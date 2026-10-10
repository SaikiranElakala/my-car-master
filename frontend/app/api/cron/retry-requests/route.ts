import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { retryPendingCustomerRequestEmails, retryBookingNotifications } from "@/lib/customerRequestQueue";
import { deleteExpiredCustomerRequests } from "@/lib/customerRequestRetention";

export const runtime = "nodejs";
export const maxDuration = 60;

function authorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!secret || !supplied) return false;
  const expectedBuffer = Buffer.from(secret);
  const suppliedBuffer = Buffer.from(supplied);
  return expectedBuffer.length === suppliedBuffer.length && timingSafeEqual(expectedBuffer, suppliedBuffer);
}

export async function GET(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const [email, bookings] = await Promise.all([retryPendingCustomerRequestEmails(), retryBookingNotifications(10)]);
    const retention = await deleteExpiredCustomerRequests();
    return NextResponse.json({ ok: true, email, bookings, retention });
  } catch (error) {
    console.error("Customer request email retry job failed:", error);
    return NextResponse.json({ error: "Retry job failed." }, { status: 503 });
  }
}
