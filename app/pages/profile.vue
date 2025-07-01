<template>
  <div>
    <h2>Your profile {{ status }} {{ error }}</h2>
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
        <template v-for="w in wallets" :key="`key-wallet-${w.label}`">
          <li v-for="account in w.accounts">
            <fieldset>
              <legend>{{ w.label }}<img width="16" :src="w.icon" /></legend>
              <div>{{ account.address }}</div>
              <div>{{ account.balance }}</div>
            </fieldset>
          </li>
        </template>
      </ul>
      <button @click="connectAndAdd">Add Wallet</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NuxtLink } from "#components";
import { useAsyncData, useRequestHeaders, useWallet } from "#imports";

// headers for cookies and session
const headers = useRequestHeaders();
const { data, status, error } = useAsyncData("profile", () =>
  $fetch("/api/profile", { headers }),
);

const { wallets, connect } = useWallet();

async function connectAndAdd() {
  await connect();
}
</script>
