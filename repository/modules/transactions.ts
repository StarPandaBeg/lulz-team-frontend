import type { FetchOptions } from "ofetch";
import HttpFactory from "../factory";
import type { PaginatedResult } from "~/types/common/result";
import type { Transaction } from "~/types/transaction";

export type GetParameterBag = {
  page: number;
  perPage: number;
};

class TransactionsModule extends HttpFactory {
  private Resource = "/trips/{id}/transactions";

  get(id: number, params: GetParameterBag) {
    const fetchOptions: FetchOptions<"json"> = {
      query: params,
    };
    return this.call<PaginatedResult<Transaction>>(
      "GET",
      this._getResource(id),
      undefined,
      fetchOptions
    );
  }

  private _getResource(id: number) {
    return this.Resource.replace("{id}", id.toString());
  }
}

export default TransactionsModule;
