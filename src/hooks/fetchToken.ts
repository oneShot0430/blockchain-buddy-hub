import { USDC, BRETT, Jupiterurl, BASE_TOKEN_LIST_URL, BACKEND_HEROKU_URL } from "@/const/const";
import { RaydiumResponse, RaydiumToken, TokenInfo } from "@/type/interface";

export const fetchRaydiumTokens = async (): Promise<TokenInfo[]> => {
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
        logoURI: token.logoURI,
        coingeckoId: token.extensions.coingeckoId
      }));
  } catch (error) {
    console.error('Error fetching Raydium tokens:', error);
    throw error;
  }
  // return [BRETT];
};

export const fetchBaseTokenList = async () => {
  try {
    const response = await fetch(BASE_TOKEN_LIST_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch token list: ${response.statusText}`);
    }
    const tokens = await response.json();

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

export const fetchMemeOnBaseTokenList = async () => {

  try {
    // Replace the URL to call the backend endpoint instead of BASE_TOKEN_LIST_URL
    const response = await fetch(`${BACKEND_HEROKU_URL}api/basememe`); // Assuming your backend is running on localhost:5000
    if (!response.ok) {
      throw new Error(`Failed to fetch token list: ${response.statusText}`);
    }
    
    // Parse the JSON response from the backend
    const tokens = await response.json();

    // Map the data into a desired format, you can adjust this based on what your backend sends
    return tokens
      .filter((token) => token.symbol && token.symbol.trim() !== '') // Ensure token has a symbol
      .map((token) => ({
        symbol: token.symbol,
        name: token.name,
        contract: token.platform?.token_address || 'N/A', // Add contract address (if available)
        price: token.quote?.USD?.price || 0,  // Add price if available
        logoURI: token.iconUrl || '', // Assuming the backend returns logo_uri
      }));
  } catch (error) {
    console.error("Error fetching token list:", error);
    return [];  // Return an empty array in case of error
  }
};
