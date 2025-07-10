import { defineEventHandler, readBody, createError } from "h3";
import { db } from "../../database/db";
import { ethers } from "ethers";
import fileUploadService from "~~/server/lib/FileUploadService";

export default defineEventHandler(async (event) => {
  const moneypotId = event.context.params?.id;

  if (!moneypotId || typeof moneypotId !== "string") {
    throw createError({ statusCode: 404, statusMessage: "Not foudn" });
  }

  const moneypot = await db.query.pots.findFirst({
    where(pots, { eq }) {
      return eq(pots.id, Number(moneypotId));
    },
  });

  const contributions = await db.query.contributions.findMany({
    where(contributions, { eq }) {
      return eq(contributions.potId, Number(moneypot?.id));
    },
  });

  const rawAmount = contributions.reduce((total, contribution) => {
    return total + parseInt(contribution.amount);
  }, 0);

  if (!moneypot) {
    return undefined;
  }

  const coverImage = fileUploadService.getUrl(moneypot.coverImage);

  return {
    ...moneypot,
    amount: rawAmount,
    coverImage,
  };
});
