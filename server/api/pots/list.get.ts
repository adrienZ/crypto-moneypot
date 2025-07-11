import { defineEventHandler, getQuery } from "h3";
import { db } from "../../database/db";
import { pots } from "../../database/schemas";

import { count, eq, ilike, and } from "drizzle-orm";
import fileUploadService from "~~/server/lib/FileUploadService";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const page = Number(query.page) > 0 ? Number(query.page) : 1;
  const pageSize = Number(query.pageSize) > 0 ? Number(query.pageSize) : 10;
  const offset = (page - 1) * pageSize;

  const search = typeof query.q === "string" ? query.q : undefined;
  const category = typeof query.category === "string" ? query.category : undefined;

  const whereFilter = (table: typeof pots) => {
    if (search && category) {
      return and(ilike(table.title, `%${search}%`), eq(table.categoryId, category));
    }
    if (search) {
      return ilike(table.title, `%${search}%`);
    }
    if (category) {
      return eq(table.categoryId, category);
    }
    return undefined;
  };

  // Get total count for pagination
  const total = await db
    .select({ count: count() })
    .from(pots)
    .where((table) => whereFilter(table));

  // Fetch paginated pots
  const items = await db.query.pots.findMany({
    limit: pageSize,
    offset,
    orderBy: (pots, { desc }) => [desc(pots.createdAt)],
    where(pots) {
      return whereFilter(pots);
    },
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
