<script lang="ts" setup>
import { useAsyncData, useLazyFetch, useRoute, useWallet } from "#imports";
import { ethers } from "ethers";
import { computed, shallowRef } from "vue";
import { pots } from "~~/server/database/schemas/moneypot"

const route = useRoute();
const moneypotId = computed(() => route.params.id as string);

const { data } = useAsyncData<typeof pots.$inferSelect>(moneypotId, () =>
  $fetch(`/api/pots/${moneypotId.value}`),
);

const contributionAmout = shallowRef(0);

const { currentWallet, getWalletProvider } = useWallet();

async function contribute() {
  const provider = getWalletProvider();
  if (!provider) {
    throw new Error("No provider")
  }

  const signer = await provider.getSigner();

  const tx = await signer.sendTransaction({
    to: data.value?.walletAddress,
    value: ethers.parseEther(contributionAmout.value.toString()),
  });
}
</script>

<template>
  <div>
    <pre>{{ data }}</pre>
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
</template>