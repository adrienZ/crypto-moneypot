import { pots } from "~~/server/database/schemas";
import type { MoneypotCardProps } from "~/components/MoneypotCard.vue"

export function getUIPropsFromMoneypot(moneypot: typeof pots.$inferSelect): MoneypotCardProps {
  return {
    image: "https://www.vacationer.travel/wp-content/uploads/2022/05/naboohed.jpg",
    title: moneypot.title
  }
}