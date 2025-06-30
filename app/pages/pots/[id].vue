<script lang="ts" setup>
import { computed, useLazyAsyncData, useRoute } from "#imports";

const route = useRoute();
const moneypotId = computed(() => route.params.id as string);

const { data } = useLazyAsyncData(moneypotId, () =>
  $fetch(`/api/pots/${moneypotId.value}`),
);
</script>

<template>
  <pre>{{ data }}</pre>
</template>