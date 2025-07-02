import { pots } from "~~/server/database/schemas";
import type { MoneypotCardProps } from "~/components/MoneypotCard.vue"

// TODO: handle date to string conversion with drizzle types
export function getUIPropsFromMoneypot(moneypot: typeof pots.$inferSelect): MoneypotCardProps {
  return {
    image: "https://www.vacationer.travel/wp-content/uploads/2022/05/naboohed.jpg",
    title: moneypot.title
  }
}