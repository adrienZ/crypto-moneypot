<template>
  <div class="h-full flex flex-col">
    <NuxtRouteAnnouncer />
    <UApp>
      <TheHeader />

      <NuxtPage class="max-w-5xl mx-auto grow w-full" />
      <TheFooter />
    </UApp>
  </div>
</template>

<style>
html,
body,
#__nuxt {
  min-height: 100%;
}
</style>

<script setup lang="ts">
import { NuxtRouteAnnouncer, NuxtPage, UApp } from "#components";
import TheHeader from "./components/TheHeader.vue";
import TheFooter from "./components/TheFooter.vue";
</script>
