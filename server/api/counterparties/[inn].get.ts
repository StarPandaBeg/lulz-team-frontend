import { z } from "zod";

const paramSchema = z.object({
  inn: z.string(),
});

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, (data) =>
    paramSchema.parse(data)
  );

  const db = useDatabase();
  return await find_counterparty_by_inn(db, params.inn);
});
