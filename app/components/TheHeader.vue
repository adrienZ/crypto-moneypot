<template>
  <header>
    <div class="flex items-center justify-between py-2 px-6 bg-black">
      <div>
        <NuxtLink to="/">{{ $t('header.brand') }}</NuxtLink>
      </div>

      <div class="flex gap-2 ml-auto mr-8">
        <UButton size="md" color="secondary" to="/explore">{{ $t('header.explore') }}</UButton>
        <UButton size="md" color="primary" to="/pots/create">{{ $t('header.create') }}</UButton>
      </div>

      <div v-if="session && user">
        <UDropdownMenu :items="items" :ui="{
          content: 'w-48'
        }">
          <UAvatarGroup>
            <UAvatar :src="user.image ?? undefined" :alt="user.name" />

            <UAvatar v-if="!currentWallet" icon="i-lucide-plus" />
            <UAvatar v-else :src="currentWallet.icon" />
          </UAvatarGroup>
        </UDropdownMenu>
      </div>

      <div v-else>
        <UButton @click="signIn">{{ $t('header.login') }}</UButton>
      </div>

    </div>
    <hr />
  </header>
</template>

<script lang="ts" setup>
import {
  NuxtLink,
  UButton,
  UDropdownMenu,
  UAvatar,
  UAvatarGroup,
} from "#components";
import { useAuth } from "~/composables/useAuth";
import { useWallet } from "~/composables/useWallet";
import type { DropdownMenuItem } from "@nuxt/ui";
import { computed, shallowRef, watch } from "vue";
import { ethers } from "ethers";
import { useI18n } from "#imports";

const { session, client, fetchSession, user } = useAuth();
const { t } = useI18n();
const signIn = async () => {
  await client.signIn.social({
    provider: "github",
  });

  await fetchSession();
};
const signOut = async () => {
  await client.signOut();
  await fetchSession();
};

const { currentWallet, removeWallet, connect, getWalletProvider } = useWallet();

const walletBalanceInEth = shallowRef<string | undefined>(undefined);

watch(currentWallet, async () => {
  const walletProvider = getWalletProvider();
  if (currentWallet.value) {
    const address = currentWallet.value?.accounts[0]?.address;
    if (address) {
      const balance = await walletProvider?.getBalance(address);
      walletBalanceInEth.value = ethers.formatEther(balance ?? 0);
      return;
    }
  }
  walletBalanceInEth.value = undefined;
});

const items = computed<DropdownMenuItem[][]>(() => {
  if (!user.value) {
    return [];
  }

  const menu: DropdownMenuItem[][] = [];

  const userHeaderMenu: DropdownMenuItem[] = [
    {
      label: user.value.name,
      avatar: {
        src: user.value.image ?? undefined,
        alt: user.value.name,
      },
      type: "label",
    },
  ];

  const userMenu: DropdownMenuItem[] = [
    {
      label: t('header.profile'),
      icon: "i-lucide-user",
      to: "/profile",
    },
  ];
  if (!currentWallet.value) {
    userMenu.push({
      label: t('header.addWallet'),
      icon: "i-lucide-wallet",
      onSelect() {
        connect();
      },
    });
  }

  menu.push(userHeaderMenu, userMenu, [
    {
      label: t('header.logout'),
      icon: "i-lucide-log-out",
      onSelect() {
        signOut();
      },
    },
  ]);

  if (currentWallet.value) {
    menu.push(
      [
        {
          type: "label",
          kbds: [walletBalanceInEth.value, "ETH"],
          label: currentWallet.value.accounts[0]?.address,
          avatar: {
            src: currentWallet.value.icon,
          },
        },
      ],
      [
        {
          label: t('header.removeWallet'),
          icon: "i-lucide-wallet",
          onSelect() {
            removeWallet();
          },
        },
      ],
    );
  }

  return menu;
});
</script>
