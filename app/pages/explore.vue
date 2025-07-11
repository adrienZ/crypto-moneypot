<template>
  <div>
    <div class="flex gap-4">
      <UInput v-model="search" placeholder="Search" class="w-64" />
      <USelect
        v-model="category"
        :options="categoryOptions"
        option-attribute="label"
        value-attribute="value"
        placeholder="Category"
        class="w-48"
      />
    </div>
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
    <UPagination
      v-model:page="pageAsInt"
      show-edges
      :items-per-page="pageSize"
      :total="visibleMoneypots?.total"
    />

  </div>
</template>


<script setup lang="ts">
import { useAsyncData } from "#app";
import { NuxtLink, UPagination, UInput, USelect } from "#components";
import { computed, watch } from "vue";
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
const paginationDedupeKey = computed(
  () => `moneypots-list-${page}-${search.value}-${category.value}`,
);

const search = useUrlParams("q");
const category = useUrlParams("category");

const { data: categories } = await useAsyncData(
  "moneypot-categories",
  () => $fetch("/api/pots/categories"),
);

const categoryOptions = computed(() =>
  categories.value?.map((c) => ({ label: c.slug, value: c.id })) ?? [],
);

watch([search, category], () => {
  pageAsInt.value = 1;
});

const { data: visibleMoneypots } = useAsyncData(
  paginationDedupeKey,
  () => {
    return $fetch("/api/pots/list", {
      query: {
        pageSize: pageSize,
        page: page.value,
        q: search.value,
        category: category.value,
      },
    });
  },
  {
    watch: [page, search, category],
  },
);
</script>