<template>
  <UCard variant="soft">
    <NuxtImg class="aspect-video w-full object-cover" :src="image" format="webp" width="320" />
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