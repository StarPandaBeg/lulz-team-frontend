import { z } from "zod";
import { count_nonconfirmed_transactions_for } from "~/server/utils/database/transactions";

const paramSchema = z.object({
  id: z.coerce.number().gt(0),
});

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, (data) =>
    paramSchema.parse(data)
  );

  const db = useDatabase();
  return await count_nonconfirmed_transactions_for(db, params.id);
});
