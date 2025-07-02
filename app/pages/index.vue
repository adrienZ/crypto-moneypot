<template>
  <div>
    <div v-if="user">
      hello {{ user.email }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from "~/composables/useAuth";

const { user } = useAuth();
</script>