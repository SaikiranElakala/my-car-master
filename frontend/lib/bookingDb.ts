import { Pool } from "pg";

const globalForBookingDb = globalThis as typeof globalThis & { bookingDbPool?: Pool };

export function bookingPool() {
  const connectionString = process.env.BOOKING_DATABASE_URL;
  if (!connectionString) throw new Error("BOOKING_DATABASE_URL is not configured.");

  if (!globalForBookingDb.bookingDbPool) {
    globalForBookingDb.bookingDbPool = new Pool({
      connectionString,
      max: 3,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 5_000,
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: true } : undefined,
    });
  }

  return globalForBookingDb.bookingDbPool;
}
