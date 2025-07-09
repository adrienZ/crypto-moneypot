<template>
  <UCard>
    <NuxtImg class="aspect-video w-full object-cover" :src="image" />
    {{ title }}
  </UCard>
</template>

<script setup lang="ts">
import { UCard, NuxtImg } from "#components";
interface Props {
  title: string;
  image: string;
}
defineProps<Props>();

export type MoneypotCardProps = Props;
</script>