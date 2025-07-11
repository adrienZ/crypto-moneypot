<template>
  <div>
    <div class="background bg-neutral-700">
      <div class="max-w-2xl mx-auto">
        <h1 class="text-3xl font-bold pt-4">Explore Moneypots</h1>
        <p class="mt-2">Discover and contribute to moneypots created by others.</p>
        <ExploreFilterForm v-model:search="localSearch" v-model:category="localCategory"
          :category-options="categoryOptions" @submit="applyFilters" class="py-4" />
      </div>
    </div>

    <div v-if="visibleMoneypots">
      <div v-if="visibleMoneypots.pots.length === 0">no results</div>
      <ul v-else class="grid grid-cols-5 gap-4 mt-8">
        <li v-for="moneypot in visibleMoneypots.pots" :key="moneypot.id">
          <NuxtLinkLocale :to="{
            name: 'pots-id',
            params: {
              id: moneypot.id
            }
          }">
            <MoneypotCard v-bind="getUIPropsFromMoneypot(moneypot)" class=""></MoneypotCard>
          </NuxtLinkLocale>
        </li>
      </ul>
    </div>


    <UPagination class="my-6" v-model:page="pageAsInt" show-edges :items-per-page="pageSize"
      :total="visibleMoneypots?.total" />
  </div>
</template>


<script setup lang="ts">
import { useAsyncData } from "#app";
import { NuxtLinkLocale, UPagination } from "#components";
import { computed, watch, ref } from "vue";
import MoneypotCard from "~/components/MoneypotCard.vue";
import ExploreFilterForm from "~/components/ExploreFilterForm.vue";

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

const localSearch = ref(search.value);
const localCategory = ref(category.value);

const applyFilters = () => {
  search.value = localSearch.value;
  category.value = localCategory.value;
};

const { data: categories } = await useAsyncData(
  "moneypot-categories-explore",
  () => $fetch("/api/pots/categories"),
  {
    default: () => ([]),
  }
);

const categoryOptions = computed(() => categories.value.map((c) => ({ label: c.slug, value: c.id })));

watch([search, category], () => {
  pageAsInt.value = 1;
});

watch(search, () => {
  localSearch.value = search.value;
});

watch(category, () => {
  localCategory.value = category.value;
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