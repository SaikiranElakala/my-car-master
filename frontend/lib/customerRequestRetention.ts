import { bookingPool } from "@/lib/bookingDb";

const REQUEST_RETENTION_INTERVAL = "1 year";

/** Permanently removes customer requests past the agreed one-year retention period. */
export async function deleteExpiredCustomerRequests() {
  const result = await bookingPool().query(
    `DELETE FROM customer_requests
     WHERE created_at < NOW() - $1::interval`,
    [REQUEST_RETENTION_INTERVAL],
  );

  return { deleted: result.rowCount ?? 0 };
}
