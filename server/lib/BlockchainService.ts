import { ethers } from "ethers";

class BlockchainService {
  public provider: ethers.JsonRpcProvider;

  constructor() {
    this.provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  }

  async getNetwork() {
    return this.provider.getNetwork();
  }

  async listWallets(): Promise<{ address: string; balance: string }[]> {
    const accounts = await this.provider.listAccounts();
    const wallets = await Promise.all(
      accounts.map(async (address) => ({
        address,
        balance: ethers.formatEther(await this.provider.getBalance(address)),
      })),
    );
    return wallets;
  }

  async getBalance(addr: string): Promise<string> {
    const balance = await this.provider.getBalance(addr);
    return ethers.formatEther(balance);
  }
}

const blockchainService = new BlockchainService();
export default blockchainService;
