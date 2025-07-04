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
      <UForm :schema="schema" :state="formStep2" class="space-y-4" @submit="handleStep1FormSubmit">
        <UFormField label="Title" name="title">
          <UInput v-model="titleUrl" />
        </UFormField>

        <div>
          <UFormField label="show target amount">
            <USwitch v-model="enabledTargetAmount" />
          </UFormField>
          <UFormField v-show="enabledTargetAmount" label="taget amount" name="targetAmount">
            <UInput v-model="targetAmout" type="number" />
          </UFormField>
        </div>



        <UButton type="submit">
          Submit
        </UButton>
      </UForm>

    </section>

    <section v-if="currentStep === 2">
      Step 2
      <LazyClientOnly>
        <RichTextEditor />
      </LazyClientOnly>

    </section>


  </div>
</template>

<script setup lang="ts">
import { computed, ref, shallowRef } from "vue";
import { navigateTo, useAsyncData } from "#app";
import { UTimeline, UCard, USwitch } from "#components";
import type { TimelineItem } from "@nuxt/ui";
import { useUrlParams } from "#imports";
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import RichTextEditor from "~/components/RichTextEditor.vue";

// #region url params
// step 1
const categoryId = useUrlParams("categoryId");
//step 2
const titleUrl = useUrlParams("title");
const targetAmout = useUrlParams("targetAmout");
// #endregion

// #region steps form state
const enabledTargetAmount = shallowRef(false);
const formStep2 = computed(() => ({
  title: titleUrl.value,
  targetAmout: Number(targetAmout.value) * 1000,
}));
// #endregion

const schema = z.object({
  title: z.string().min(1),
  targetAmout: z.number().optional(),
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

function handleStep1FormSubmit(event: FormSubmitEvent<Schema>) {
  currentStep.value = 2;
}

const createPot = async () => {
  const { pot } = await $fetch("/api/pots/create", {
    method: "POST",
    body: { title: title.value },
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
if (targetAmout.value) {
  enabledTargetAmount.value = true;
}
// go to step 3
if (titleUrl.value) {
  currentStep.value = 2;
}
</script>