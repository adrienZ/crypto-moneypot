import { defineEventHandler } from "h3";
import blockchainService from "~~/server/lib/BlockchainService";

export default defineEventHandler(async () => {
  const wallets = await blockchainService.listWallets();
  return { wallets };
});
