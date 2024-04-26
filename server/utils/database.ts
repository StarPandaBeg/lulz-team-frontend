import { createDatabase } from "db0";
import postgresql from "./connector/database-connector";

export function useDatabase() {
  const config = useRuntimeConfig();
  const db = createDatabase(
    postgresql({
      url: config.postgresConnectionUrl,
    })
  );

  return db;
}
