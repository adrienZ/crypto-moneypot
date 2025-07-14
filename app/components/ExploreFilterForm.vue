<template>
  <UForm :schema="schema" :state="{ search: searchModel, category: categoryModel }" @submit="onSubmit">
    <div class="flex items-end gap-2">
      <UInput
        v-model="searchModel"
        :placeholder="t('explore.filters.searchPlaceholder')"
        class="w-64 grow"
        size="xl"
      />
      <USelect
        v-model="categoryModel"
        :items="categoryOptions"
        :placeholder="t('explore.filters.categoryPlaceholder')"
        class="w-48"
        size="xl"
      />
      <UButton type="submit" size="xl">{{ t('explore.filters.searchButton') }}</UButton>
    </div>
  </UForm>
</template>

<script setup lang="ts">
import { UForm, UInput, USelect, UButton } from '#components';
import * as z from 'zod';
import { useI18n } from '#imports';

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

const { t } = useI18n();

function onSubmit() {
  emit('submit');
}
</script>