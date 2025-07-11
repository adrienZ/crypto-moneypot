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

  const whereFilter = () => {
    if (search && category) {
      return and(ilike(pots.title, `%${search}%`), eq(pots.categoryId, category));
    }
    if (search) {
      return ilike(pots.title, `%${search}%`);
    }
    if (category) {
      return eq(pots.categoryId, category);
    }
    return undefined;
  };

  // Get total count for pagination
  let totalQuery = db.select({ count: count() }).from(pots);
  const filter = whereFilter();
  if (filter) {
    totalQuery = totalQuery.where(filter);
  }
  const total = await totalQuery;

  // Fetch paginated pots
  const items = await db.query.pots.findMany({
    limit: pageSize,
    offset,
    orderBy: (pots, { desc }) => [desc(pots.createdAt)],
    ...(filter
      ? {
          where() {
            return filter;
          },
        }
      : {}),
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
