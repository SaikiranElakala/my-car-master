import type { ChecklistGroup, FaqItem } from "@/types";

/** Potential inspection categories only — scope must be confirmed by the client. Admin-configurable later. */
export const usedCarChecklist: ChecklistGroup[] = [
  { category: "Body & paint", items: ["Exterior", "Paint / body", "Panel gaps"] },
  { category: "Mechanical", items: ["Engine", "Transmission", "Clutch", "Suspension", "Brakes", "Steering"] },
  { category: "Wheels & electrical", items: ["Tyres", "Electrical", "AC", "OBD scan"] },
  { category: "Cabin & records", items: ["Interior", "Documents", "Test drive", "History information (where available)"] },
];

export const pdiChecklist: ChecklistGroup[] = [
  { category: "Identity", items: ["VIN / chassis", "Engine number", "Manufacturing date", "Documents"] },
  { category: "Exterior", items: ["Exterior", "Paint", "Panel gaps", "Tyres", "Underbody"] },
  { category: "Systems", items: ["Battery", "AC", "Lights", "Electrical", "Infotainment"] },
  { category: "Cabin & drive", items: ["Interior", "Accessories", "Test drive"] },
];

export const faqs: FaqItem[] = [
  { q: "What is a used car evaluation?", a: "A structured review of a pre-owned vehicle before you decide whether to buy. My Car Master will confirm inspection scope and how findings are shared when it follows up.", service: "used-car-evaluation" },
  { q: "What is a PDI?", a: "A Pre-Delivery Inspection checks a new car for issues before you accept delivery from the dealership.", service: "new-car-pdi" },
  { q: "How much does it cost?", a: "Inspection prices vary by vehicle segment. See the Used Car Evaluation or New Car PDI page for the current segment-wise prices before booking.", service: "general" },
  { q: "Which areas do you cover?", a: "The Locations page lists cities and areas for enquiries. Share your exact locality so the team can confirm service availability.", service: "general" },
  { q: "Does an inspection guarantee the car has no defects?", a: "No. The inspection is limited to the agreed scope, and hidden, intermittent or inaccessible defects may not be detected.", service: "general" },
  { q: "Do you provide roadside assistance round the clock?", a: "Availability hours are being confirmed. Please contact us for current availability.", service: "roadside-assistance" },
];
