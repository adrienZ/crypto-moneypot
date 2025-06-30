import { defineEventHandler, createError } from 'h3';
import { db } from '../../database/db';
import { pots, contributions } from '../../database/schemas';
import { eq, sum } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id);
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid id' });
  }
  const pot = await db.query.pots.findFirst({ where: eq(pots.id, id) });
  if (!pot) {
    throw createError({ statusCode: 404, statusMessage: 'Not found' });
  }
  const totalResult = await db
    .select({ total: sum(contributions.amount) })
    .from(contributions)
    .where(eq(contributions.potId, id));
  const total = totalResult[0]?.total || '0';
  return { pot: { ...pot, amount: total } };
});
