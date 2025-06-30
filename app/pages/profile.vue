<template>
  <div>
    <h2>Your profile</h2>
    <div v-if="data">
      <p>Email: {{ data.user.email }}</p>
      <h3>Sessions</h3>
      <ul>
        <li v-for="s in data.sessions" :key="s.id">
          {{ s.createdAt }}
        </li>
      </ul>
      <h3>Your moneypots</h3>
      <ul>
        <li v-for="p in data.pots" :key="p.id">
          <NuxtLink :to="`/pots/${p.id}`">{{ p.title }}</NuxtLink>
        </li>
      </ul>
      <h3>Your wallets</h3>
      <p v-if="network">Network: {{ network.name }} ({{ network.chainId }})</p>
      <ul>
        <li v-for="w in data.wallets" :key="w.id">
          {{ w.address }} - added {{ w.createdAt }} -
          <span v-if="walletInfos[w.id]">{{ walletInfos[w.id].balance }} ETH</span>
        </li>
      </ul>
      <button @click="connectAndAdd">Add Wallet</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NuxtLink } from "#components";
import { useAsyncData } from "#imports";
import { onMounted, reactive, ref } from "vue";
import { useWallet } from "~/composables/useWallet";

const { data, refresh } = useAsyncData("profile", () => $fetch("/api/profile"));
const { connect, addWallet, getNetwork, getBalance } = useWallet();

const network = ref<{ name: string; chainId: bigint } | null>(null);
const walletInfos = reactive<Record<number, { balance: string }>>({});

async function fetchExtraInfo() {
  if (data.value) {
    const net = await getNetwork();
    network.value = { name: net.name, chainId: net.chainId };
    for (const w of data.value.wallets) {
      walletInfos[w.id] = { balance: await getBalance(w.address) };
    }
  }
}

onMounted(fetchExtraInfo);

async function connectAndAdd() {
  await connect();
  await addWallet();
  await refresh();
  await fetchExtraInfo();
}
</script>
