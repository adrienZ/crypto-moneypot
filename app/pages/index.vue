<template>
  <div>
    <section class="bg-stone-700 px-6 py-10 text-5xl font-bold">
      <h1>Borderless Generosity with cryptos</h1>
      <div class="flex gap-2 mt-4">
        <UButton size="xl" color="secondary" to="/pots/list">Explore Moneypots</UButton>
        <UButton size="xl" color="primary" to="/pots/create">Create Moneypot</UButton>
      </div>
    </section>

    <div class="bg-slate-700 p-6" v-if="recentMoneypots">
      <ul class="grid grid-cols-5 gap-4">
        <li v-for="moneypot in recentMoneypots.pots" :key="moneypot.id">
          <NuxtLink :to="{
            name: 'pots-id',
            params: {
              id: moneypot.id
            }
          }">
            <MoneypotCard v-bind="getUIPropsFromMoneypot(moneypot)"></MoneypotCard>
          </NuxtLink>
        </li>
      </ul>
      <div class="mt-4 flex justify-center">
        <UButton size="xl" to="/pots/list">Show more pots</UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAsyncData } from "#app";
import { NuxtLink, UButton } from "#components";
import MoneypotCard from "~/components/MoneypotCard.vue";
import { getUIPropsFromMoneypot } from "~/helpers/moneypotUIHelpers";

const { data: recentMoneypots } = useAsyncData(
  "homepage-moneypots-list",
  () => {
    return $fetch("/api/pots/list", {
      query: {
        pageSize: 5,
      },
    });
  },
);
</script>