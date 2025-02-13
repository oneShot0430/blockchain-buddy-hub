
export interface RaydiumToken {
  symbol: string;
  name: string;
  mint: string;
  tags?: string[];
  address: string;
  logoURI: string;
}

export interface RaydiumResponse {
  tokens: {
    [key: string]: RaydiumToken;
  };
}

export interface TokenInfo {
  symbol: string;
  name: string;
  mint: string;
  address: string;
  logoURI: string;
}

export interface CMCplatform {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  token_address: string;
}

export interface CMCquote {
  USD: CMCquoteUSD;
}

export interface CMCquoteUSD {
  price: number;
  market_cap: number;
  percent_change_24h : number;
  percent_change_7d : number;
  volume_24h: number;
}

export interface CMCData {
  name: string;
  symbol: string;
  cmc_rank: number;
  quote: CMCquote;
  platform: CMCplatform;
}

export interface CMCResult {
  name: string;
  symbol: string;
  contract: string;
  price: number;
  change_24h: number;
  change_7d: number;
  volume_24h: number;
  market_cap: number;
  social_score: number;
  logo_uri?: string; // Added this property as optional
}
