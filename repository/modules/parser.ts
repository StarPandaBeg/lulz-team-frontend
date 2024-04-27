import type { QrParseResult } from "~/types/parser";
import HttpFactory from "../factory";

class ParserModule extends HttpFactory {
  private Resource = "/parser";

  qr(file: File) {
    const resource = `${this.Resource}/qr`;
    const data = new FormData();
    data.append("file", file);
    return this.call<QrParseResult>("POST", resource, data);
  }
}

export default ParserModule;
