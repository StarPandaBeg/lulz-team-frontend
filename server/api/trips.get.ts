import { useDatabase } from "../utils/database";
import { PaginatedResult } from "~/types/common/result";
import { z } from "zod";
import { get_trips, get_trips_total } from "../utils/database/trips";
import { Trip } from "~/types/trip";

const schema = z.object({
  page: z.coerce.number().gt(0).default(1),
  perPage: z.coerce.number().gt(0).default(10),
});

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, (data) => {
    return schema.parse(data);
  });

  const db = useDatabase();
  const trips = await get_trips(db, query.page, query.perPage);
  const total = await get_trips_total(db);

  return <PaginatedResult<Trip>>{
    data: trips,
    current: query.page,
    perPage: query.perPage,
    total,
  };
});
