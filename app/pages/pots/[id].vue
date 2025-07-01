<script lang="ts" setup>
import { computed, useLazyAsyncData, useRoute, ref } from "#imports";

const route = useRoute();
const moneypotId = computed(() => route.params.id as string);

const { data, refresh } = useLazyAsyncData(moneypotId, () =>
  $fetch(`/api/pots/${moneypotId.value}`),
);

const amount = ref("");
const txHash = ref("");

async function sendContribution() {
  if (!amount.value || !txHash.value) return;
  await $fetch(`/api/pots/${moneypotId.value}/contribute`, {
    method: "POST",
    body: { amount: amount.value, txHash: txHash.value },
  });
  // Refresh data
  await refresh();
  amount.value = "";
  txHash.value = "";
}
</script>

<template>
  <div v-if="data">
    <h2>{{ data.pot.title }}</h2>
    <h3>Contributions</h3>
    <ul>
      <li v-for="c in data.contributions" :key="c.id">
        {{ c.contributorId }} - {{ c.amount }} ({{ c.txHash }})
      </li>
    </ul>
    <form @submit.prevent="sendContribution">
      <input v-model="amount" placeholder="Amount" />
      <input v-model="txHash" placeholder="Tx Hash" />
      <button type="submit">Contribute</button>
    </form>
  </div>
  <div v-else>Loading...</div>
</template>