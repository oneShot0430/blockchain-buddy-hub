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