import { RangoClient, } from "rango-sdk";
import { TransactionRequest, ethers, BrowserProvider } from "ethers";
import { setTimeout } from 'timers/promises'
import { findToken } from "@/lib/meta";

// Hardcoded transaction types and statuses (replace these with actual values from the SDK if available)
const TransactionType = {
  EVM: 'EVM', // Example value for EVM transactions
};

const TransactionStatus = {
  FAILED: 'FAILED', // Example value for failed transactions
  SUCCESS: 'SUCCESS', // Example value for successful transactions
};

export const performTokenSwap = async (
  fromChain: string, 
  toChain: string, 
  fromSymbol: string, 
  toSymbol: string, 
  fromToken: string, 
  toToken: string, 
  fromAmount: string, 
  toAddress: string
) => {
    if (!window.ethereum) return;
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    console.log("Signer:", signer);

  // initiate sdk using your api key
  const API_KEY = "c6381a79-2817-4602-83bf-6a641a409e32"
  const rango = new RangoClient(API_KEY)

  // get blockchains and tokens meta data
  const meta = await rango.getAllMetadata()

  // find selected tokens in meta.tokens
  const sourceToken = findToken(meta.tokens, fromChain, fromToken)
  const targetToken = findToken(meta.tokens, toChain, toToken)

  // get route
  const routingRequest = {
    from: sourceToken,
    to: targetToken,
    amount: fromAmount,
    slippage: '1.0',
  }
  const routingResponse = await rango.getAllRoutes(routingRequest)
  if (routingResponse.results.length === 0) {
    throw new Error(`There was no route! ${routingResponse.error}`)
  }

  // confirm one of the routes
  const selectedRoute = routingResponse.results[0]

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
  })

  const confirmedRoute = confirmResponse.result

  if (!confirmedRoute) {
    throw new Error(`Error in confirming route, ${confirmResponse.error}`)
  }

  let step = 1
  const swapSteps = confirmedRoute.result?.swaps || []
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
    }
    let createTransactionResponse = await rango.createTransaction(request)
    let tx = createTransactionResponse.transaction
    if (!tx) {
      throw new Error(`Error creating the transaction ${createTransactionResponse.error}`)
    }

    if (tx.type === TransactionType.EVM) {
      if (tx.isApprovalTx) {
        // sign the approve transaction
        const approveTransaction: TransactionRequest = {
          from: tx.from,
          to: tx.to,
          data: tx.data,
          value: tx.value,
          maxFeePerGas: tx.maxFeePerGas,
          maxPriorityFeePerGas: tx.maxPriorityFeePerGas,
          gasPrice: tx.gasPrice,
          gasLimit: tx.gasLimit,
        }
        // const { hash } = await walletWithProvider.sendTransaction(approveTransaction);
        const { hash } = await signer.sendTransaction(approveTransaction);

        // wait for approval
        while (true) {
          await setTimeout(5_000)
          const { isApproved, currentApprovedAmount, requiredApprovedAmount, txStatus } = await rango.checkApproval(confirmedRoute.requestId, hash)
          if (isApproved)
            break
          else if (txStatus === TransactionStatus.FAILED)
            throw new Error('Approve transaction failed in blockchain')
          else if (txStatus === TransactionStatus.SUCCESS)
            throw new Error(`Insufficient approve, current amount: ${currentApprovedAmount}, required amount: ${requiredApprovedAmount}`)
        }

        // create the main transaction if previous one was approval transaction
        createTransactionResponse = await rango.createTransaction(request)
        tx = createTransactionResponse.transaction
        if (!tx || tx.type !== TransactionType.EVM) {
          throw new Error(`Error creating the transaction ${createTransactionResponse.error}`)
        }
      }

      // sign the main transaction
      const mainTransaction: TransactionRequest = {
        from: tx.from,
        to: tx.to,
        data: tx.data,
        value: tx.value,
        maxFeePerGas: tx.maxFeePerGas,
        maxPriorityFeePerGas: tx.maxPriorityFeePerGas,
        gasPrice: tx.gasPrice,
        gasLimit: tx.gasLimit,
      }
      // const { hash } = await walletWithProvider.sendTransaction(mainTransaction);
      const { hash } = await signer.sendTransaction(mainTransaction);
      
      // track swap status
      while (true) {
        await setTimeout(10_000)
        const state = await rango.checkStatus({
          requestId: confirmedRoute.requestId,
          step,
          txId: hash
        })

        const status = state.status
        if (status === TransactionStatus.SUCCESS) {
          // we could proceed with the next step of the route
          step += 1;
          break
        } else if (status === TransactionStatus.FAILED) {
          throw new Error(`Swap failed on step ${step}`)
        }
      }
    }
  }
}

// Example usage
performTokenSwap(
  "BSC", 
  "BSC", 
  "USDT", 
  "BNB", 
  "0x55d398326f99059ff775485246999027b3197955", 
  null, 
  "0.001", 
  "0xYourWalletAddress"
).catch(console.error);