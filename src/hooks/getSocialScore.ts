import axios from "axios";
import { BACKEND_HEROKU_URL } from "@/const/const";

export const getSocialData = async (tokenAddress) => {
  try {
    const response = await axios.post(`${BACKEND_HEROKU_URL}api/socialdata`, {
      tokenAddress
    });
    console.log("response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching token data:", error.message);
    return [];
  }
};