import { defineEventHandler, readBody, createError } from "h3";
import { db } from "../../database/db";
import { wallets } from "../../database/schemas";
import { auth } from "~~/server/lib/auth";

export default defineEventHandler(async (event) => {
  const { address } = await readBody<{ address: string }>(event);
  if (!address) {
    throw createError({ statusCode: 400, statusMessage: "Address missing" });
  }
  const session = await auth.api.getSession({ headers: event.headers });
  if (!session) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }
  const [wallet] = await db
    .insert(wallets)
    .values({ address, userId: session.user.id })
    .returning();
  return { wallet };
});
