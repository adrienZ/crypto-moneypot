import { computed, onMounted, readonly, shallowRef } from "vue";
import Onboard, { type WalletState } from "@web3-onboard/core";
import injectedModule from "@web3-onboard/injected-wallets";
import { ethers } from "ethers";

export function useWallet() {
  const MAINNET_RPC_URL = "http://127.0.0.1:8545";
  const injected = injectedModule();

  const wallets = shallowRef<WalletState[]>([]);
  const currentWallet = computed(() => wallets.value.at(0));

  const onboard = Onboard({
    wallets: [injected],
    chains: [
      {
        id: "0x7a69",
        token: "ETH",
        label: "Ethereum localhost",
        rpcUrl: MAINNET_RPC_URL,
      },
    ],
    accountCenter: {
      desktop: {
        enabled: false,
      },
      mobile: {
        enabled: false,
      },
    },
    connect: {
      autoConnectLastWallet: true,
    },
    disableFontDownload: true,
  });

  const state = onboard.state.select();
  state.subscribe((update) => {
    wallets.value = update.wallets;
  });

  onMounted(async () => {
    const previouslyConnected = JSON.parse(
      window.localStorage.getItem("onboard.js:last_connected_wallet") || "[]",
    );

    if (previouslyConnected.length > 0) {
      await onboard.connectWallet({
        autoSelect: {
          label: previouslyConnected[0],
          disableModals: true,
        },
      });
    }
  });

  // onUnmounted(() => {
  //   unsubscribe();
  // });

  function connect() {
    return onboard.connectWallet();
  }

  async function removeWallet() {
    if (!currentWallet.value) {
      return null;
    }

    return onboard.disconnectWallet({ label: currentWallet.value.label });
  }

  function getWalletProvider() {
    if (!currentWallet.value) {
      return null;
    }

    const ethersProvider = new ethers.BrowserProvider(
      currentWallet.value.provider,
    );
    return ethersProvider;
  }

  return {
    connect,
    removeWallet,
    getWalletProvider,
    currentWallet: readonly(currentWallet),
    wallets: readonly(wallets),
  };
}
