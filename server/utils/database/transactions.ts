import { Transaction } from "~/types/transaction";

export async function get_transactions_for(
  db: ReturnType<typeof useDatabase>,
  id: number,
  page: number,
  perPage: number = 10
) {
  const result =
    await db.sql`SELECT * FROM get_paginated_transactions(${id}, ${page}, ${perPage})`;
  const rows = result.rows as Transaction[];

  return Promise.all(
    rows.map(async (row) => {
      // const { date_start, date_end, ...data } = row;

      // ts-expect-error
      // data.date_start = moment(date_start).format("YYYY-MM-DD");
      // ts-expect-error
      // data.date_end = moment(date_end).format("YYYY-MM-DD");
      row.confirmation_status = "fail";

      return row;
    })
  );
}

export async function get_transactions_total_for(
  db: ReturnType<typeof useDatabase>,
  id: number
) {
  const result =
    await db.sql`SELECT COUNT(*) FROM transactions WHERE komandirovka_id=${id}`;
  // @ts-expect-error
  return parseInt(result.rows[0].count);
}
