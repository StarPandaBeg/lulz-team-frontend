import type { FetchOptions } from "ofetch";
import HttpFactory from "../factory";
import type { Trip, TripExtended } from "~/types/trip";
import type { PaginatedResult } from "~/types/common/result";

export type GetParameterBag = {
  page: number;
  perPage: number;
};

class TripsModule extends HttpFactory {
  private Resource = "/trips";

  get(params: GetParameterBag) {
    const fetchOptions: FetchOptions<"json"> = {
      query: params,
    };
    return this.call<PaginatedResult<TripExtended>>(
      "GET",
      this.Resource,
      undefined,
      fetchOptions
    );
  }

  getById(id: number) {
    const resource = `${this.Resource}/${id}`;
    return this.call<Trip>("GET", resource);
  }

  nonConfirmed(id: number) {
    const resource = this.Resource + `/${id}/non_confirmed`;
    return this.call<number>("GET", resource);
  }
}

export default TripsModule;
