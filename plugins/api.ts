import { $fetch, type FetchOptions } from "ofetch";

interface IApiInstance {}

export default defineNuxtPlugin((nuxtApp) => {
  const fetchOptions: FetchOptions = {
    baseURL: nuxtApp.$config.public.apiBaseUrl,
  };
  const fetcher = $fetch.create(fetchOptions);

  const modules: IApiInstance = {};
  return {
    provide: {
      api: modules,
    },
  };
});
