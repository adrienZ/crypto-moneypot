import { defineEventHandler, readBody, createError } from "h3";
import { db } from "../../database/db";
import { contributions, pots } from "../../database/schemas";
import { auth } from "~~/server/lib/auth";
import { eq } from "drizzle-orm";
import { TransactionResponse } from "ethers";

export default defineEventHandler(async (event) => {
  const { transaction, potId } = await readBody<{
    transaction: TransactionResponse;
    potId: string;
  }>(event);

  const session = await auth.api.getSession({ headers: event.headers });
  if (!session) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const moneypotId = parseInt(potId);

  const exists = await db
    .select({ id: pots.id })
    .from(pots)
    .where(eq(pots.id, moneypotId));
  if (exists.length === 0) {
    throw createError({ statusCode: 404, statusMessage: "Moneypot not found" });
  }

  const { to, from, value, hash } = transaction;

  if (!to) {
    throw createError({ statusCode: 404, statusMessage: "Transaction destination not found" });
  }

  const [contribution] = await db
    .insert(contributions)
    .values({
      to,
      from,
      potId: moneypotId,
      contributorId: session.user.id,
      amount: value.toString(),
      txHash: hash,
    })
    .returning();

  return { contribution };
});
