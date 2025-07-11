<template>
  <UForm :schema="schema" :state="{ search: searchModel, category: categoryModel }" @submit="onSubmit">
    <div class="flex items-end gap-4">
      <UFormField label="Search" name="search">
        <UInput v-model="searchModel" placeholder="Search" class="w-64" />
      </UFormField>
      <UFormField label="Category" name="category">
        <USelect
          v-model="categoryModel"
          :options="categoryOptions"
          option-attribute="label"
          value-attribute="value"
          placeholder="Category"
          class="w-48"
        />
      </UFormField>
      <UButton type="submit">Search</UButton>
    </div>
  </UForm>
</template>

<script setup lang="ts">
import { UForm, UFormField, UInput, USelect, UButton } from '#components';
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
