import { Trip } from "~/types/trip";
import { useDatabase } from "../database";
import { normalizeDate } from "~/util/util";

export async function get_trips(
  db: ReturnType<typeof useDatabase>,
  page: number,
  perPage: number = 10
) {
  const result =
    await db.sql`SELECT * FROM get_paginated_trips(${page}, ${perPage})`;
  const rows = result.rows as Trip[];

  return Promise.all(
    rows.map(async (row) => {
      row.date_start = normalizeDate(row.date_start.toString())!;
      row.date_end = normalizeDate(row.date_end.toString())!;

      return row as Trip;
    })
  );
}

export async function get_trips_total(db: ReturnType<typeof useDatabase>) {
  const result = await db.sql`SELECT COUNT(*) FROM komandirovki`;
  // @ts-expect-error
  return parseInt(result.rows[0].count);
}

export async function get_trip(db: ReturnType<typeof useDatabase>, id: number) {
  const result = await db.sql`SELECT * FROM komandirovki WHERE id=${id}`;
  return result.rows![0] as Trip;
}
