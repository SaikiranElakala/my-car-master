import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { saveCustomerRequest, tryCustomerRequestEmailNow } from "@/lib/customerRequestQueue";
import { readJsonRequest } from "@/lib/readJsonRequest";

export const runtime = "nodejs";
export const maxDuration = 10;

type EnquiryType = "roadside" | "finance" | "insurance" | "contact";
const enquiryTypes: EnquiryType[] = ["roadside", "finance", "insurance", "contact"];

export async function POST(request: Request) {
  const parsed = await readJsonRequest(request);
  if (!parsed.ok) return NextResponse.json({ error: parsed.reason === "too_large" ? "Request is too large." : "Invalid request." }, { status: parsed.reason === "too_large" ? 413 : 400 });
  const body = parsed.value as Record<string, unknown>;
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const type = body.kind;
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.replace(/[\s()-]/g, "") : "";
  const rawDetails = body.details;
  if (body.privacyNoticeAcknowledged !== true) {
    return NextResponse.json({ error: "Please review the Privacy Policy and confirm before sending your enquiry." }, { status: 400 });
  }
  if (typeof type !== "string" || !enquiryTypes.includes(type as EnquiryType)) {
    return NextResponse.json({ error: "Invalid enquiry type." }, { status: 400 });
  }
  if (!name || name.length > 120 || /[\u0000-\u001F\u007F]/.test(name) || !/^[6-9]\d{9}$/.test(phone)) {
    return NextResponse.json({ error: "Please enter your name and a valid 10-digit Indian mobile number." }, { status: 400 });
  }
  if (!rawDetails || typeof rawDetails !== "object" || Array.isArray(rawDetails)) {
    return NextResponse.json({ error: "Invalid enquiry details." }, { status: 400 });
  }

  const entries = Object.entries(rawDetails as Record<string, unknown>);
  if (entries.length > 15 || entries.some(([key, value]) => !/^[a-zA-Z0-9_-]{1,40}$/.test(key) || typeof value !== "string" || value.length > 500)) {
    return NextResponse.json({ error: "Please check your enquiry details and try again." }, { status: 400 });
  }
  const details: Record<string, string> = {};
  for (const [key, value] of entries) {
    const cleanValue = (value as string).trim();
    if (/[\u0000-\u001F\u007F]/.test(cleanValue)) {
      return NextResponse.json({ error: "Please remove unsupported characters and try again." }, { status: 400 });
    }
    if (cleanValue) details[key] = cleanValue;
  }
  if (type === "roadside" && (!details.type || !details.location)) {
    return NextResponse.json({ error: "Please tell us what happened and where you need help." }, { status: 400 });
  }
  if (type === "insurance" && !details.type) {
    return NextResponse.json({ error: "Please choose the type of insurance help you need." }, { status: 400 });
  }
  details.privacyNoticeAcknowledged = "true";
  const id = randomUUID();

  try {
    await saveCustomerRequest({ id, type: type as EnquiryType, name, phone, details });
  } catch (error) {
    console.error("Customer enquiry could not be saved:", error);
    return NextResponse.json({ error: "We couldn't safely save your enquiry. Please try again." }, { status: 503 });
  }

  try {
    await tryCustomerRequestEmailNow(id);
  } catch (error) {
    console.error("Immediate enquiry email attempt failed; it remains queued:", error);
  }

  return NextResponse.json({ ok: true, reference: id }, { status: 202 });
}
