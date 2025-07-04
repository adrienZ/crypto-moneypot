import { defineEventHandler, readBody, createError } from "h3";
import { db } from "../../database/db";
import { pots } from "../../database/schemas";
import { auth } from "~~/server/lib/auth";
import { Wallet } from "ethers";
import blockchainService from "~~/server/lib/BlockchainService";
import * as z from "zod/v4";

const routeSchema = z.object({
  title: z.string().min(1),
});

export default defineEventHandler(async (event) => {
  const { title } = routeSchema.parse(await readBody<{ title: string }>(event));

  const session = await auth.api.getSession({
    headers: event.headers,
  });
  if (!session) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const wallet = Wallet.createRandom(blockchainService.provider);

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
