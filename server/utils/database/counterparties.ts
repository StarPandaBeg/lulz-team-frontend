import { Counterparty } from "~/types/transaction";

export async function find_counterparty_by_inn(
  db: ReturnType<typeof useDatabase>,
  inn: string
) {
  const result =
    await db.sql`SELECT * FROM counterparties WHERE counterparty_inn=${inn} LIMIT 1`;
  if (result.rows!.length == 0) {
    return createError({ statusCode: 404 });
  }
  return result.rows![0] as Counterparty;
}
