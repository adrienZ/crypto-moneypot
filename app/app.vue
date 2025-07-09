<template>
  <div>
    <NuxtRouteAnnouncer />
    <TheHeader />

    <NuxtPage class="max-w-5xl mx-auto" />
    <div class="max-w-5xl mx-auto">
      <button v-if="devtoolsClient" @click="devtoolsClient.devtools.navigate('/modules/components')">
        <!-- Open the DevTools and navigate to the components tab -->
        Open DevTools
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NuxtRouteAnnouncer, NuxtPage } from "#components";
import { useNuxtDevTools } from "#imports";
import TheHeader from "./components/TheHeader.vue";
import "~/assets/style/main.css";

const devtoolsClient = useNuxtDevTools();
</script>
