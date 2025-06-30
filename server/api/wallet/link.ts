import { defineEventHandler, readBody, createError } from 'h3';
import { db } from '../database/db';
import { users } from '../database/schemas';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const { walletAddress } = await readBody<{ walletAddress: string }>(event);
  const session = event.context.user;
  if (!session) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }
  await db.update(users).set({ walletAddress }).where(eq(users.id, session.id));
  return { success: true };
});
