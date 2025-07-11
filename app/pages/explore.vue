<template>
  <div>
    <div class="flex items-end gap-4">
      <UInput v-model="localSearch" placeholder="Search" class="w-64" />
      <USelect
        v-model="localCategory"
        :options="categoryOptions"
        option-attribute="label"
        value-attribute="value"
        placeholder="Category"
        class="w-48"
      />
      <UButton @click="applyFilters">Search</UButton>
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
import { computed, watch, ref } from "vue";
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

const localSearch = ref(search.value);
const localCategory = ref(category.value);

const applyFilters = () => {
  search.value = localSearch.value;
  category.value = localCategory.value;
};

const { data: categories } = await useAsyncData(
  "moneypot-categories",
  () => $fetch("/api/pots/categories"),
);

const categoryOptions = computed(() => [
  { label: "All", value: "" },
  ...(categories.value?.map((c) => ({ label: c.slug, value: c.id })) ?? []),
]);

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