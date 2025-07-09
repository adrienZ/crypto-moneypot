import { defineEventHandler } from "h3";
import { db } from "../../database/db";
import { potCategory } from "../../database/schemas";

export default defineEventHandler(async (event) => {
  return await db.select().from(potCategory);
});
