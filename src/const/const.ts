
import { CMCResult } from "@/type/interface";

export const USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

export const BRETT = {
  symbol: 'BRETT', 
  name: 'Brett', 
  mint: 'DxtssVdyYe4wWE5f5zEgx2NqtDFbVL3ABGY62WCycHWg', 
  address: 'DxtssVdyYe4wWE5f5zEgx2NqtDFbVL3ABGY62WCycHWg', 
  logoURI: 'https://gateway.irys.xyz/Lc1vGYEY45eezP3nJcHDbUFOpn0jEQeTvoJ8akpRkXQ'
}

export const defaultData: CMCResult[] = [
  {
    id: 0,
    name:"Solana",
    symbol: "Sol",
    contract: "N/A",
    price: 0,
    change_24h: 0,
    change_7d: 0,
    volume_24h: 0,
    market_cap: 0,
    social_score: 0,
    logo_uri: "",
    platform: "",
  },
];

// const url = "https://api-v3.raydium.io/mint/list";
export const Jupiterurl = "https://tokens.jup.ag/tokens?tags=verified";
// export const Jupiterurl = "https://tokens.jup.ag/tokens?tags=pump";


export const BASE_TOKEN_LIST_URL = "https://raw.githubusercontent.com/Uniswap/default-token-list/main/src/tokens/base.json";

// export const BACKEND_HEROKU_URL = "https://zex-backend-7427db10a09b.herokuapp.com/";
export const BACKEND_HEROKU_URL = "http://localhost:5000/";


export const PAYMASTER_PROXY_URL = `${BACKEND_HEROKU_URL}api/paymaster`; // Calls backend securely
export const ENTRYPOINT_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"; // ERC-4337 Entrypoint
export const BASE_CHAIN_ID = "0x2105"; // Base Chain ID
export const USDC_CONTRACT = "0x833589fCD6eDb6E08f4c7C32D4f71b54bda02913"; // USDC Address on Base

export const explorerMap = {
  Ethereum: "https://etherscan.io/token/",
  Solana: "https://solscan.io/token/",
  Polygon: "https://polygonscan.com/token/",
  Binance: "https://bscscan.com/token/",
  Base: "https://basescan.org/token/",
  // Add others as needed
};

export const DEXSCREENER_URL = "https://dexscreener.com/";

