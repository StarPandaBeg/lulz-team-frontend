import { useDatabase } from "../utils/database";
import { z } from "zod";
import { Trip } from "~/types/trip";

const schema = z.object({
  fio: z.string(),
  date_start: z.string(),
  date_end: z.string(),
});

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, (data) => {
    return schema.parse(data);
  });

  const db = useDatabase();
  const id = await create_trip(db, body as Trip);

  return await get_trip(db, id);
});
