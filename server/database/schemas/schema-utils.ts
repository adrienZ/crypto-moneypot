import { timestamp } from "drizzle-orm/pg-core";

export const defaultDatesColumns = {
  createdAt: timestamp("created_at", { mode: "string" })
    .$defaultFn(() => /* @__PURE__ */ new Date().toISOString())
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" })
    .$defaultFn(() => /* @__PURE__ */ new Date().toISOString())
    .notNull(),
};
