import { z } from "zod";
import { edit_receipt } from "~/server/utils/database/receipts";
import { StatusResult } from "~/types/common/result";
import { Receipt } from "~/types/receipt";

const receipt = z.object({
  id: z.coerce.number(),
  fd: z.string(),
  fp: z.string(),
  fn: z.string(),
});

const paramSchema = z.object({
  id: z.coerce.number().gt(0),
});
const bodySchema = z.object({
  receipt,
});

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, (data) =>
    paramSchema.parse(data)
  );
  const body = await readValidatedBody(event, (data) => bodySchema.parse(data));

  const db = useDatabase();
  await edit_receipt(db, params.id, body.receipt as Receipt);

  return <StatusResult>{
    ok: true,
  };
});
