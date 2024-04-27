import { z } from "zod";

const paramSchema = z.object({
  id: z.coerce.number().gt(0),
});

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, (data) =>
    paramSchema.parse(data)
  );

  const db = useDatabase();
  return get_chart_data(db, params.id);
});
