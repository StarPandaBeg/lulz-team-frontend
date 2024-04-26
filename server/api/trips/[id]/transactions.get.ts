import { z } from "zod";
import { get_transactions_total_for } from "~/server/utils/database/transactions";
import { PaginatedResult } from "~/types/common/result";
import { Transaction } from "~/types/transaction";

const paramSchema = z.object({
  id: z.coerce.number().gt(0),
});
const querySchema = z.object({
  page: z.coerce.number().gt(0).default(1),
  perPage: z.coerce.number().gt(0).default(10),
});

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, (data) =>
    paramSchema.parse(data)
  );
  const query = await getValidatedQuery(event, (data) =>
    querySchema.parse(data)
  );

  const db = useDatabase();
  const transactions = await get_transactions_for(
    db,
    params.id,
    query.page,
    query.perPage
  );
  const total = await get_transactions_total_for(db, params.id);

  return <PaginatedResult<Transaction>>{
    data: transactions,
    current: query.page,
    perPage: query.perPage,
    total,
  };
});
