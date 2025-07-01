import { ref } from "vue";
import { ethers } from "ethers";

const hardhatProvider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

export function useWallet() {
  const address = ref<string | null>(null);

  async function connect() {
    const accounts = await hardhatProvider.send("eth_requestAccounts", []);
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
    return hardhatProvider.getNetwork();
  }

  async function getBalance(addr: string) {
    const balance = await hardhatProvider.getBalance(addr);
    return ethers.formatEther(balance);
  }

  return { address, connect, addWallet, getNetwork, getBalance };
}
