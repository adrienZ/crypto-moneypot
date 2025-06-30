import { ref } from "vue";
import { useNuxtApp } from "#app";
import { ethers } from "ethers";

export function useWallet() {
  const nuxtApp = useNuxtApp();
  const address = ref<string | null>(null);

  async function connect() {
    const provider = nuxtApp.$ethersProvider;
    if (!provider) {
      throw new Error("Ethereum provider not found");
    }
    const accounts = await provider.send("eth_requestAccounts", []);
    address.value = accounts[0] as string;
    return address.value;
  }

  async function addWallet() {
    if (!address.value) return;
    const { wallet } = await $fetch("/api/wallets/add", {
      method: "POST",
      body: { address: address.value },
    });
    return wallet;
  }

  async function getNetwork() {
    const provider = nuxtApp.$ethersProvider;
    if (!provider) {
      throw new Error("Ethereum provider not found");
    }
    return provider.getNetwork();
  }

  async function getBalance(addr: string) {
    const provider = nuxtApp.$ethersProvider;
    if (!provider) {
      throw new Error("Ethereum provider not found");
    }
    const balance = await provider.getBalance(addr);
    return ethers.formatEther(balance);
  }

  return { address, connect, addWallet, getNetwork, getBalance };
}
