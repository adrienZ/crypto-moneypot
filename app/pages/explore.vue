<template>
  <div>
    <ul v-if="visibleMoneypots" class="grid grid-cols-5 gap-4 mt-8">
      <li v-for="moneypot in visibleMoneypots.pots" :key="moneypot.id">
        <NuxtLink :to="{
          name: 'pots-id',
          params: {
            id: moneypot.id
          }
        }">
          <MoneypotCard v-bind="getUIPropsFromMoneypot(moneypot)" class=""></MoneypotCard>
        </NuxtLink>
      </li>
    </ul>
    <UPagination v-model:page="pageAsInt" show-edges :items-per-page="pageSize" :total="visibleMoneypots?.total" />

  </div>
</template>


<script setup lang="ts">
import { useAsyncData } from "#app";
import { NuxtLink, UPagination } from "#components";
import { computed } from "vue";
import MoneypotCard from "~/components/MoneypotCard.vue";
import { useUrlParams } from "~/composables/useUrlParams";
import { getUIPropsFromMoneypot } from "~/helpers/moneypotUIHelpers";

const page = useUrlParams("page");
const pageAsInt = computed({
  get: () => parseInt(page.value) || 1,
  set: (value: number) => {
    page.value = value.toString();
  },
});

const pageSize = 10;
const paginationDedupeKey = computed(() => `moneypots-list-${page}`);

const { data: visibleMoneypots } = useAsyncData(
  paginationDedupeKey,
  () => {
    return $fetch("/api/pots/list", {
      query: {
        pageSize: pageSize,
        page: page.value,
      },
    });
  },
  {
    watch: [page],
  },
);
</script>