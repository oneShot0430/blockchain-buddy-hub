
import { CMC_API_Key } from "@/const/const";
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
        "X-CMC_PRO_API_KEY": CMC_API_Key,
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

    return results.sort((a, b) => b["volume_24h"] - a["volume_24h"]);
  } catch (error) {
    console.error("Error fetching token data:", error.message);
    return [];
  }
};
