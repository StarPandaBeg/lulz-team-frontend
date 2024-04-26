import { ClientConfig } from "pg";
import type { Connector } from "db0";
export type ConnectorOptions =
  | {
      url: string;
    }
  | ClientConfig;
export default function sqliteConnector(opts: ConnectorOptions): Connector;
