type BookingRequestPdfInput = {
  id: string;
  customerName: string;
  phone: string;
  details: Record<string, string>;
  createdAt: Date;
};

function pdfSafeText(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7e]/g, "?")
    .replace(/[\\()]/g, "\\$&");
}

function wrapText(value: string, maxLength = 82) {
  const safeValue = value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^\x20-\x7e]/g, "?");
  const words = safeValue.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const parts = word.match(new RegExp(`.{1,${maxLength}}`, "g")) ?? [word];
    for (const part of parts) {
      if (line && `${line} ${part}`.length > maxLength) {
        lines.push(line);
        line = part;
      } else {
        line = line ? `${line} ${part}` : part;
      }
    }
  }

  if (line) lines.push(line);
  return lines;
}

function createPdfDocument(content: string) {
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
    `<< /Length ${Buffer.byteLength(content, "ascii")} >>\nstream\n${content}\nendstream`,
  ];

  let document = "%PDF-1.4\n";
  const offsets = [0];
  for (const [index, object] of objects.entries()) {
    offsets.push(Buffer.byteLength(document, "ascii"));
    document += `${index + 1} 0 obj\n${object}\nendobj\n`;
  }

  const crossReferenceOffset = Buffer.byteLength(document, "ascii");
  document += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets.slice(1)) {
    document += `${String(offset).padStart(10, "0")} 00000 n \n`;
  }
  document += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${crossReferenceOffset}\n%%EOF`;
  return Buffer.from(document, "ascii");
}

export function createBookingRequestPdf(request: BookingRequestPdfInput) {
  const commands: string[] = [];
  const text = (value: string, x: number, y: number, size: number, bold = false, color = "0.10 0.11 0.13") => {
    commands.push(`BT /${bold ? "F2" : "F1"} ${size} Tf ${color} rg 1 0 0 1 ${x} ${y} Tm (${pdfSafeText(value)}) Tj ET`);
  };
  const rectangle = (x: number, y: number, width: number, height: number, color: string) => {
    commands.push(`${color} rg ${x} ${y} ${width} ${height} re f`);
  };
  const line = (x1: number, y1: number, x2: number, y2: number, color = "0.88 0.86 0.83") => {
    commands.push(`${color} RG 0.7 w ${x1} ${y1} m ${x2} ${y2} l S`);
  };

  rectangle(0, 710, 612, 82, "0.09 0.10 0.12");
  rectangle(0, 786, 612, 6, "0.88 0.08 0.25");
  text("MY CAR MASTER", 44, 756, 19, true, "1 1 1");
  text("VEHICLE INSPECTION REQUEST", 44, 736, 9, true, "1 0.74 0.78");
  text("BOOKING SUMMARY", 435, 755, 9, true, "1 1 1");

  text("Request received", 44, 678, 21, true);
  text("This is a request only. The appointment is not confirmed yet.", 44, 657, 10, false, "0.38 0.40 0.43");

  rectangle(44, 588, 524, 48, "0.99 0.95 0.96");
  rectangle(44, 588, 4, 48, "0.88 0.08 0.25");
  text("BOOKING REFERENCE", 60, 617, 8, true, "0.70 0.07 0.20");
  text(request.id, 60, 599, 11, true, "0.70 0.07 0.20");

  let y = 556;
  const field = (label: string, value: string) => {
    if (!value.trim()) return;
    text(label.toUpperCase(), 44, y, 8, true, "0.43 0.45 0.48");
    y -= 15;
    for (const valueLine of wrapText(value)) {
      text(valueLine, 44, y, 10, true);
      y -= 13;
    }
    y -= 6;
    line(44, y, 568, y);
    y -= 16;
  };

  field("Service", request.details.service ?? "Vehicle inspection");
  field("Customer", request.customerName);
  field("Phone", request.phone);
  field("Vehicle", [request.details.brand, request.details.model, request.details.vehicleType].filter(Boolean).join(" "));
  field("Preferred appointment", request.details.preferredDate ?? "");
  field("Location", [request.details.area, request.details.city].filter(Boolean).join(", "));
  field("Request received", request.createdAt.toISOString().replace("T", " ").replace(/\.\d{3}Z$/, " UTC"));

  text("The My Car Master team will contact the customer to confirm availability.", 44, 72, 9, false, "0.38 0.40 0.43");
  line(44, 56, 568, 56);
  text("My Car Master | Booking request summary", 44, 38, 8, false, "0.48 0.49 0.51");

  return createPdfDocument(commands.join("\n"));
}
