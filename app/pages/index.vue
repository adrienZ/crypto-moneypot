<template>
  <div>
    <div v-if="user">
      hello {{ user.email }}
      <NuxtLink to="/profile">profile</NuxtLink>
      <NuxtLink to="/pots/create">create moneypot</NuxtLink>
      <button @click="signOut">logout</button>
    </div>
    <div v-else>
      <button @click="signIn">login with github</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NuxtLink } from "#components";
import { useAuth } from "~/composables/useAuth";

const { user, client, fetchSession } = useAuth();
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
</script>