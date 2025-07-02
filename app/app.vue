<template>
  <div>
    <NuxtRouteAnnouncer />
    <TheHeader />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import { NuxtRouteAnnouncer, NuxtPage } from "#components";
import TheHeader from "./components/TheHeader.vue";
import "~/assets/style/main.css";
</script>
