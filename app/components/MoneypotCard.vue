<template>
  <UCard variant="soft" :ui="{
    header: 'p-0 sm:px-0',
    body: 'p-0 sm:p-4 sm:py-2',
  }">
    <template #header>
      <NuxtImg class="aspect-video w-full object-cover" :src="image" format="webp" width="320" />
    </template>

    <h3 class="text-lg font-semibold text-center">{{ title }}</h3>
    <div v-if="targetAmount">
      target: {{ ethers.formatEther(BigInt(targetAmount)) }} ETH
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { UCard, NuxtImg } from "#components";
import { ethers } from "ethers";
interface Props {
  title: string;
  image: string;
  targetAmount: string | null;
}
defineProps<Props>();

export type MoneypotCardProps = Props;
</script>