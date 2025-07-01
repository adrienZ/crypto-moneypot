import { defineEventHandler, readBody, createError } from "h3";
import { db } from "../../database/db";
import { pots } from "../../database/schemas";
import { ethers } from "ethers";
import blockchainService from "~~/server/lib/BlockchainService";

export default defineEventHandler(async (event) => {
  const moneypot = await db.query.pots.findFirst({
    where(pots, { eq }) {
      return eq(pots.id, event.context.params.id);
    },
  });

  const contributions = await db.query.contributions.findMany({
    where(contributions, { eq }) {
      return eq(contributions.potId, moneypot?.id);
    },
  });

  const rawAmount = contributions.reduce((total, contribution) => {
    return total + parseInt(contribution.amount);
  }, 0);

  const amount = ethers.formatEther(BigInt(rawAmount));

  console.log(
    ethers.formatEther(
      await blockchainService.provider.getBalance(moneypot?.walletAddress),
    ),
  );

  return {
    ...moneypot,
    amount,
  };
});
