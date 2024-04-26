import HttpFactory from "../factory";
import type { Receipt } from "~/types/receipt";

class ReceiptsModule extends HttpFactory {
  private Resource = "/receipts";

  get(id: number) {
    const resource = `${this.Resource}/${id}`;
    return this.call<Receipt>("GET", resource);
  }
}

export default ReceiptsModule;
