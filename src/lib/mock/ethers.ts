
// Mock implementation for ethers
export class BrowserProvider {
  constructor(ethereum: any) {
    this.ethereum = ethereum;
  }
  
  ethereum: any;

  async getSigner() {
    return {
      address: "0x1234567890abcdef1234567890abcdef12345678",
      connect: () => this,
      getAddress: () => Promise.resolve("0x1234567890abcdef1234567890abcdef12345678"),
      signMessage: (message: string) => Promise.resolve("0xmocksignature"),
      sendTransaction: (tx: any) => {
        console.log("Mock sendTransaction called", tx);
        return Promise.resolve({
          hash: "0xmocktxhash",
          wait: () => Promise.resolve({ status: 1 })
        });
      }
    };
  }
}

export class JsonRpcProvider {
  constructor(url: string) {
    this.url = url;
  }
  
  url: string;
  
  getBalance(address: string) {
    return Promise.resolve(BigInt(1000000000000000000)); // 1 ETH
  }
}

export class Contract {
  constructor(address: string, abi: any, provider: any) {
    this.address = address;
    this.abi = abi;
    this.provider = provider;
  }
  
  address: string;
  abi: any;
  provider: any;
  
  balanceOf(address: string) {
    return Promise.resolve(BigInt(1000000)); // 1 USDC (with 6 decimals)
  }
}

export const formatUnits = (value: bigint, decimals: number) => {
  return (Number(value) / Math.pow(10, decimals)).toString();
};
