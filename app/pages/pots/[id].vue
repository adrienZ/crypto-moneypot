<script lang="ts" setup>
import { NuxtImg, UCard } from "#components";
import { useAsyncData, useRoute } from "#imports";
import { computed } from "vue";
import RichTextEditor from "~/components/RichTextEditor.vue";

const route = useRoute("pots-id");
const moneypotId = computed(() => route.params.id);

const { data, status } = useAsyncData(moneypotId, () =>
  $fetch(`/api/pots/${moneypotId.value as "string to have type inference"}`),
);

// const contributionAmout = shallowRef(0);

// const { currentWallet, getWalletProvider } = useWallet();

// const currentTx = shallowRef<TransactionResponse>();
// // headers for cookies and session
// const headers = useRequestHeaders();
// const { execute } = useLazyFetch("/api/pots/contribute", {
//   headers,
//   method: "post",
//   body: { transaction: currentTx, potId: data.value?.id },
//   immediate: false,
// });

// async function contribute() {
//   const provider = getWalletProvider();
//   if (!provider) {
//     throw new Error("No provider");
//   }

//   const signer = await provider.getSigner();

//   const tx = await signer.sendTransaction({
//     to: data.value?.walletAddress,
//     value: ethers.parseEther(contributionAmout.value.toString()),
//   });

//   currentTx.value = tx;
//   await execute();
// }
</script>

<template>
  <div v-if="data">
    <main class="flex max-w-5xl gap-8 mx-auto mt-8">
      <div class="w-5/8">
        <NuxtImg class="aspect-16/9 object-cover w-full" format="webp" :src="data?.coverImage"
          :placeholder="[100, 100, 50, 5]" />

        <UCard variant="subtle" class="mt-4">
          <RichTextEditor readonly :modelValue="data.description" />

          <h2 class="italic mt-4">{{ new Intl.DateTimeFormat("fr-FR").format(new Date(data.createdAt)) }}</h2>
        </UCard>
      </div>

      <UCard variant="subtle" class="w-3/8">
        <h2 class="text-2xl font-bold">{{ data.title }}</h2>
        <details>{{ data }}</details>
      </UCard>

    </main>
  </div>
  <div v-else>something went wrong</div>
</template>