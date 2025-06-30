<template>
  <div>
    <h2>Creer une cagnotte</h2>
    <form @submit.prevent="createPot">
      <input v-model="title" placeholder="Titre" />
      <button type="submit">Creer</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { navigateTo } from "#app";
const title = ref("");
const createPot = async () => {
  const { pot } = await $fetch("/api/pots/create", {
    method: "POST",
    body: { title: title.value },
  });
  await navigateTo(`/pots/${pot.id}`);
};
</script>