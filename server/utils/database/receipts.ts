import { Receipt } from "~/types/receipt";

export async function get_receipt(
  db: ReturnType<typeof useDatabase>,
  id: number
) {
  const result = await db.sql`SELECT * FROM receipts WHERE id=${id}`;
  if (result.rows!.length == 0) {
    return createError({ statusCode: 404 });
  }
  return result.rows![0] as Receipt;
}

export async function edit_receipt(
  db: ReturnType<typeof useDatabase>,
  id: number,
  receipt: Receipt
) {
  await db.sql`INSERT INTO receipts (id,fp,fd,fn) VALUES (${id},${receipt.fp},${receipt.fd},${receipt.fn}) ON CONFLICT (id) DO UPDATE SET fp=${receipt.fp},fd=${receipt.fd},fn=${receipt.fn}`;
}
