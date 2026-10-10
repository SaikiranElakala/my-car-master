import { Pool } from "pg";

const globalForBookingDb = globalThis as typeof globalThis & { bookingDbPool?: Pool };

export function bookingPool() {
  const connectionString = process.env.BOOKING_DATABASE_URL;
  if (!connectionString) throw new Error("BOOKING_DATABASE_URL is not configured.");

  const isProduction = process.env.NODE_ENV === "production";
  const caCertificate = process.env.BOOKING_DATABASE_CA_BASE64
    ? Buffer.from(process.env.BOOKING_DATABASE_CA_BASE64, "base64").toString("utf8")
    : undefined;
  if (isProduction && !caCertificate) {
    throw new Error("BOOKING_DATABASE_CA_BASE64 is not configured.");
  }

  if (!globalForBookingDb.bookingDbPool) {
    globalForBookingDb.bookingDbPool = new Pool({
      connectionString,
      max: 3,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 5_000,
      ssl: isProduction ? { ca: caCertificate, rejectUnauthorized: true } : undefined,
    });
  }

  return globalForBookingDb.bookingDbPool;
}
