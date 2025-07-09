import { defineTask } from "nitropack/runtime";
import { db } from "../../database/db";
import { user, pots } from "../../database/schemas";
import { Wallet } from "ethers";
import crypto from "node:crypto";

function getRandomIndex(array: unknown[]): number {
  return Math.floor(Math.random() * array.length);
}

export default defineTask({
  meta: {
    name: "db:seed",
    description: "Run database Seed",
  },
  async run({ payload, context }) {
    console.log("Running DB migration task...");
    const users = [
      {
        id: crypto.randomUUID(),
        name: "Alice Dupont",
        email: "alice@example.com",
      },
      { id: crypto.randomUUID(), name: "Bob Martin", email: "bob@example.com" },
      {
        id: crypto.randomUUID(),
        name: "Charlie Petit",
        email: "charlie@example.com",
      },
      {
        id: crypto.randomUUID(),
        name: "Diane Leroy",
        email: "diane@example.com",
      },
      {
        id: crypto.randomUUID(),
        name: "Eric Gauthier",
        email: "eric@example.com",
      },
    ];

    const moneyPotCategories = await db.query.potCategory.findMany();

    for (const u of users) {
      const [created] = await db.insert(user).values(u).returning();

      const titles = [
        `Voyage de ${u.name.split(" ")[0]}`,
        `Anniversaire de ${u.name.split(" ")[0]}`,
        `Projet caritatif de ${u.name.split(" ")[0]}`,
      ];

      for (const title of titles) {
        const wallet = Wallet.createRandom();
        const randomCategoryIndex = getRandomIndex(moneyPotCategories);
        await db.insert(pots).values({
          title,
          description: "description",
          coverImage:
            "https://images2.minutemediacdn.com/image/upload/c_fill,w_1200,ar_4:3,f_auto,q_auto,g_auto/shape/cover/sport/istock-508455188-033183f45ba393ed4745b2dd1213c390.jpg",
          categoryId: moneyPotCategories.at(randomCategoryIndex)!.id,
          creatorId: created!.id,
          walletAddress: wallet.address,
          walletPrivateKey: wallet.privateKey,
        });
      }
    }

    return { result: "Success" };
  },
});
