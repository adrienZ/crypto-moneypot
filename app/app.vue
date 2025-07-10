<template>
  <div>
    <NuxtRouteAnnouncer />
    <TheHeader />

    <NuxtPage class="max-w-5xl mx-auto" />
    <DevOnly>
      <div class="max-w-5xl mx-auto">
        <button @click="triggerDevTools">
          Open DevTools
        </button>
      </div>
    </DevOnly>
  </div>
</template>

<script setup lang="ts">
import { NuxtRouteAnnouncer, NuxtPage } from "#components";
import TheHeader from "./components/TheHeader.vue";

function triggerDevTools() {
  import("#imports").then(({ useNuxtDevTools }) => {
    const devtoolsClient = useNuxtDevTools();
    devtoolsClient.value?.devtools.open();
  });
}
</script>
