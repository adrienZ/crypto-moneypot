import { defineEventHandler, readBody, createError } from "h3";
import { db } from "../../database/db";
import { pots } from "../../database/schemas";
import { auth } from "~~/server/lib/auth";

export default defineEventHandler(async (event) => {
  return db.query.pots.findFirst({
    where(pots, { eq }) {
      return eq(pots.id, event.context.params.id);
    },
  });
});
