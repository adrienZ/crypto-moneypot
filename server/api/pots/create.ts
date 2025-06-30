import { defineEventHandler, readBody, createError } from 'h3';
import { db } from '../../database/db';
import { pots } from '../../database/schemas';

export default defineEventHandler(async (event) => {
  const { title } = await readBody<{ title: string }>(event);
  const session = event.context.user;
  if (!session) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }
  const [pot] = await db
    .insert(pots)
    .values({ title, creatorId: session.id })
    .returning();
  return { pot };
});
