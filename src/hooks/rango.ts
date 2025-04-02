
import { RangoClient } from "rango-sdk";
import { TransactionRequest, BrowserProvider } from "ethers";
import { setTimeout } from 'timers/promises';
import { findToken } from "@/lib/meta";
import { RANGO_API_KEY } from "@/const/const";

// Define transaction types and statuses
const TransactionType = {
  EVM: 'EVM',
};

const TransactionStatus = {
  FAILED: 'FAILED',
  SUCCESS: 'SUCCESS',
  PENDING: 'PENDING',
};

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
  if (!window.ethereum) return "No Ethereum wallet detected";
  
  try {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    console.log("Signer:", signer.address);

    // Initialize Rango SDK client
    const rango = new RangoClient(RANGO_API_KEY);

    // Get blockchains and tokens metadata
    const meta = await rango.getAllMetadata();

    // Find selected tokens in meta.tokens
    const sourceToken = findToken(meta.tokens, fromChain, fromToken);
    const targetToken = findToken(meta.tokens, toChain, toToken);

    if (!sourceToken || !targetToken) {
      throw new Error("Source or target token not found");
    }

    // Get route
    const routingRequest = {
      from: sourceToken,
      to: targetToken,
      amount: fromAmount,
      slippage: '1.0',
    };
    
    const routingResponse = await rango.getAllRoutes(routingRequest);
    if (routingResponse.results.length === 0) {
      throw new Error(`No route found: ${routingResponse.error}`);
    }

    // Confirm one of the routes
    const selectedRoute = routingResponse.results[0];

    const selectedWallets = selectedRoute.swaps
      .flatMap(swap => [swap.from.blockchain, swap.to.blockchain])
      .filter((blockchain, index, self) => self.indexOf(blockchain) === index)
      .map(blockchain => ({ [blockchain]: signer.address }))
      .reduce((acc, obj) => {
        return { ...acc, ...obj };
      }, {});

    const confirmResponse = await rango.confirmRoute({
      requestId: selectedRoute.requestId,
      selectedWallets,
    });

    const confirmedRoute = confirmResponse.result;

    if (!confirmedRoute) {
      throw new Error(`Error in confirming route: ${confirmResponse.error}`);
    }

    let step = 1;
    const swapSteps = confirmedRoute.result?.swaps || [];
    
    for (const swap of swapSteps) {
      const request = {
        requestId: confirmedRoute.requestId,
        step: step,
        userSettings: {
          slippage: '1.0',
          infiniteApprove: false
        },
        validations: {
          approve: true,
          balance: false,
          fee: false,
        }
      };
      
      let createTransactionResponse = await rango.createTransaction(request);
      let tx = createTransactionResponse.transaction;
      
      if (!tx) {
        throw new Error(`Error creating the transaction: ${createTransactionResponse.error}`);
      }

      if (tx.type === TransactionType.EVM) {
        if (tx.isApprovalTx) {
          // Sign the approve transaction
          const approveTransaction: TransactionRequest = {
            from: tx.from,
            to: tx.to,
            data: tx.data,
            value: tx.value,
            maxFeePerGas: tx.maxFeePerGas,
            maxPriorityFeePerGas: tx.maxPriorityFeePerGas,
            gasPrice: tx.gasPrice,
            gasLimit: tx.gasLimit,
          };
          
          const { hash } = await signer.sendTransaction(approveTransaction);

          // Wait for approval
          while (true) {
            await setTimeout(5_000);
            const { isApproved, currentApprovedAmount, requiredApprovedAmount, txStatus } = 
              await rango.checkApproval(confirmedRoute.requestId, hash);
              
            if (isApproved)
              break;
            else if (txStatus === TransactionStatus.FAILED)
              throw new Error('Approve transaction failed in blockchain');
            else if (txStatus === TransactionStatus.SUCCESS)
              throw new Error(`Insufficient approve, current amount: ${currentApprovedAmount}, required amount: ${requiredApprovedAmount}`);
          }

          // Create the main transaction if previous one was approval transaction
          createTransactionResponse = await rango.createTransaction(request);
          tx = createTransactionResponse.transaction;
          
          if (!tx || tx.type !== TransactionType.EVM) {
            throw new Error(`Error creating the transaction: ${createTransactionResponse.error}`);
          }
        }

        // Sign the main transaction
        const mainTransaction: TransactionRequest = {
          from: tx.from,
          to: tx.to,
          data: tx.data,
          value: tx.value,
          maxFeePerGas: tx.maxFeePerGas,
          maxPriorityFeePerGas: tx.maxPriorityFeePerGas,
          gasPrice: tx.gasPrice,
          gasLimit: tx.gasLimit,
        };
        
        const { hash } = await signer.sendTransaction(mainTransaction);
        
        // Track swap status
        while (true) {
          await setTimeout(10_000);
          const state = await rango.checkStatus({
            requestId: confirmedRoute.requestId,
            step,
            txId: hash
          });

          const status = state.status;
          if (status === TransactionStatus.SUCCESS) {
            step += 1;
            break;
          } else if (status === TransactionStatus.FAILED) {
            throw new Error(`Swap failed on step ${step}`);
          }
        }
      }
    }
    
    return "Swap completed successfully";
  } catch (error) {
    console.error("Swap error:", error);
    return `Swap failed: ${error instanceof Error ? error.message : String(error)}`;
  }
};
