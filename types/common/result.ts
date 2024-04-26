export type PaginatedResult<T> = {
  data: T[];
  current: number;
  total: number;
  perPage: number;
};

export type StatusResult = {
  ok: boolean;
};
