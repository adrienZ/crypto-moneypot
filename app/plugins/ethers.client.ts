import { defineNuxtPlugin, useRuntimeConfig } from "#imports";
import { ethers } from "ethers";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  let provider: ethers.BrowserProvider | ethers.JsonRpcProvider | null = null;
  if (process.client) {
    if (config.public.rpcUrl) {
      provider = new ethers.JsonRpcProvider(config.public.rpcUrl as string);
    } else if ((window as any).ethereum) {
      provider = new ethers.BrowserProvider((window as any).ethereum);
    }
  }
  return {
    provide: {
      ethersProvider: provider,
    },
  };
});
