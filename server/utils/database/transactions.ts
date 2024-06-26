import moment from "moment";
import { QrParseResult } from "~/types/parser";
import { ChartData, Transaction } from "~/types/transaction";
import { normalizeDate } from "~/util/util";

export async function get_transactions_for(
  db: ReturnType<typeof useDatabase>,
  id: number,
  page: number,
  perPage: number = 10
) {
  const result =
    await db.sql`SELECT * FROM get_paginated_transactions(${id}, ${page}, ${perPage})`;
  const rows = result.rows as Transaction[];

  return Promise.all(
    rows.map(async (row) => {
      row.creation_date = normalizeDate(row.creation_date);
      row.authorization_date = normalizeDate(row.authorization_date);
      row.transaction_date = normalizeDate(row.transaction_date);
      row.tax_document_date = normalizeDate(row.tax_document_date);
      return row;
    })
  );
}

export async function get_transactions_total_for(
  db: ReturnType<typeof useDatabase>,
  id: number
) {
  const result =
    await db.sql`SELECT COUNT(*) FROM transactions_view WHERE komandirovka_id=${id}`;
  // @ts-expect-error
  return parseInt(result.rows[0].count);
}

export async function get_transaction(
  db: ReturnType<typeof useDatabase>,
  id: number
) {
  const result = await db.sql`SELECT * FROM transactions WHERE id=${id}`;
  const row = result.rows![0] as Transaction;

  row.creation_date = normalizeDate(row.creation_date);
  row.authorization_date = normalizeDate(row.authorization_date);
  row.transaction_date = normalizeDate(row.transaction_date);
  row.tax_document_date = normalizeDate(row.tax_document_date);

  return row;
}

export async function count_nonconfirmed_transactions_for(
  db: ReturnType<typeof useDatabase>,
  id: number
) {
  const result = await db.sql`SELECT count_noncorfirmed_transactions(${id})`;
  // @ts-expect-error
  return parseInt(result.rows[0].count_noncorfirmed_transactions);
}

export async function get_next_nonconfirmed_id(
  db: ReturnType<typeof useDatabase>,
  id: number,
  skip: number
) {
  const result =
    await db.sql`SELECT id FROM transactions_view WHERE confirmation_status = 'fail' AND komandirovka_id=${id} AND id != ${skip} LIMIT 1`;
  if (result.rows!.length == 0) {
    return -1;
  }
  return result.rows![0].id;
}

export async function find_by_qr(
  db: ReturnType<typeof useDatabase>,
  qr: QrParseResult,
  id: number
) {
  const date = moment(qr.t).format("YYYY-MM-DD");
  const result =
    await db.sql`SELECT * FROM transactions_view WHERE amount_in_account_currency = ${qr.s} and authorization_date = ${date} and komandirovka_id=${id}`;
  const rows = result.rows as Transaction[];

  return Promise.all(
    rows.map(async (row) => {
      row.creation_date = normalizeDate(row.creation_date);
      row.authorization_date = normalizeDate(row.authorization_date);
      row.transaction_date = normalizeDate(row.transaction_date);
      row.tax_document_date = normalizeDate(row.tax_document_date);
      return row;
    })
  );
}

export async function edit_transaction(
  db: ReturnType<typeof useDatabase>,
  id: number,
  transaction: Transaction
) {
  await db.sql`UPDATE transactions
  SET 
    account_number = ${transaction.account_number},
    transaction_id = ${transaction.transaction_id},
    operation_type = ${transaction.operation_type},
    operation_category = ${transaction.operation_category},
    status = ${transaction.status},
    creation_date = ${
      transaction.creation_date ? transaction.creation_date : null
    },
    authorization_date = ${
      transaction.authorization_date ? transaction.authorization_date : null
    },
    transaction_date = ${
      transaction.transaction_date ? transaction.transaction_date : null
    },
    original_operation_id = ${transaction.original_operation_id},
    operation_amount_in_currency = ${transaction.operation_amount_in_currency},
    operation_currency = ${transaction.operation_currency},
    amount_in_account_currency = ${transaction.amount_in_account_currency},
    counterparty_account = ${transaction.counterparty_account},
    payment_purpose = ${transaction.payment_purpose},
    payment_number = ${transaction.payment_number},
    sequence = ${transaction.sequence},
    code = ${transaction.code},
    card_number = ${transaction.card_number},
    mcc = ${transaction.mcc},
    place_of_transaction_city = ${transaction.place_of_transaction_city},
    place_of_transaction_country = ${transaction.place_of_transaction_country},
    organization_address = ${transaction.organization_address},
    bank = ${transaction.bank},
    document_creator_status = ${transaction.document_creator_status},
    budget_classification_code = ${transaction.budget_classification_code},
    oktmo_code = ${transaction.oktmo_code},
    tax_payment_basis = ${transaction.tax_payment_basis},
    tax_period_customs_code = ${transaction.tax_period_customs_code},
    tax_document_number = ${transaction.tax_document_number},
    tax_document_date = ${
      transaction.tax_document_date
        ? `'${transaction.tax_document_date}'`
        : null
    },
    tax_payment_type = ${transaction.tax_payment_type},
    counterparty = ${transaction.counterparty},
    counterparty_inn = ${transaction.counterparty_inn},
    counterparty_kpp = ${transaction.counterparty_kpp},
    counterparty_bank_bik = ${transaction.counterparty_bank_bik},
    counterparty_bank_corr_account = ${
      transaction.counterparty_bank_corr_account
    },
    counterparty_bank_name = ${
      transaction.counterparty_bank_name
        ? transaction.counterparty_bank_name
        : null
    }
  WHERE id = ${id};`;
}

export async function get_chart_data(
  db: ReturnType<typeof useDatabase>,
  id: number
) {
  const result = await db.sql`SELECT authorization_date as date, 
  SUM(CASE WHEN operation_type = 'Debit' THEN round(CAST(amount_in_account_currency as numeric), 2) ELSE 0 END) as debit,
  SUM(CASE WHEN operation_type = 'Credit' THEN round(CAST(amount_in_account_currency as numeric), 2) ELSE 0 END) as credit 
  FROM transactions
  WHERE komandirovka_id = ${id}
  group by authorization_date
  order by date`;
  const rows = result.rows! as ChartData[];

  rows.forEach((r) => {
    r.date = moment(r.date).format("YYYY-MM-DD");

    // @ts-expect-error
    r.credit = parseFloat(r.credit);
    // @ts-expect-error
    r.debit = parseFloat(r.debit);
  });

  return rows;
}
