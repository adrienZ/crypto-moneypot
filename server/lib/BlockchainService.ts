import { ethers } from "ethers";

class BlockchainService {
  public provider: ethers.JsonRpcProvider;

  constructor() {
    this.provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  }

  async getNetwork() {
    return this.provider.getNetwork();
  }

  async getBalance(addr: string): Promise<string> {
    const balance = await this.provider.getBalance(addr);
    return ethers.formatEther(balance);
  }
}

const blockchainService = new BlockchainService();
export default blockchainService;
