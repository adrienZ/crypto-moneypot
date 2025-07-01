import { defineEventHandler } from "h3";
import { db } from "../../database/db";
import { pots, contributions } from "../../database/schemas";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const potId = Number(event.context.params.id);

  const pot = await db.query.pots.findFirst({
    where(pots, { eq }) {
      return eq(pots.id, potId);
    },
  });

  if (!pot) return null;

  const potContributions = await db
    .select()
    .from(contributions)
    .where(eq(contributions.potId, potId));

  return { pot, contributions: potContributions };
});
