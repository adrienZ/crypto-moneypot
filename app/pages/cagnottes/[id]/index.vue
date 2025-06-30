<template>
  <div>
    <h2>{{ pot?.title }}</h2>
    <p>Montant: {{ pot?.amount }}</p>
    <a :href="`/cagnottes/${id}/contribute`">Contribuer</a>
  </div>
</template>

<script setup lang="ts">
const { id } = useRoute().params as { id: string };
const { data: pot } = await useFetch(`/api/pots/${id}`);
</script>
