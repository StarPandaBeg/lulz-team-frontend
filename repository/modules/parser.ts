import type { QrParseResult } from "~/types/parser";
import HttpFactory from "../factory";
import type { StatusResult } from "~/types/common/result";

class ParserModule extends HttpFactory {
  private Resource = "/parser";

  qr(file: File) {
    const resource = `${this.Resource}/qr`;
    const data = new FormData();
    data.append("file", file);
    return this.call<QrParseResult>("POST", resource, data);
  }

  uploadTrip(file: File, kid: number) {
    const resource = `${this.Resource}/add_new_komandirovaniy`;

    const data = new FormData();
    data.append("id", kid.toString());
    data.append("file", file);

    return this.call<StatusResult>("POST", resource, data);
  }
}

export default ParserModule;
