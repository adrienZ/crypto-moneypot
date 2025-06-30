import { defineEventHandler, readBody, createError } from 'h3';
import { db } from '../../../database/db';
import { contributions } from '../../../database/schemas';

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id);
  const { amount, txHash } = await readBody<{ amount: string; txHash: string }>(event);
  const session = event.context.user;
  if (!session) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid id' });
  }
  const [contribution] = await db
    .insert(contributions)
    .values({ potId: id, contributorId: session.id, amount, txHash })
    .returning();
  return { contribution };
});
