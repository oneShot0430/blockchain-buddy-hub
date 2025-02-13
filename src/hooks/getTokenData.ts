
import { CMC_API_Key } from "@/const/const";
import axios from "axios";
import { CMCData, CMCResult } from "@/type/interface";

export const getTokenData = async (tokenSymbols: string[]) : Promise<CMCResult[]> => {
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
    });

    const data = response.data.data;
    if (!data || Object.keys(data).length === 0) {
      console.log("No data found, returning default data");
      return [];
    }
    console.log("Data received:", data);
    
    // Extract relevant details
    const results = Object.values(data).map((token: CMCData): CMCResult => ({
      name: token.name,
      symbol: token.symbol,
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
