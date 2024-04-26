import { $fetch, type FetchOptions } from "ofetch";
import TripsModule from "~/repository/modules/trips";

interface IApiInstance {
  trips: TripsModule;
}

export default defineNuxtPlugin((nuxtApp) => {
  const fetchOptions: FetchOptions = {
    baseURL: nuxtApp.$config.public.apiBaseUrl,
  };
  const fetcher = $fetch.create(fetchOptions);

  const modules: IApiInstance = {
    trips: new TripsModule(fetcher),
  };
  return {
    provide: {
      api: modules,
    },
  };
});
