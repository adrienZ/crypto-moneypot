<template>
  <div ref="root"></div>
</template>


<script setup lang="ts">
import Quill from "quill";
import { onMounted, onUnmounted, useTemplateRef, ref } from "vue";

const root = useTemplateRef("root");
const quillInstance = ref<Quill>();

onMounted(() => {
  const toolbarOptions = [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote"],
    // ["blockquote", "code-block"],
    ["link", "image", "video", "formula"],

    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    [{ direction: "rtl" }], // text direction

    [{ size: ["small", false, "large", "huge"] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],

    ["clean"], // remove formatting button
  ];

  quillInstance.value = new Quill(root.value!, {
    theme: "snow",
    modules: {
      toolbar: toolbarOptions,
    },
  });
});

onUnmounted(() => {
  quillInstance.value?.disable();
  if (quillInstance.value) {
    quillInstance.value.root.innerHTML = "";
  }
  quillInstance.value = undefined;
});
</script>