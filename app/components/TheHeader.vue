<template>
  <header>
    <div class="flex items-center justify-between py-2 px-6 bg-black">
      <div>
        <NuxtLink to="/">CryptoPot</NuxtLink>
      </div>

      <div class="flex gap-2 ml-auto mr-2">
        <UButton size="md" color="secondary" to="/pots/list">Explore Moneypots</UButton>
        <UButton size="md" color="primary" to="/pots/create">Create Moneypot</UButton>
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
import { NuxtLink, UButton } from "#components";
import { useAuth } from "~/composables/useAuth";
import { useWallet } from "~/composables/useWallet";

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

