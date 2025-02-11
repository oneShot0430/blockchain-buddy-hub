import { CMC_API_Key } from "@/const/const";
import axios from "axios";

// Function to fetch token data from CoinMarketCap for Solana
export const getTokenData = async (tokenSymbols: string[]) => {
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
      throw new Error("Token not found on CoinMarketCap.");
    }
    console.log(data);
    // // Extract relevant details
    // return Object.values(data).map((token) => ({
    //   symbol: token.symbol,
    //   contract: token.id,
    //   price: token.quote.USD.price,
    //   change_24h: token.quote.USD.percent_change_24h,
    //   change_7d: token.quote.USD.percent_change_7d,
    //   volume_24h: token.quote.USD.volume_24h,
    //   market_cap: token.quote.USD.market_cap,
    //   social_score: token.social_score || "N/A",
    // }));
  } catch (error) {
    console.error("Error fetching token data:", error.message);
    return null;
  }
};
