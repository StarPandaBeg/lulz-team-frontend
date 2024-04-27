import { verify } from "@node-rs/argon2";

export async function auth(
  db: ReturnType<typeof useDatabase>,
  email: string,
  password: string
) {
  const result = await db.sql`SELECT * FROM users WHERE email=${email} LIMIT 1`;
  if (result.rows!.length == 0) {
    throw createError({ statusCode: 401 });
  }
  const user = result.rows![0] as { id: number; password: string };
  if (!verify(user.password, password)) {
    throw createError({ statusCode: 401 });
  }
  return user.id;
}
