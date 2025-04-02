
export class BrowserProvider {
  constructor(ethereum: any) {
    // Mock constructor
  }

  async send(method: string, params: any[]): Promise<string[]> {
    return ["0x742d35Cc6634C0532925a3b844Bc454e4438f44e"];
  }

  async getBalance(address: string): Promise<{ toString: () => string }> {
    return {
      toString: () => "1000000000000000000" // 1 ETH in wei
    };
  }
}

export const formatEther = (wei: { toString: () => string }) => {
  // Convert mock wei to ETH (1 ETH = 10^18 wei)
  return "1.0";
};
