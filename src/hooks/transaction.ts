import axios from 'axios';
import { BACKEND_HEROKU_URL } from "@/const/const";

export const getRoute = async (
  fromChain:string, 
  toChain:string, 
  fromSymbol: string, 
  toSymbol: string, 
  fromToken: string,
  toToken: string,
  amount: string,
) => {
  try {
    const routeResponse = await axios.post(`${BACKEND_HEROKU_URL}api/transaction/get`, {
      fromChain, toChain, fromSymbol, toSymbol, fromToken, toToken, amount
    });
    return routeResponse.data;
  } catch (error) {
    console.error("Failed to get Swapping Route:", error.message);
  }
}

export const createTransaction = async (requestId: string, step: number, slippage: number) => {
  try {
    const tx = await axios.post(`${BACKEND_HEROKU_URL}api/transaction/create`, {
      requestId, step, slippage
    });
    return tx.data;
  } catch (error) {
    console.error("Failed to create Swapping Transaction:", error.message);
  }
}

export const confirmRoute = async (requestId: string, fromChain: string, toChain: string, fromAddress: string, toAddress: string) => {
  try {
    const routeResponse = await axios.post(`${BACKEND_HEROKU_URL}api/transaction/confirm`, {
      requestId, fromChain, toChain, fromAddress, toAddress
    });
    return routeResponse.data;
  } catch (error) {
    console.error("Failed to confirming swapping Route:", error.message);
  }
}

export const checkStatus = async ( requestId: string, txId: string, step: number) => {
  try {
    const status = await axios.post(`${BACKEND_HEROKU_URL}api/transaction/check`, {
      requestId, txId, step
    });
    return status.data;
  } catch (error) {
    console.error("Failed to check Transaction Status:", error.message);
  }
}

export const checkApprovalTx = async (requestId: string, txHash: string) => {
  try {
    const status = await axios.post(`${BACKEND_HEROKU_URL}api/transaction/checkapprove`, {
      requestId, txHash
    });
    return status.data;
  } catch (error) {
    console.error("Failed to create Swapping Approve Transaction:", error.message);
  }
}
