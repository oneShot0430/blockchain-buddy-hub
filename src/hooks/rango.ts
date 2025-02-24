import axios from 'axios';
import { BrowserProvider} from "ethers";
import { API_KEY } from '@/const/const';
const RANGO_URL = "https://api.rango.exchange";

const getRoute = async (
  fromChain:string, 
  toChain:string, 
  fromSymbol: string, 
  toSymbol: string, 
  fromToken: string,
  toToken: string,
  amount: string,
) => {
  const url = `${RANGO_URL}/routing/best?apiKey=${API_KEY}`;

  const options = {
    method: 'POST',
    headers: {accept: '*/*', 'content-type': 'application/json'},
    body: JSON.stringify({
      from: {
        blockchain: fromChain,
        symbol: fromSymbol,
        address: fromToken
      },
      to: {
        blockchain: toChain,
        symbol: toSymbol,
        address: toToken
      },
      checkPrerequisites: false,
      amount: amount
    })
  };
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json();
    return result; // Return the result here
  } catch (error) {
    console.error('Error:', error);
    throw error; // Re-throw the error for the caller to handle
  }
}

const createRangoTransaction = async (requestId: string, step: number, slippage: number) => {
  const url = `${RANGO_URL}/tx/create?apiKey=${API_KEY}`;
  const options = {
    method: 'POST',
    headers: {accept: '*/*', 'content-type': 'application/json'},
    body: JSON.stringify({
      userSettings: {slippage: slippage, infiniteApprove: false},
      validations: {balance: true, fee: true, approve: true},
      step: step,
      requestId: requestId
    })
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json();
    return result; // Return the result here
  } catch (error) {
    console.error('Error:', error);
    throw error; // Re-throw the error for the caller to handle
  }
}

const confirmRoute = async (requestId: string, fromChain: string, toChain: string, fromAddress: string, toAddress: string) => {
  const url = `${RANGO_URL}/routing/confirm?apiKey=${API_KEY}`;
  const options = {
    method: 'POST',
    headers: {accept: '*/*', 'content-type': 'application/json'},
    body: JSON.stringify({
      selectedWallets: {
        [fromChain]: fromAddress,
        [toChain]: toAddress,
      },
      requestId: requestId
    })
  };
  console.log("options:", options);
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json();
    return result; // Return the result here
  } catch (error) {
    console.error('Error:', error);
    throw error; // Re-throw the error for the caller to handle
  }
}

const checkStatus = async ( requestId: string, txId: string, step: number) => {
  const url = `${RANGO_URL}/tx/check-status?apiKey=${API_KEY}`;
  const options = {
    method: 'POST',
    headers: {accept: '*/*', 'content-type': 'application/json'},
    body: JSON.stringify({
      requestId: requestId,
      txId: txId,
      step: step
    })
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json();
    return result; // Return the result here
  } catch (error) {
    console.error('Error:', error);
    throw error; // Re-throw the error for the caller to handle
  }
}

const checkApprovalTx = async (requestId: string, txHash: string) => {
  const url = `${RANGO_URL}/tx/${requestId}/check-approval?txId=${txHash}&apiKey=${API_KEY}`;
  const options = {method: 'GET', headers: {accept: '*/*'}};

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json();
    return result; // Return the result here
  } catch (error) {
    console.error('Error:', error);
    throw error; // Re-throw the error for the caller to handle
  }
}

export const swap_rango = async (
  fromChain: string, 
  toChain: string, 
  fromSymbol: string, 
  toSymbol: string, 
  fromToken: string, 
  toToken: string, 
  fromAmount: string, 
  toAddress: string
) => {
  try {
    if (!window.ethereum) return;
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    console.log("Signer:", signer);
    const routes = await getRoute(  
      fromChain, 
      toChain, 
      fromSymbol, 
      toSymbol, 
      fromToken,
      toToken,
      fromAmount
    );
    console.log("routes:", routes);

    
    const confirmResponse = await confirmRoute(routes.requestId, fromChain, toChain, signer.address, toAddress);
    const confirmedRoute = confirmResponse.result;
    console.log("confirmed Route:", confirmedRoute);

    if (!confirmedRoute) {
      throw new Error(`Error in confirming route, ${confirmResponse.error}`)
    }
    
    let step = 1;

    const swapSteps = confirmedRoute.result?.swaps || [];
    
    const transactionResponse = await createRangoTransaction(confirmedRoute.requestId, 1, 1);
    console.log("transaction:", transactionResponse);
    const tx = transactionResponse.transaction;

    if (tx.isApprovalTx) {
      // sign the approve transaction
      const approveTransaction = {
        from: tx.from,
        to: tx.to,
        data: tx.data,
        value: tx.value,
        maxFeePerGas: tx.maxFeePerGas,
        maxPriorityFeePerGas: tx.maxPriorityFeePerGas,
        gasPrice: tx.gasPrice,
        gasLimit: tx.gasLimit,
        chainId: 8453,
      }
      const { hash } = await signer.sendTransaction(approveTransaction);
      console.log("txHash:", hash);

      // wait for approval
      while (true) {
        // await setTimeout(5000)
        await setTimeout(() => {}, 5000);
        const { isApproved, currentApprovedAmount, requiredApprovedAmount, txStatus } = await checkApprovalTx(confirmedRoute.requestId, hash)
        if (isApproved)
          break
        else if (txStatus === "failed")
          throw new Error('Approve transaction failed in blockchain')
        else if (txStatus === "success")
          throw new Error(`Insufficient approve, current amount: ${currentApprovedAmount}, required amount: ${requiredApprovedAmount}`)
      }
    }


    const mainTransaction = {
      from: tx.from,
      to: tx.to,
      data: tx.data,
      value: tx.value,
      maxFeePerGas: tx.maxFeePerGas,
      maxPriorityFeePerGas: tx.maxPriorityFeePerGas,
      gasPrice: tx.gasPrice,
      gasLimit: tx.gasLimit,
      chainId: 8453,
    };
    let status: any;
    while (true) {
      await setTimeout(() => {}, 10000);
      const { hash } = await signer.sendTransaction(mainTransaction);
      console.log("txHash:", hash);
      const state = await checkStatus(confirmedRoute.result.requestId, hash, 1);
      console.log("txState:", state);
      if (state.status === "success") {status = state.status; break;}
      else if (state.status === "failed") {status = state.status; throw new Error(`Swap failed`)}
    }

    return `Swap ${status}`;
  } catch (error) {
    console.log("error occured: ", error);
  }
}