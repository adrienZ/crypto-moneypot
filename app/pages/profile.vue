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
      <ul>
        <li v-for="w in data.wallets" :key="w.id">{{ w.address }}</li>
      </ul>
      <button @click="connectAndAdd">Add Wallet</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NuxtLink } from "#components";
import { useAsyncData } from "#imports";
import { useWallet } from "~/composables/useWallet";

const { data, refresh } = useAsyncData('profile', () => $fetch('/api/profile'));
const { connect, addWallet } = useWallet();

async function connectAndAdd() {
  await connect();
  await addWallet();
  await refresh();
}
</script>
