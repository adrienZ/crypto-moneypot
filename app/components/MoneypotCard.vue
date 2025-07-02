<template>
  <UCard>
    <img class="aspect-video w-full" :src="image" />
    {{ title }}
  </UCard>
</template>

<script setup lang="ts">
import { UCard } from "#components";
interface Props {
  title: string;
  image: string;
}
defineProps<Props>();

export type MoneypotCardProps = Props;
</script>