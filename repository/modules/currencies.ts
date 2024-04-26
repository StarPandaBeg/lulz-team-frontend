import type { Currency } from "~/types/currency";
import HttpFactory from "../factory";

class CurrenciesModule extends HttpFactory {
  list() {
    return new Promise<Currency[]>((resolve) => {
      resolve([
        {
          id: "643",
          code: "RUB",
        },
      ]);
    });
  }
}

export default CurrenciesModule;
