import { defineEventHandler, readBody, createError } from "h3";
import { db } from "../../database/db";
import { pots } from "../../database/schemas";
import { Wallet } from "ethers";
import { auth } from "~~/server/lib/auth";

export default defineEventHandler(async (event) => {
  const { title } = await readBody<{ title: string }>(event);

  const session = await auth.api.getSession({
    headers: event.headers,
  });
  if (!session) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }
  const wallet = Wallet.createRandom();
  const [pot] = await db
    .insert(pots)
    .values({
      title,
      creatorId: session.user.id,
      walletAddress: wallet.address,
      walletPrivateKey: wallet.privateKey,
    })
    .returning();
  return { pot };
});
