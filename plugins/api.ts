import { $fetch, type FetchOptions } from "ofetch";
import TransactionsModule from "~/repository/modules/transactions";
import TripsModule from "~/repository/modules/trips";

interface IApiInstance {
  trips: TripsModule;
  transactions: TransactionsModule;
}

export default defineNuxtPlugin((nuxtApp) => {
  const fetchOptions: FetchOptions = {
    baseURL: nuxtApp.$config.public.apiBaseUrl,
  };
  const fetcher = $fetch.create(fetchOptions);

  const modules: IApiInstance = {
    trips: new TripsModule(fetcher),
    transactions: new TransactionsModule(fetcher),
  };
  return {
    provide: {
      api: modules,
    },
  };
});
