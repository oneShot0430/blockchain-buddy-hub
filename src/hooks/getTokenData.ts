import { CMC_API_Key } from "@/const/const";
import axios from "axios";
// Function to fetch token data from CoinMarketCap for Solana
const getTokenData = async (contractAddress: string) => {
  const url = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest`;

  try {
    const response = await axios.get(url, {
      headers: {
        "X-CMC_PRO_API_KEY": CMC_API_Key,
        Accept: "application/json",
      },
      params: {
        contract_address: contractAddress,
        convert: "USD",
        blockchain: "solana",
      },
    });

    const data = response.data.data;
    if (!data || Object.keys(data).length === 0) {
      throw new Error("Token not found on CoinMarketCap.");
    }
    console.log(data);
    // // Extract relevant details
    // const tokenInfo = Object.values(data)[0].quote.USD;
    // return {
    //   price: tokenInfo.price,
    //   change_24h: tokenInfo.percent_change_24h,
    //   change_7d: tokenInfo.percent_change_7d,
    //   volume_24h: tokenInfo.volume_24h,
    //   market_cap: tokenInfo.market_cap,
    //   social_score: data.social_score || "N/A",
    // };
  } catch (error) {
    console.error("Error fetching token data:", error.message);
    return null;
  }
};

