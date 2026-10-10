import { Pool } from "pg";

const globalForBookingDb = globalThis as typeof globalThis & { bookingDbPool?: Pool };

export function bookingPool() {
  const configuredConnectionString = process.env.BOOKING_DATABASE_URL;
  if (!configuredConnectionString) throw new Error("BOOKING_DATABASE_URL is not configured.");

  const isProduction = process.env.NODE_ENV === "production";
  // node-postgres replaces the `ssl` config object with SSL settings parsed from
  // the connection string. Remove those parameters so the explicit CA below is
  // retained when a Supabase URL includes e.g. `?sslmode=require`.
  let connectionString = configuredConnectionString;
  if (isProduction) {
    const databaseUrl = new URL(configuredConnectionString);
    for (const parameter of ["sslmode", "sslcert", "sslkey", "sslrootcert"]) {
      databaseUrl.searchParams.delete(parameter);
    }
    connectionString = databaseUrl.toString();
  }

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
