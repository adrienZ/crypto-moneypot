<template>
  <div class="max-w-2xl mx-auto">
    <h2>Creer une cagnotte</h2>
    <UTimeline orientation="horizontal" v-model="currentStep" :items="items" class="w-full" />

    <section v-if="currentStep === 0">
      <div v-if="groupedMoneyPotCategories">
        <div class="mt-4" v-for="categoryType in moneypotCategoriesTypes" :key="`category-type-${categoryType}`">
          <h3 class="text-2xl font-bold mb-2">{{ categoryType }}</h3>
          <div class="grid grid-cols-3 gap-4">
            <UCard v-for="category in groupedMoneyPotCategories[categoryType]" variant="solid"
              @click="handleCategorySelection(category.id)">
              <img
                src="https://images2.minutemediacdn.com/image/upload/c_fill,w_1200,ar_4:3,f_auto,q_auto,g_auto/shape/cover/sport/istock-508455188-033183f45ba393ed4745b2dd1213c390.jpg" />
              {{ category.slug }}
            </UCard>
          </div>

        </div>
      </div>
      <div v-else>error loading categories</div>
    </section>

    <section v-if="currentStep === 1">
      <UForm :schema="schema" :state="formStep2" class="space-y-4" @submit.prevent="createPot">
        <UFormField label="Title" name="title">
          <UInput v-model="titleUrl" />
        </UFormField>

        <div>
          <UFormField label="show target amount">
            <USwitch v-model="enabledTargetAmount" />
          </UFormField>
          <UFormField v-show="enabledTargetAmount" label="taget amount" name="targetAmount">
            <UInput v-model="targetAmount" type="number" />
          </UFormField>
        </div>

        <LazyClientOnly>
          <RichTextEditor v-model="description" />
        </LazyClientOnly>

        <UFormField label="Image" name="coverImage">
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            @change="handleFileChange"
          />
          <div v-if="uploadStatus === 'pending'" class="text-sm mt-1">Uploading...</div>
          <ul class="text-sm mt-1">
            <li>• Your image must be smaller than 10 MB.</li>
            <li>• Accepted formats are .jpg, .jpeg and .png</li>
            <li>• Minimum 350 px wide and 255 px high</li>
            <li>• Offensive images will not be accepted.</li>
          </ul>
        </UFormField>


        <UButton type="submit">
          Submit
        </UButton>
      </UForm>

    </section>

  </div>
</template>

<script setup lang="ts">
import { computed, shallowRef, ref } from "vue";
import { navigateTo, useAsyncData, useLazyFetch } from "#app";
import { UTimeline, UCard, USwitch } from "#components";
import type { TimelineItem } from "@nuxt/ui";
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import RichTextEditor from "~/components/RichTextEditor.vue";
import { useUrlParams } from "~/composables/useUrlParams";

// #region url params
// step 1
const categoryId = useUrlParams("categoryId");
//step 2
const titleUrl = useUrlParams("title");
const targetAmount = useUrlParams("targetAmount");
const description = shallowRef("");
const selectedFile = shallowRef<File | null>(null);
const coverImagePath = shallowRef<string | null>(null);
const {
  execute: uploadImage,
  status: uploadStatus,
  data: uploadedData,
} = useLazyFetch("/api/upload", { method: "POST", immediate: false });
// #endregion

// #region steps form state
const enabledTargetAmount = shallowRef(false);
const formStep2 = computed(() => ({
  title: titleUrl.value,
  targetAmount: Number(targetAmount.value) * 1000,
  description: description.value,
  categoryId: categoryId.value,
  coverImage: coverImagePath.value || "",
}));
// #endregion

const schema = z.object({
  title: z.string().min(1),
  targetAmount: z.number().optional(),
  description: z.string().min(1),
  categoryId: z.string().min(1),
  coverImage: z.string().min(1),
});

type Schema = z.output<typeof schema>;

const currentStep = shallowRef(0);
const items = ref<TimelineItem[]>([
  {
    title: "Category",
    // description: "Kicked off the project with team alignment.",
    icon: "i-lucide-rocket",
  },
  {
    title: "Design Phase",
    // description: "User research and design workshops.",
    icon: "i-lucide-palette",
  },
  {
    title: "Development Sprint",
    // description: "Frontend and backend development.",
    icon: "i-lucide-code",
  },
  {
    title: "Testing & Deployment",
    // description: "QA testing and performance optimization.",
    icon: "i-lucide-check-circle",
  },
]);

const { data: moneypotCategories } = await useAsyncData(
  "moneypot-categories",
  () => $fetch("/api/pots/categories"),
);

const groupedMoneyPotCategories = computed(() =>
  moneypotCategories.value?.reduce(
    (acc, category) => {
      if (!acc[category.type]) {
        acc[category.type] = [];
      }
      acc[category.type].push(category);
      return acc;
    },
    {} as Record<
      (typeof moneypotCategories.value)[number]["type"],
      typeof moneypotCategories.value
    >,
  ),
);

const moneypotCategoriesTypes = computed(() =>
  groupedMoneyPotCategories.value
    ? (Object.keys(groupedMoneyPotCategories.value) as unknown as Array<
        keyof typeof groupedMoneyPotCategories.value
      >)
    : [],
);

function handleCategorySelection(selectedCategoryId: string) {
  categoryId.value = selectedCategoryId;
  currentStep.value = 1;
}

async function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;
  const file = input.files[0];
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (!allowedTypes.includes(file.type) || file.size > 10 * 1024 * 1024) {
    alert("Invalid image");
    return;
  }
  const img = new Image();
  img.src = URL.createObjectURL(file);
  await new Promise<void>((resolve) => {
    img.onload = () => resolve();
  });
  if (img.width < 350 || img.height < 255) {
    alert("Image too small");
    return;
  }

  selectedFile.value = file;
  await uploadImage({ body: file, headers: { "Content-Type": file.type } });
  coverImagePath.value = uploadedData.value?.url || null;
}

const createPot = async () => {
  const { pot } = await $fetch("/api/pots/create", {
    method: "POST",
    body: formStep2.value,
  });

  if (!pot) {
    throw new Error("error while creating pot");
  }

  await navigateTo(`/pots/${pot.id}`);
};

// go to step 2 if category is found in url state
if (
  categoryId.value &&
  moneypotCategories.value?.map((c) => c.id).includes(categoryId.value)
) {
  currentStep.value = 1;
}
// prefill step 2
if (targetAmount.value) {
  enabledTargetAmount.value = true;
}
</script>