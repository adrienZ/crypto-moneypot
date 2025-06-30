<template>
  <div>
    <h2>Contribuer</h2>
    <form @submit.prevent="contribute">
      <input v-model="amount" placeholder="Montant" />
      <button type="submit">Envoyer</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { navigateTo, useRoute } from '#app';
const amount = ref('');
const { id } = useRoute().params as { id: string };

const contribute = async () => {
  await $fetch(`/api/pots/${id}/contribute`, {
    method: 'POST',
    body: { amount: amount.value, txHash: '0x' },
  });
  await navigateTo(`/cagnottes/${id}`);
};
</script>
