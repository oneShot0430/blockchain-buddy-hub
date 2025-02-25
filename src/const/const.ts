
import { CMCResult } from "@/type/interface";

export const USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
export const RANGO_API_KEY = "c6381a79-2817-4602-83bf-6a641a409e32";
export const CMC_API_KEY = "035d8ca6-8c6c-4395-8869-e6a1952ecede";
export const HELIUS_API_KEY = "f72d8256-c91e-452e-9c07-bb59dace8f21";

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
  },
];

// const url = "https://api-v3.raydium.io/mint/list";
export const Jupiterurl = "https://tokens.jup.ag/tokens?tags=verified";
// export const Jupiterurl = "https://tokens.jup.ag/tokens?tags=pump";


export const BASE_TOKEN_LIST_URL = "https://raw.githubusercontent.com/Uniswap/default-token-list/main/src/tokens/base.json";
