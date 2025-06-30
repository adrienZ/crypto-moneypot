import { defineEventHandler, createError } from "h3";
import { db } from "../database/db";
import { user, session as sessionTable, pots } from "../database/schemas";
import { auth } from "~~/server/lib/auth";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const currentSession = await auth.api.getSession({ headers: event.headers });
  if (!currentSession) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const [profile] = await db
    .select()
    .from(user)
    .where(eq(user.id, currentSession.user.id));

  const sessions = await db
    .select()
    .from(sessionTable)
    .where(eq(sessionTable.userId, currentSession.user.id));

  const potsList = await db
    .select()
    .from(pots)
    .where(eq(pots.creatorId, currentSession.user.id));

  return {
    user: profile,
    sessions,
    pots: potsList,
  };
});
