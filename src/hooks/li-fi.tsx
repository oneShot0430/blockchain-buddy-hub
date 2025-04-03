import axios from 'axios';
import { BrowserProvider} from "ethers";

const LI_FI_URL = "https://li.quest/v1";
const getQuote = async (fromChain: String, toChain: String, fromToken: String, toToken: String, fromAmount: Number, fromAddress: String, toAddress: String) => {
  const result = await axios.get(`${LI_FI_URL}/quote`, {
      params: {
          fromChain,
          toChain,
          fromToken,
          toToken,
          fromAddress,
          toAddress,
          fromAmount,
      }
  });
  return result.data;
}

const getStatus = async (bridge: any, fromChain: String, toChain: String, txHash: String) => {
  const result = await axios.get(`${LI_FI_URL}/status`, {
      params: {
          bridge,
          fromChain,
          toChain,
          txHash,
      }
  });
  return result.data;
}

export const transfer = async (fromChain: String, toChain: String, fromToken: String, toToken: String, fromAmount: Number, toAddress: String) => {
  if (!window.ethereum) return;
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const quote = await getQuote(fromChain, toChain, fromToken, toToken, fromAmount, signer.address, toAddress);
  const tx = await signer.sendTransaction(quote.transactionRequest);
  await tx.wait();

  let result: any;
  if (fromChain !== toChain) {
    do {
        result = await getStatus(quote.tool, fromChain, toChain, tx.hash);
    } while (result.status !== 'DONE' && result.status !== 'FAILED')
  
  return {result, tx};
}
}
// const fromChain = 'DAI';
// const fromToken = 'USDC';
// const toChain = 'POL';
// const toToken = 'USDC';
// const fromAmount = '1000000';
// const fromAddress = YOUR_WALLET_ADDRESS;

// const quote = await getQuote(fromChain, toChain, fromToken, toToken, fromAmount, fromAddress);

