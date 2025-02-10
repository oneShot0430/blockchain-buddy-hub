import { USDC, BRETT, Jupiterurl, BASE_TOKEN_LIST_URL } from "@/const/const";
import { RaydiumResponse, RaydiumToken, TokenInfo } from "@/type/interface";

export const fetchRaydiumTokens = async (): Promise<TokenInfo[]> => {
  console.log("fetchRaydiumTokens");
  try {
    const response = await fetch(Jupiterurl);

    if (!response.ok) {
      throw new Error('Failed to fetch tokens');
    }
    const data = await response.json();

    return Object.values(data)
      .filter((token: RaydiumToken) => token.symbol && token.symbol.trim() !== '')
      .map((token: RaydiumToken) => ({
        symbol: token.symbol,
        name: token.name,
        mint: token.address,
        address: token.address,
        logoURI: token.logoURI
      }));
  } catch (error) {
    console.error('Error fetching Raydium tokens:', error);
    throw error;
  }
  // return [BRETT];
};

export const fetchBaseTokenList = async () => {
  console.log("fetchBaseTokenList");
  try {
    const response = await fetch(BASE_TOKEN_LIST_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch token list: ${response.statusText}`);
    }
    const tokens = await response.json();
    console.log(tokens);

    return Object.values(tokens)
      .filter((token: RaydiumToken) => token.symbol && token.symbol.trim() !== '')
      .map((token: RaydiumToken) => ({
        symbol: token.symbol,
        name: token.name,
        mint: token.address,
        address: token.address,
        logoURI: token.logoURI
      }));
  } catch (error) {
    console.error("Error fetching token list:", error);
  }
}