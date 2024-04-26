import { z } from "zod";
import { edit_transaction } from "~/server/utils/database/transactions";
import { StatusResult } from "~/types/common/result";
import { Transaction } from "~/types/transaction";

const transaction = z.object({
  id: z.number(),
  komandirovka_id: z.number(),
  account_number: z.string(),
  transaction_id: z.string(),
  operation_type: z.enum(["Debit", "Credit"]),
  operation_category: z.string(),
  status: z.string(),
  creation_date: z.coerce.date().nullable(),
  authorization_date: z
    .string()
    .nullable()
    .optional()
    .transform((val) => new Date(val)),
  transaction_date: z
    .string()
    .nullable()
    .optional()
    .transform((val) => new Date(val)),
  original_operation_id: z.string(),
  operation_amount_in_currency: z.string(),
  operation_currency: z.string(),
  amount_in_account_currency: z.string(),
  counterparty_account: z.string(),
  payment_purpose: z.string(),
  payment_number: z.string(),
  sequence: z.string(),
  code: z.string(),
  card_number: z.string(),
  mcc: z.string(),
  place_of_transaction_city: z.string(),
  place_of_transaction_country: z.string(),
  organization_address: z.string(),
  bank: z.string(),
  document_creator_status: z.string(),
  budget_classification_code: z.string(),
  oktmo_code: z.string(),
  tax_payment_basis: z.string(),
  tax_period_customs_code: z.string(),
  tax_document_number: z.string(),
  tax_document_date: z
    .string()
    .nullable()
    .optional()
    .transform((val) => new Date(val)),
  tax_payment_type: z.string(),
  counterparty: z.string(),
  counterparty_inn: z.string(),
  counterparty_kpp: z.string(),
  counterparty_bank_bik: z.string(),
  counterparty_bank_corr_account: z.string(),
  counterparty_bank_name: z.string().nullable(),
});

const paramSchema = z.object({
  id: z.coerce.number().gt(0),
  tid: z.coerce.number().gt(0),
});
const bodySchema = z.object({
  transaction,
});

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, (data) =>
    paramSchema.parse(data)
  );
  const body = await readValidatedBody(event, (data) => bodySchema.parse(data));

  const db = useDatabase();
  await edit_transaction(db, params.id, body.transaction as Transaction);

  return <StatusResult>{
    ok: true,
  };
});
