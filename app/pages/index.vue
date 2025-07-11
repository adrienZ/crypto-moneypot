<template>
  <div>
    <div class="md:flex gap-8 sticky mt-10 top-0">
      <section class="px-6 py-10 font-bold md:w-5/12">
        <h1 class="text-7xl">{{ $t('home.hero') }}</h1>
        <div class="flex gap-2 mt-8">
          <UButton size="xl" color="secondary" to="/explore">{{ $t('home.explore') }}</UButton>
          <UButton size="xl" color="primary" to="/pots/create">{{ $t('home.create') }}</UButton>
        </div>
      </section>

      <div class="md:w-7/12 aspect-[1/1]">
        <LazyClientOnly>
          <Globe class="h-full" />
        </LazyClientOnly>
      </div>
    </div>

    <div class="relative bg-default">
      <div class="bg-slate-700 p-6" v-if="recentMoneypots">
        <ul class="grid grid-cols-5 gap-4">
          <li class="h-full" v-for="moneypot in recentMoneypots.pots" :key="moneypot.id">
            <NuxtLinkLocale :to="{
              name: 'pots-id',
              params: {
                id: moneypot.id
              }
            }" class="h-full">
              <MoneypotCard class="h-full" v-bind="getUIPropsFromMoneypot(moneypot)"></MoneypotCard>
            </NuxtLinkLocale>
          </li>
        </ul>

        <div class="mt-4 flex justify-center">
          <UButton size="xl" to="/explore">{{ $t('home.showMore') }}</UButton>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useAsyncData } from "#app";
import { NuxtLinkLocale, UButton } from "#components";
import Globe from "~/components/Globe.vue";
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