<script lang="ts" setup>
import { NuxtImg } from "#components";
import {
  useAsyncData,
  useLazyFetch,
  useRequestHeaders,
  useRoute,
} from "#imports";
import { ethers, TransactionResponse } from "ethers";
import { computed, shallowRef, watchEffect } from "vue";
import RichTextEditor from "~/components/RichTextEditor.vue";
import { useWallet } from "~/composables/useWallet";

const route = useRoute("pots-id");
const moneypotId = computed(() => route.params.id);

const { data, status } = useAsyncData(moneypotId, () =>
  $fetch(`/api/pots/${moneypotId.value as "string to have type inference"}`),
);

const contributionAmout = shallowRef(0);

const { currentWallet, getWalletProvider } = useWallet();

const currentTx = shallowRef<TransactionResponse>();
// headers for cookies and session
const headers = useRequestHeaders();
const { execute } = useLazyFetch("/api/pots/contribute", {
  headers,
  method: "post",
  body: { transaction: currentTx, potId: data.value?.id },
  immediate: false,
});

async function contribute() {
  const provider = getWalletProvider();
  if (!provider) {
    throw new Error("No provider");
  }

  const signer = await provider.getSigner();

  const tx = await signer.sendTransaction({
    to: data.value?.walletAddress,
    value: ethers.parseEther(contributionAmout.value.toString()),
  });

  currentTx.value = tx;
  await execute();
}
</script>

<template>
  <div v-if="data">
    <main class="flex max-w-5xl gap-8 mx-auto">
      <div class="w-3/4"> 
        <NuxtImg :src="data?.coverImage" />
        <RichTextEditor readonly :modelValue="data.description" />
      </div>

      <div class="w-1/4">
        <div>{{ data }}</div>
      </div>

    </main>

    <div v-if="currentWallet">
<h3>Your wallets</h3>
      <ul>
          <li v-for="account in currentWallet.accounts">
            <fieldset>
              <legend>{{ currentWallet.label }}<img width="16" :src="currentWallet.icon" /></legend>
              <div>{{ account.address }}</div>
              <div>{{ account.balance }}</div>
            </fieldset>
          </li>
      </ul>

      <input type="number" inputmode="decimal" v-model="contributionAmout" />
      <button @click="contribute">send {{ contributionAmout ?? 0 }} ETH</button>
    </div>
  </div>
  <div v-else>something went wrong</div>
</template>