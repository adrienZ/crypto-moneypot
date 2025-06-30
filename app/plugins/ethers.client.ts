import { defineNuxtPlugin } from "#imports";
import { ethers } from "ethers";

export default defineNuxtPlugin(() => {
  let provider: ethers.BrowserProvider | null = null;
  if (process.client && (window as any).ethereum) {
    provider = new ethers.BrowserProvider((window as any).ethereum);
  }
  return {
    provide: {
      ethersProvider: provider,
    },
  };
});
