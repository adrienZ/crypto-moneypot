import { defineEventHandler, readBody, createError } from "h3";
import { db } from "../../database/db";
import { contributions, pots } from "../../database/schemas";
import { auth } from "~~/server/lib/auth";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const potId = Number(event.context.params.id);
  const { amount, txHash } = await readBody<{ amount: string; txHash: string }>(event);

  if (!amount || !txHash) {
    throw createError({ statusCode: 400, statusMessage: "Missing amount or txHash" });
  }

  const session = await auth.api.getSession({ headers: event.headers });
  if (!session) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const exists = await db
    .select({ id: pots.id })
    .from(pots)
    .where(eq(pots.id, potId));
  if (exists.length === 0) {
    throw createError({ statusCode: 404, statusMessage: "Moneypot not found" });
  }

  const [contribution] = await db
    .insert(contributions)
    .values({ potId, contributorId: session.user.id, amount, txHash })
    .returning();

  return { contribution };
});
