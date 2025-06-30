<template>
  <div>
    <h2>Profil</h2>
    <p v-if="user">Email: {{ user.email }}</p>
    <form @submit.prevent="linkWallet">
      <input v-model="wallet" placeholder="Adresse du wallet" />
      <button type="submit">Associer</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuth } from '#imports';

const { user } = useAuth();
const wallet = ref('');

const linkWallet = async () => {
  await $fetch('/api/wallet/link', { method: 'POST', body: { walletAddress: wallet.value } });
};
</script>
