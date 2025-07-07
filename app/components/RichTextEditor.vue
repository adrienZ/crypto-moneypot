<template>
  <div ref="root"></div>
</template>

<script setup lang="ts">
import type Quill from "quill";
import {
  onMounted,
  onUnmounted,
  useTemplateRef,
  ref,
  watch,
  defineEmits,
  defineProps,
} from "vue";

const props = defineProps<{
  modelValue: string;
  readonly?: boolean;
}>();
const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const root = useTemplateRef("root");
const quillInstance = ref<Quill>();

onMounted(async () => {
  const toolbarOptions = [
    ["bold", "italic", "underline", "strike"],
    ["blockquote"],
    ["link", "image", "video", "formula"],
    [{ header: 1 }, { header: 2 }],
    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
    [{ script: "sub" }, { script: "super" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ direction: "rtl" }],
    [{ size: ["small", false, "large", "huge"] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],
    ["clean"],
  ];

  const { default: QuillLoaded } = await import("quill");
  quillInstance.value = new QuillLoaded(root.value!, {
    theme: props.readonly ? "" : "snow",
    modules: {
      toolbar: props.readonly ? false : toolbarOptions,
    },
    readOnly: props.readonly,
  });

  // Set initial content
  if (props.modelValue) {
    quillInstance.value.root.innerHTML = props.modelValue;
  }

  // Listen to changes
  quillInstance.value.on("text-change", () => {
    emit("update:modelValue", quillInstance.value!.root.innerHTML);
  });
});

// Sync prop change into editor (avoid infinite loop by ignoring focus state)
watch(
  () => props.modelValue,
  (newValue) => {
    if (quillInstance.value && !quillInstance.value.hasFocus()) {
      if (quillInstance.value.root.innerHTML !== newValue) {
        quillInstance.value.root.innerHTML = newValue || "";
      }
    }
  },
);

watch(
  () => props.readonly,
  (newVal) => {
    if (quillInstance.value) {
      quillInstance.value.enable(!newVal);
    }
  },
  { immediate: true },
);

onUnmounted(() => {
  quillInstance.value?.disable();
  if (quillInstance.value) {
    quillInstance.value.root.innerHTML = "";
  }
  quillInstance.value = undefined;
});
</script>