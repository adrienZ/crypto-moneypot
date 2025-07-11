<template>
  <UForm :schema="schema" :state="{ search: searchModel, category: categoryModel }" @submit="onSubmit">
    <div class="flex items-end gap-2">
      <UInput v-model="searchModel" placeholder="Search" class="w-64 grow" size="xl" />
      <USelect v-model="categoryModel" :items="categoryOptions" placeholder="Category" class="w-48" size="xl" />
      <UButton type="submit" size="xl">Search</UButton>
    </div>
  </UForm>
</template>

<script setup lang="ts">
import { UForm, UInput, USelect, UButton } from '#components';
import * as z from 'zod';

const searchModel = defineModel<string>('search');
const categoryModel = defineModel<string>('category');

const props = defineProps<{
  categoryOptions: Array<{ label: string; value: string }>;
}>();

const emit = defineEmits<{
  (e: 'submit'): void;
}>();

const schema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
});

function onSubmit() {
  emit('submit');
}
</script>