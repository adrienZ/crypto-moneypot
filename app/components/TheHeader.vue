<template>
  <header>
    <div style="display: flex; align-items: center; justify-content: space-between;">
    <div>CryptoPot</div>

    <div>
      <NuxtLink to="/pots/list">Explore Moneypots</NuxtLink>
      <NuxtLink to="/pots/create">create moneypot</NuxtLink>
    </div>
    

    <div v-if="session">
      <NuxtLink to="/profile">profile</NuxtLink>
      <button @click="signOut">logout</button>

      <div v-if="currentWallet">
      <ul>
          <li v-for="account in currentWallet.accounts">
            <fieldset>
              <legend>{{ currentWallet.label }}<img width="16" :src="currentWallet.icon" /></legend>
              <div>{{ account.address }}</div>
              <div>{{ account.balance }}</div>
              <button @click="removeWallet">remove wallet</button>
            </fieldset>
          </li>
      </ul>

      </div>
      <div v-else>
        <div>No wallet</div>
        <button @click="connect">add wallet</button>
      </div>
    </div>

    <div v-else>
      <button @click="signIn">login</button>
    </div>

  </div>
  <hr />
  </header>
</template>

<script lang="ts" setup>
import { NuxtLink } from '#components';
import { useAuth, useWallet } from '#imports';


const { session, client, fetchSession } = useAuth();
const signIn = async () => {
  await client.signIn.social({
    provider: "github",
  });

  await fetchSession();
};
const signOut = async () => {
  await client.signOut();
  await fetchSession();
};

const { currentWallet, removeWallet, connect } = useWallet();
</script>

