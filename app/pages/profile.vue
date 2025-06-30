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
    </div>
  </div>
</template>

<script setup lang="ts">
import { NuxtLink } from "#components";
import { useLazyAsyncData } from "#imports";

const { data } = useLazyAsyncData('profile', () => $fetch('/api/profile'));
</script>
