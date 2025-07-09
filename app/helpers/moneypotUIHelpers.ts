import { pots } from "~~/server/database/schemas";
import type { MoneypotCardProps } from "~/components/MoneypotCard.vue"

export function getUIPropsFromMoneypot(
  moneypot: typeof pots.$inferSelect,
): MoneypotCardProps {
  return {
    image: `/uploads/` + moneypot.coverImage,
    title: moneypot.title,
  };
}