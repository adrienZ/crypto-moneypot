import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createStorage } from "unstorage";
import fsDriver from "unstorage/drivers/fs";
import { db } from "../database/db";
import * as authSchemas from "../database/schemas/auth-schemas";

// const storage = createStorage({
//     driver: fsDriver({ base: "./.data" }),
// });

const drizzleDbAdapter = drizzleAdapter(db, {
  provider: "pg", // or "mysql", "sqlite"
  schema: {
    ...authSchemas,
  },
});

export const auth = betterAuth({
  database: drizzleDbAdapter,
  // secondaryStorage: {
  //     get: key => storage.getItemRaw(`_auth:${key}`),
  //     set: (key, value, ttl) => {
  //         return storage.set(`_auth:${key}`, value, { ttl })
  //     },
  //     delete: key => storage.del(`_auth:${key}`),
  // },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  emailAndPassword: {
    enabled: true,
  },
});
