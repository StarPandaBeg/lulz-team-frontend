import type { $Fetch, FetchOptions } from "ofetch";

class HttpFactory {
  private $fetch: $Fetch;

  constructor(fetcher: $Fetch) {
    this.$fetch = fetcher;
  }

  async call<T>(
    method: string,
    url: string,
    data?: object | string,
    fetchOptions?: FetchOptions<"json">
  ): Promise<T> {
    return this.$fetch<T>(url, {
      method,
      body: data,
      ...fetchOptions,
    });
  }

  asyncData<T extends HttpFactory>(this: T) {
    const handler = {
      get: function (target: T, prop: keyof HttpFactory, receiver: any): any {
        if (!(target[prop] instanceof Function)) return target[prop];

        const f: Function = target[prop];
        return async function () {
          const { data } = await useAsyncData(async () => {
            return await f.apply(target, arguments);
          });
          return data;
        };
      },
    };
    return new Proxy(this, handler);
  }
}

export default HttpFactory;
