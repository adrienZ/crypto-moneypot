import { db } from "./db";
import { user, pots } from "./schemas";
import { Wallet } from "ethers";

async function seed() {
  const users = [
    { id: crypto.randomUUID(), name: "Alice Dupont", email: "alice@example.com" },
    { id: crypto.randomUUID(), name: "Bob Martin", email: "bob@example.com" },
    { id: crypto.randomUUID(), name: "Charlie Petit", email: "charlie@example.com" },
    { id: crypto.randomUUID(), name: "Diane Leroy", email: "diane@example.com" },
    { id: crypto.randomUUID(), name: "Eric Gauthier", email: "eric@example.com" },
  ];

  for (const u of users) {
    const [created] = await db.insert(user).values(u).returning();

    const titles = [
      `Voyage de ${u.name.split(" ")[0]}`,
      `Anniversaire de ${u.name.split(" ")[0]}`,
      `Projet caritatif de ${u.name.split(" ")[0]}`,
    ];

    for (const title of titles) {
      const wallet = Wallet.createRandom();
      await db.insert(pots).values({
        title,
        creatorId: created.id,
        walletAddress: wallet.address,
        walletPrivateKey: wallet.privateKey,
      });
    }
  }
}

seed()
  .then(() => {
    console.log("Seeding completed");
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
