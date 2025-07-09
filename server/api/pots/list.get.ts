import { defineEventHandler, getQuery } from "h3";
import { db } from "../../database/db";
import { pots } from "../../database/schemas";

import { ethers } from "ethers";
import { count } from "drizzle-orm";
import fileUploadService from "~~/server/lib/FileUploadService";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const page = Number(query.page) > 0 ? Number(query.page) : 1;
  const pageSize = Number(query.pageSize) > 0 ? Number(query.pageSize) : 10;
  const offset = (page - 1) * pageSize;

  // Get total count for pagination
  const total = await db.select({ count: count() }).from(pots);

  // Fetch paginated pots
  const items = await db.query.pots.findMany({
    limit: pageSize,
    offset,
    orderBy: (pots, { desc }) => [desc(pots.createdAt)],
  });

  const itemsWithCoverImage = items.map((item) => ({
    ...item,
    coverImage: fileUploadService.getUrl(item.coverImage),
  }));

  return {
    page,
    pageSize,
    total: total.reduce((acc, curr) => acc + (curr.count || 0), 0),
    pots: itemsWithCoverImage,
  };
});
