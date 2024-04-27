import { z } from "zod";
import { get_next_nonconfirmed_id } from "~/server/utils/database/transactions";

const paramSchema = z.object({
  id: z.coerce.number().gt(0),
});
const querySchema = z.object({
  skip: z.coerce.number(),
});

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, (data) =>
    paramSchema.parse(data)
  );
  const query = await getValidatedQuery(event, (data) =>
    querySchema.parse(data)
  );

  const db = useDatabase();
  return await get_next_nonconfirmed_id(db, params.id, query.skip);
});
