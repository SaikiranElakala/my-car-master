import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { saveCustomerRequest, tryBookingEmailNow, tryCustomerConfirmationEmailNow } from "@/lib/customerRequestQueue";
import { readJsonRequest } from "@/lib/readJsonRequest";
import { locationGroups } from "@/config/locations";
import { vehicleTypes } from "@/config/vehicleTypes";

export const runtime = "nodejs";
export const maxDuration = 10;

const requiredFields = ["name", "phone", "city", "area", "service", "preferredDate", "brand", "model"] as const;
const bookingServices = ["Used Car Inspection", "New Car PDI Inspection"];

function isValidRequestDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return false;

  const todayParts = new Intl.DateTimeFormat("en", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const today = `${todayParts.find((part) => part.type === "year")?.value}-${todayParts.find((part) => part.type === "month")?.value}-${todayParts.find((part) => part.type === "day")?.value}`;
  return value >= today;
}

export async function POST(request: Request) {
  const parsed = await readJsonRequest(request);
  if (!parsed.ok) return NextResponse.json({ error: parsed.reason === "too_large" ? "Request is too large." : "Invalid request." }, { status: parsed.reason === "too_large" ? 413 : 400 });
  const body = parsed.value as Record<string, unknown>;

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (body.privacyNoticeAcknowledged !== true) {
    return NextResponse.json({ error: "Please review the Privacy Policy and confirm before sending your request." }, { status: 400 });
  }

  const values = Object.fromEntries(requiredFields.map((field) => [field, body[field]])) as Record<typeof requiredFields[number], unknown>;
  if (requiredFields.some((field) => typeof values[field] !== "string" || !(values[field] as string).trim())) {
    return NextResponse.json({ error: "Please complete all booking fields." }, { status: 400 });
  }

  const booking = Object.fromEntries(requiredFields.map((field) => [field, (values[field] as string).trim()])) as Record<typeof requiredFields[number], string>;
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address for your confirmation." }, { status: 400 });
  }
  const vehicleType = typeof body.vehicleType === "string" ? body.vehicleType.trim() : "";
  if (vehicleType && !vehicleTypes.some((type) => type === vehicleType)) {
    return NextResponse.json({ error: "Please select a listed vehicle type or leave it blank." }, { status: 400 });
  }
  const supportedCity = locationGroups.some((group) => (group.cities as readonly string[]).includes(booking.city));
  const normalizedPhone = booking.phone.replace(/[\s()-]/g, "");
  const hasControlCharacters = [booking.name, booking.city, booking.area, booking.service, booking.brand, booking.model].some((value) => /[\u0000-\u001F\u007F]/.test(value));
  if (
    booking.name.length > 120 || booking.phone.length > 30 || booking.city.length > 100 ||
    booking.area.length > 120 || booking.service.length > 120 || booking.brand.length > 100 ||
    booking.model.length > 100 || hasControlCharacters || !/^(?:\+91)?[6-9]\d{9}$/.test(normalizedPhone) || !supportedCity ||
    !bookingServices.includes(booking.service) || !isValidRequestDate(booking.preferredDate)
  ) {
    return NextResponse.json({ error: "Please check the booking details and try again." }, { status: 400 });
  }

  const id = randomUUID();
  try {
    await saveCustomerRequest({
      id,
      type: "booking",
      name: booking.name,
      phone: booking.phone,
      email,
      details: {
        city: booking.city,
        area: booking.area,
        service: booking.service,
        preferredDate: booking.preferredDate,
        brand: booking.brand,
        model: booking.model,
        ...(vehicleType ? { vehicleType } : {}),
        privacyNoticeAcknowledged: "true",
      },
    });
  } catch (error) {
    console.error("Booking could not be saved:", error);
    const databaseErrorCode = error && typeof error === "object" && "code" in error && typeof error.code === "string"
      ? error.code
      : error instanceof Error ? error.name : "unknown";
    return NextResponse.json({
      error: "We couldn't safely save your request. Please try again.",
      ...(process.env.NODE_ENV !== "production" ? { diagnostic: `Database error: ${databaseErrorCode}` } : {}),
    }, { status: 503 });
  }

  // Try notifications immediately; database-backed jobs remain available to the retry worker.
  const [emailResult, customerEmailResult] = await Promise.allSettled([tryBookingEmailNow(id), tryCustomerConfirmationEmailNow(id)]);
  if (emailResult.status === "rejected") console.error("Immediate booking email attempt failed; it remains queued:", emailResult.reason);
  if (customerEmailResult.status === "rejected") console.error("Immediate customer confirmation email failed; it remains queued:", customerEmailResult.reason);

  return NextResponse.json({ ok: true, reference: id, customerEmailSent: customerEmailResult.status === "fulfilled" && customerEmailResult.value.sent }, { status: 202 });
}
