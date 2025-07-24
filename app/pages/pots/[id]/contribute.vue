<script lang="ts" setup>
import { NuxtImg, UCard, UInput, UButton } from '#components';
import { useAsyncData, useRoute, useI18n, useLazyFetch, useRequestHeaders } from '#imports';
import { computed, shallowRef } from 'vue';
import { useWallet } from '~/composables/useWallet';
import RichTextEditor from '~/components/RichTextEditor.vue';
import { ethers, type TransactionResponse } from 'ethers';

definePageMeta({
  middleware: ['auth'],
});

const route = useRoute();
const moneypotId = computed(() => route.params.id);
const { locale } = useI18n();

const { data } = await useAsyncData(moneypotId, () =>
  $fetch(`/api/pots/${moneypotId.value as string}`),
);

const amount = shallowRef(0);
const currentTx = shallowRef<TransactionResponse>();
const { getWalletProvider, connect } = useWallet();
const headers = useRequestHeaders();
const { execute } = useLazyFetch('/api/pots/contribute', {
  headers,
  method: 'post',
  body: { transaction: currentTx, potId: moneypotId },
  immediate: false,
});

async function contribute() {
  const provider = getWalletProvider();
  if (!provider) {
    await connect();
    return;
  }
  const signer = await provider.getSigner();
  const tx = await signer.sendTransaction({
    to: data.value?.walletAddress,
    value: ethers.parseEther(amount.value.toString()),
  });
  currentTx.value = tx;
  await execute();
}
</script>

<template>
  <div v-if="data">
    <main class="flex max-w-5xl gap-8 mx-auto mt-8">
      <div class="w-5/8">
        <NuxtImg class="aspect-16/9 object-cover w-full" format="webp" :src="data.coverImage" :placeholder="[100,100,50,5]" />
        <UCard variant="subtle" class="mt-4">
          <RichTextEditor readonly :modelValue="data.description" />
          <h2 class="italic mt-4">{{ new Intl.DateTimeFormat(locale).format(new Date(data.createdAt)) }}</h2>
        </UCard>
      </div>
      <UCard variant="subtle" class="w-3/8 space-y-4">
        <h2 class="text-2xl font-bold">{{ data.title }}</h2>
        <UInput v-model="amount" type="number" />
        <UButton @click="contribute">{{ $t('pots.contribute') }}</UButton>
      </UCard>
    </main>
  </div>
  <div v-else>{{ $t('pots.error') }}</div>
</template>
