import { z } from "zod";
import { auth } from "../utils/database/auth";

const schema = z.object({
  email: z.string(),
  password: z.string(),
});

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, (data) => {
    return schema.parse(data);
  });
  const db = useDatabase();
  return auth(db, body.email, body.password);
});
