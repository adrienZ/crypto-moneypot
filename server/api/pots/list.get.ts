import { defineEventHandler, getQuery } from "h3";
import { db } from "../../database/db";
import { pots } from "../../database/schemas";

import { ethers } from "ethers";
import { count } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const page = Number(query.page) > 0 ? Number(query.page) : 1;
  const pageSize = Number(query.pageSize) > 0 ? Number(query.pageSize) : 10;
  const offset = (page - 1) * pageSize;

  // Get total count for pagination
  const total = await db.select({ value: count() }).from(pots);

  // Fetch paginated pots
  const items = await db.query.pots.findMany({
    limit: pageSize,
    offset,
    orderBy: (pots, { desc }) => [desc(pots.createdAt)],
  });

  return {
    page,
    pageSize,
    total,
    pots: items,
  };
});
