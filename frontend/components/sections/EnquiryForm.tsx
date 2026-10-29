"use client";
import { useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { track } from "@/lib/analytics";
import { customerErrorMessage, readApiResponse } from "@/lib/apiResponse";
import { PrivacyPolicyDialog } from "@/components/legal/PrivacyPolicyDialog";
import { locationGroups, neighborhoodsByLocation } from "@/config/locations";

type Props = { kind: "finance" | "insurance" | "roadside" | "contact"; fields?: { name: string; label: string; options?: string[]; required?: boolean }[]; submitLabel?: string; showCityArea?: boolean; serviceName?: string };

export function EnquiryForm({ kind, fields = [], submitLabel = "Send enquiry", showCityArea = false, serviceName }: Props) {
  const [done, setDone] = useState(false);
  const [requestReference, setRequestReference] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [customArea, setCustomArea] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerEmailSent, setCustomerEmailSent] = useState(false);
  const [confirmationService, setConfirmationService] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const details = Object.fromEntries(
      [...data.entries()]
        .filter(([key, value]) => key !== "name" && key !== "phone" && key !== "email" && key !== "privacyNoticeAcknowledged" && key !== "areaChoice" && key !== "customArea" && value.toString().trim())
        .map(([key, value]) => [key, value.toString().trim()]),
    );
    if (showCityArea) {
      details.city = selectedCity;
      details.area = selectedArea === "Other" ? customArea.trim() : selectedArea;
      if (kind === "roadside") details.location = [details.area, details.city].filter(Boolean).join(", ");
    }
    if (serviceName) details.serviceName = serviceName;
    const chosenService = typeof details.service === "string" ? details.service
      : kind === "roadside" ? `Roadside Assistance${typeof details.type === "string" ? ` - ${details.type}` : ""}`
      : kind === "finance" ? "Used Car Finance"
      : kind === "insurance" ? `Car Insurance${typeof details.type === "string" ? ` - ${details.type}` : ""}`
      : serviceName ?? "Customer enquiry";

    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, name: data.get("name"), phone: data.get("phone"), email: data.get("email"), privacyNoticeAcknowledged: data.get("privacyNoticeAcknowledged") === "on", details }),
      });
      const result = await readApiResponse(response, "We couldn't submit your enquiry. Please try again.");
      setRequestReference(typeof result.reference === "string" ? result.reference : "");
      setCustomerEmail(String(data.get("email") ?? ""));
      setCustomerEmailSent(result.customerEmailSent === true);
      setConfirmationService(chosenService);
      setDone(true);
      if (kind === "finance") track("finance_enquiry");
      if (kind === "insurance") track("insurance_enquiry");
      if (kind === "roadside") track("roadside_request");
    } catch (submitError) {
      setError(customerErrorMessage(submitError, "We couldn't submit your enquiry. Please try again."));
    } finally {
      setSubmitting(false);
    }
  }

  if (done)
    return (
      <div role="status" aria-live="polite" className="animate-success-heartbeat relative mx-auto w-full max-w-xl overflow-hidden rounded-3xl border border-emerald-200/80 bg-white p-6 text-center shadow-[0_24px_70px_-36px_rgba(16,185,129,0.5)] sm:p-9">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-300 via-emerald-500 to-teal-400" />
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-700 ring-8 ring-emerald-50/60">
          <CheckCircle2 className="h-9 w-9" aria-hidden="true" />
        </span>
        <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-700">Enquiry received</p>
        <h3 className="display mt-2 text-3xl">Thanks — you’re all set!</h3>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-steel">{customerEmailSent ? `Your ${confirmationService} request was received, and a confirmation email was sent to ${customerEmail}.` : `Your ${confirmationService} request was received. Our team will reach out shortly; the confirmation email is queued for delivery.`}</p>
        {requestReference && <div className="mt-6 rounded-xl border border-line bg-paper px-4 py-3"><p className="text-[10px] font-bold uppercase tracking-widest text-steel">Request reference</p><p className="mt-1 break-all font-mono text-xs text-ink">{requestReference}</p></div>}
        <Link href="/#services" className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700">Back to services <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
      </div>
    );

  const input = "mt-2 min-h-[52px] w-full rounded-xl border border-line bg-white px-4 text-ink outline-none focus:border-amber";
  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <label className="text-sm font-medium">Name
        <input name="name" required maxLength={120} autoComplete="name" className={input} />
      </label>
      <label className="text-sm font-medium">Mobile number
        <input name="phone" required type="tel" inputMode="numeric" autoComplete="tel" pattern="[6-9][0-9]{9}" maxLength={10} title="Enter a valid 10-digit Indian mobile number." className={input} />
      </label>
      <label className="text-sm font-medium">Email address
        <input name="email" required type="email" autoComplete="email" maxLength={254} className={input} />
      </label>
      {fields.map((field) => (
        <label key={field.name} className="text-sm font-medium">{field.label}
          {field.options ? (
              <select name={field.name} required={field.required} className={input} defaultValue="">
              <option value="" disabled>Select…</option>
              {field.options.map((option) => <option key={option}>{option}</option>)}
            </select>
          ) : <input name={field.name} required={field.required} maxLength={500} className={input} />}
        </label>
      ))}
      {showCityArea && <>
        <label className="text-sm font-medium">Select City
          <select name="city" required value={selectedCity} onChange={(event) => { setSelectedCity(event.target.value); setSelectedArea(""); setCustomArea(""); }} className={input}>
            <option value="" disabled>Select city…</option>
            {locationGroups.map((group) => <optgroup key={group.state} label={group.state}>{group.cities.map((city) => <option key={city} value={city}>{city}</option>)}</optgroup>)}
          </select>
        </label>
        <label className="text-sm font-medium">Select Area
          <select name="areaChoice" required disabled={!selectedCity} value={selectedArea} onChange={(event) => { setSelectedArea(event.target.value); setCustomArea(""); }} className={`${input} disabled:cursor-not-allowed disabled:opacity-60`}>
            <option value="" disabled>{selectedCity ? "Select area…" : "Select a city first"}</option>
            {(neighborhoodsByLocation[selectedCity] ?? []).map((area) => <option key={area} value={area}>{area}</option>)}
            <option value="Other">Other</option>
          </select>
          {selectedArea === "Other" && <input required name="customArea" value={customArea} onChange={(event) => setCustomArea(event.target.value)} maxLength={120} placeholder="Enter your area or locality" className={input} />}
        </label>
      </>}
      <label className="text-sm font-medium sm:col-span-2">Message (optional)
        <textarea name="message" rows={3} maxLength={500} className={`${input} py-3`} />
      </label>
      <label className="flex items-start gap-3 text-xs leading-5 text-steel sm:col-span-2">
        <input required type="checkbox" name="privacyNoticeAcknowledged" className="mt-0.5 h-5 w-5 shrink-0 accent-amber" />
        <span>I ask My Car Master to use these details to handle my enquiry as described in the <PrivacyPolicyDialog />.</span>
      </label>
      {error && <p role="alert" className="text-sm text-red-700 sm:col-span-2">{error}</p>}
      <div className="sm:col-span-2"><Button type="submit" disabled={submitting} className="w-full sm:w-auto">{submitting ? "Submitting…" : submitLabel}</Button></div>
    </form>
  );
}

