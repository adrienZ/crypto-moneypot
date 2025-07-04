<template>
  <div ref="root"></div>
</template>


<script setup lang="ts">
import Quill from "quill";
import { onMounted, useTemplateRef } from "vue";

const root = useTemplateRef("root");

onMounted(() => {
  new Quill(root.value!, {
    theme: "snow",
    modules: {
      toolbar: ["bold", "italic", "underline", "strike"],
    },
  });
});
</script>