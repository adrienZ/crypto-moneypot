<template>
  <div>
    <h2>{{ $t('profile.title') }} {{ status }} {{ error }}</h2>
    <div v-if="data">
      <p v-if="data.user">{{ $t('profile.email') }}: {{ data.user.email }}</p>
      <h3>{{ $t('profile.sessions') }}</h3>
      <ul>
        <li v-for="s in data.sessions" :key="s.id">
          {{ s.createdAt }}
        </li>
      </ul>
      <h3>{{ $t('profile.moneypots') }}</h3>
      <ul>
        <li v-for="p in data.pots" :key="p.id">
          <NuxtLinkLocale :to="{
            name: 'pots-id',
            params: {
              id: p.id
            }
          }">{{ p.title }}</NuxtLinkLocale>
        </li>
      </ul>
      <h3>{{ $t('profile.wallets') }}</h3>
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
      <button @click="connectAndAdd">{{ $t('profile.addWalletButton') }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NuxtLinkLocale } from "#components";
import { useAsyncData, useRequestHeaders } from "#imports";
import { useWallet } from "~/composables/useWallet";

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
