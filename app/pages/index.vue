<template>
  <div>
    <div v-if="user">
      hello {{ user.email }}
    </div>
    <div v-else>
      <button @click="signIn">login with github</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from "~/composables/useAuth";

const { user, client, fetchSession } = useAuth();
const signIn = async () => {
  await client.signIn.social({
    provider: "github",
  });

  await fetchSession();
};
</script>