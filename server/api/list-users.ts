import { db } from "../database/db"
import { user } from "../database/schemas"
import { defineEventHandler } from "h3"
import { defineRouteMeta } from "nitropack/runtime"

defineRouteMeta({
  openAPI: {
    description: 'Test route description',
    parameters: [{ in: "query", name: "test", required: true }],
  },
});

export default defineEventHandler(async (event) => {
  return await db.select().from(user);
})
