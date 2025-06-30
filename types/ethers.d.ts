import { ethers } from "ethers";

declare module "#app" {
  interface NuxtApp {
    $ethersProvider: ethers.BrowserProvider | null;
  }
}

declare module "vue" {
  interface ComponentCustomProperties {
    $ethersProvider: ethers.BrowserProvider | null;
  }
}

export {};
