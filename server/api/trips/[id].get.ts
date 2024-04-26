import { z } from "zod";
import { get_trip } from "~/server/utils/database/trips";

const paramSchema = z.object({
  id: z.coerce.number().gt(0),
});

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, (data) =>
    paramSchema.parse(data)
  );

  const db = useDatabase();
  return await get_trip(db, params.id);
});
