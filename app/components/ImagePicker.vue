<template>
  <label :class="[ratio, !preview ? 'border' : '', 'rounded-md  block relative']" tabindex="0">

    <img v-if="preview" class="rounded-md w-full h-full object-cover" :src="preview" />

    <div v-else></div>

    <input class="hidden" ref="input" type="file" accept="image/png,image/jpeg,image/jpg" @change="handleFileChange" />


    <button type="button" class="cta absolute bottom-0 bg-amber-500 p-4 rounded-3xl w-1/2" @click="inputEl?.click()">set
      image</button>
  </label>
</template>

<script setup lang="ts">
import { shallowRef, useTemplateRef } from "vue";

const inputEl = useTemplateRef("input");

withDefaults(
  defineProps<{
    ratio?: `aspect-${number}/${number}`;
  }>(),
  {
    ratio: "aspect-16/9",
  },
);

const preview = shallowRef<string>();
const model = defineModel<File>();

function handleFileChange(event: Event) {
  const reader = new FileReader();
  const input = event.target as HTMLInputElement;
  if (!input.files || Array.isArray(input.files)) return;
  const file = input.files[0];
  if (!file) {
    return;
  }
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (!allowedTypes.includes(file.type) || file.size > 10 * 1024 * 1024) {
    alert("Invalid image");
    return;
  }

  reader.onload = () => {
    preview.value = reader.result?.toString();
  };
  reader.readAsDataURL(file);

  model.value = file;
}
</script>

<style scoped></style>