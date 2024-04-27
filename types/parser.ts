export type QrParseResult = {
  fn: string;
  fp: string;
  i: string;
  n: string;
  s: string;
  t: string;
};

export type GptParseResult = {
  address: string;
  card_number: string;
  date: string;
  fd: string;
  fp: string;
  income_expense: string;
  organisation_name: string;
  sum: string;
  tin: string;
};
