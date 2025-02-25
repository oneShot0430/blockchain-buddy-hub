
import { CMC_API_KEY } from "@/const/const";
import axios from "axios";
import { CMCData, CMCResult } from "@/type/interface";

export const getTokenData = async (tokenSymbols: string[]) : Promise<CMCResult[]> => {
  if (!tokenSymbols || tokenSymbols.length === 0) {
    return [];
  }
  
  console.log(tokenSymbols.join(","));
  const url = `/api/v1/cryptocurrency/quotes/latest`;
  
  try {
    const response = await axios.get(url, {
      headers: {
        "X-CMC_PRO_API_KEY": CMC_API_KEY,
        Accept: "application/json",
      },
      params: {
        symbol: tokenSymbols.join(","),
        convert: "USD",
      },
      validateStatus: (status) => status < 500, // Only reject if status code is greater than or equal to 500
    });

    // Check if response exists and has data
    if (!response?.data?.data || Object.keys(response.data.data).length === 0) {
      console.log("No data found, returning default data");
      return [];
    }

    const data = response.data.data;
    console.log("Data received:", data);
    
    // Extract relevant details
    const results = Object.values(data).map((token: CMCData): CMCResult => ({
      id: token.id || 0,
      name: token.name || "Unknown",
      symbol: token.symbol || "",
      contract: token.platform?.token_address || "N/A",
      price: token.quote?.USD?.price || 0,
      change_24h: token.quote?.USD?.percent_change_24h || 0,
      change_7d: token.quote?.USD?.percent_change_7d || 0,
      volume_24h: token.quote?.USD?.volume_24h || 0,
      market_cap: token.quote?.USD?.market_cap || 0,
      social_score: token.cmc_rank || 0,
    }));

    return results.sort((a, b) => b["market_cap"] - a["market_cap"]);
  } catch (error) {
    console.error("Error fetching token data:", error.message);
    return [];
  }
};

export const fetchHistoricalData = async (tokenName: string): Promise<{formattedData: { time: string; price: number }[]; logo_uri: string }> => {
  try {
    // Fetch historical data from CoinGecko API
    console.log("tokenId:", tokenName);
    const coins = await axios.get(`https://api.coingecko.com/api/v3/search?query=${tokenName}`);
    console.log(coins.data.coins[0]);
    const tokenId = coins.data.coins[0].id;
    const logo_uri = coins.data.coins[0].thumb;
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${tokenId}/market_chart`,
      {
        params: {
          vs_currency: 'usd',
          days: '7', // Fetch data for the last 7 days
        },
      }
    );
    console.log("coinGeckoResponse;", response);
    // Extract prices from the response
    const prices = response.data.prices;

    // Format the data for the chart
    const formattedData = prices.map((price: [number, number]) => ({
      time: new Date(price[0]).toLocaleDateString(), // Convert timestamp to a readable date
      price: price[1], // Extract the price
    }));

    return {formattedData, logo_uri} ;
  } catch (error) {
    console.error("Error fetching historical data:", error instanceof Error ? error.message : error);
    return { formattedData: [], logo_uri: '' };
  }
};
