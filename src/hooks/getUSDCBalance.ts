import { ethers } from "ethers";


const provider = new ethers.JsonRpcProvider('https://mainnet.base.org'); // Base Mainnet RPC
const baseUSDCContractAddress = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'; // Base USDC contract address
const usdcAbi = ['function balanceOf(address) view returns (uint256)'];

const usdcContract = new ethers.Contract(baseUSDCContractAddress, usdcAbi, provider);

export const getUSDCBalance = async (walletAddress: string) : Promise<string>=> {
  const balance = await usdcContract.balanceOf(walletAddress);
  const balanceDecimal = ethers.formatUnits(balance, 6); // USDC has 6 decimals

  return balanceDecimal;
}

