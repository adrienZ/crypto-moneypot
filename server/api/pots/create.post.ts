import { defineEventHandler, readFormData, createError } from "h3";
import { db } from "../../database/db";
import { pots } from "../../database/schemas";
import { auth } from "~~/server/lib/auth";
import { Wallet } from "ethers";
import blockchainService from "~~/server/lib/BlockchainService";
import * as z from "zod/v4";
import fileUploadService from "~~/server/lib/FileUploadService";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"];
const MIN_WIDTH = 350;
const MIN_HEIGHT = 255;

const routeSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  categoryId: z.string().min(1),
  targetAmount: z.coerce.number().optional(),
  coverImage: z
    .instanceof(File)
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      "Image must be smaller than 10MB",
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Accepted formats are .jpg, .jpeg, and .png",
    ),
});

export default defineEventHandler(async (event) => {
  const formData = await readFormData(event);

  const { title, categoryId, description, targetAmount, coverImage } =
    routeSchema.parse(Object.fromEntries(formData));

  const session = await auth.api.getSession({
    headers: event.headers,
  });
  if (!session) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const wallet = Wallet.createRandom(blockchainService.provider);

  const arrayBuffer = await coverImage.arrayBuffer();
  const imageKey = await fileUploadService.save(
    `${coverImage.name}`,
    Buffer.from(arrayBuffer),
  );

  const [pot] = await db
    .insert(pots)
    .values({
      title,
      categoryId,
      description,
      targetAmount: targetAmount ? targetAmount : undefined,
      creatorId: session.user.id,
      walletAddress: wallet.address,
      walletPrivateKey: wallet.privateKey,
      coverImage: imageKey,
    })
    .returning();
  return { pot };
});
