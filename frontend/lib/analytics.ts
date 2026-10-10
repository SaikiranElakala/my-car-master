type EventName =
  | "book_now_click" | "service_view" | "vehicle_selection" | "booking_started" | "booking_completed"
  | "payment_successful" | "payment_failed" | "whatsapp_click" | "call_click"
  | "roadside_request" | "finance_enquiry" | "insurance_enquiry";

/** Thin analytics wrapper. No-op unless a gtag function is loaded. Never pass personal data. */
export function track(event: EventName, params: Record<string, string | number> = {}) {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
  gtag?.("event", event, params);
}
