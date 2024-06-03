import { z } from "zod";
import { QrParseResult } from "~/types/parser";

const paramSchema = z.object({
  id: z.coerce.number().gt(0),
});
const bodySchema = z.object({
  fn: z.string(),
  fp: z.string(),
  i: z.string(),
  n: z.string(),
  s: z.string(),
  t: z.string(),
});

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, (data) =>
    paramSchema.parse(data)
  );
  const query = await readValidatedBody(event, (data) =>
    bodySchema.parse(data)
  );

  const db = useDatabase();
  const transactions = await find_by_qr(db, query as QrParseResult, params.id);
  return transactions;
});
