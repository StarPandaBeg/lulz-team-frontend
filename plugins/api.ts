import { $fetch, type FetchOptions } from "ofetch";
import AuthModule from "~/repository/modules/auth";
import CounterpartiesModule from "~/repository/modules/counterparties";
import CurrenciesModule from "~/repository/modules/currencies";
import ParserModule from "~/repository/modules/parser";
import ReceiptsModule from "~/repository/modules/receipts";
import TransactionsModule from "~/repository/modules/transactions";
import TripsModule from "~/repository/modules/trips";

interface IApiInstance {
  auth: AuthModule;
  trips: TripsModule;
  transactions: TransactionsModule;
  currencies: CurrenciesModule;
  counterparties: CounterpartiesModule;
  receipts: ReceiptsModule;
  parser: ParserModule;
}

export default defineNuxtPlugin((nuxtApp) => {
  const fetchOptions: FetchOptions = {
    baseURL: nuxtApp.$config.public.apiBaseUrl,
  };
  const fetcher = $fetch.create(fetchOptions);

  const modules: IApiInstance = {
    auth: new AuthModule(fetcher),
    trips: new TripsModule(fetcher),
    transactions: new TransactionsModule(fetcher),
    currencies: new CurrenciesModule(fetcher),
    counterparties: new CounterpartiesModule(fetcher),
    receipts: new ReceiptsModule(fetcher),
    parser: new ParserModule(fetcher),
  };
  return {
    provide: {
      api: modules,
    },
  };
});
