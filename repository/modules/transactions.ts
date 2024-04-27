import type { FetchOptions } from "ofetch";
import HttpFactory from "../factory";
import type { PaginatedResult, StatusResult } from "~/types/common/result";
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

  getById(tid: number, id: number) {
    const resource = this._getResource(id) + `/${tid}`;
    return this.call<Transaction>("GET", resource);
  }

  edit(transaction: Transaction, tid: number, id: number) {
    const resource = this._getResource(id) + `/${tid}`;
    return this.call<StatusResult>(
      "PUT",
      resource,
      JSON.stringify({ transaction })
    );
  }

  next(id: number, skip: number = -1) {
    const resource = this._getResource(id) + `/next`;
    const fetchOptions: FetchOptions<"json"> = {
      query: { skip },
    };
    return this.call<number>("GET", resource, undefined, fetchOptions);
  }

  private _getResource(id: number) {
    return this.Resource.replace("{id}", id.toString());
  }
}

export default TransactionsModule;
