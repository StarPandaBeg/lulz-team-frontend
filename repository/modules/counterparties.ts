import type { Counterparty } from "~/types/transaction";
import HttpFactory from "../factory";

class CounterpartiesModule extends HttpFactory {
  private Resource = "/counterparties";

  find(inn: string) {
    const resource = `${this.Resource}/${inn}`;
    return this.call<Counterparty>("GET", resource);
  }
}

export default CounterpartiesModule;
