
// This is a mock implementation for Solana wallet adapter
import React, { createContext, useContext, useState } from 'react';

// Mock the WalletContext
const WalletContext = createContext<any>({});

// Mock connection context
const ConnectionContext = createContext<any>({});

export const WalletProvider = ({ children, wallets, autoConnect }: { children: React.ReactNode, wallets: any[], autoConnect: boolean }) => {
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState(null);

  const connect = async () => {
    setConnected(true);
    setPublicKey({ toBase58: () => "FakePublicKey123456789abcdef" });
    return true;
  };

  const disconnect = async () => {
    setConnected(false);
    setPublicKey(null);
    return true;
  };

  const sendTransaction = async (transaction: any) => {
    console.log("Mock sendTransaction called", transaction);
    return { 
      signature: "MockTransactionSignature1234567890abcdef",
      confirmTransaction: async () => true
    };
  };

  const signTransaction = async (transaction: any) => {
    console.log("Mock signTransaction called", transaction);
    return transaction;
  };

  const signAllTransactions = async (transactions: any[]) => {
    console.log("Mock signAllTransactions called", transactions);
    return transactions;
  };

  const value = {
    wallets,
    autoConnect,
    connected,
    connecting: false,
    disconnecting: false,
    publicKey,
    connect,
    disconnect,
    select: () => {},
    wallet: {
      adapter: {
        publicKey,
        connect,
        disconnect,
        sendTransaction,
        signTransaction,
        signAllTransactions
      }
    },
    sendTransaction,
    signTransaction,
    signAllTransactions
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

export const useWallet = () => useContext(WalletContext);

export const ConnectionProvider = ({ children, endpoint }: { children: React.ReactNode, endpoint: string }) => {
  const connection = {
    getBalance: async () => 1000000000,
    getRecentBlockhash: async () => ({ blockhash: "FakeBlockhash123456789abcdef" }),
    confirmTransaction: async () => ({ value: { err: null } }),
    getConfirmedSignaturesForAddress2: async () => [],
    getParsedTransactions: async () => []
  };

  return <ConnectionContext.Provider value={{ connection, endpoint }}>{children}</ConnectionContext.Provider>;
};

export const useConnection = () => {
  const { connection } = useContext(ConnectionContext);
  return { connection };
};

export const WalletModalProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export const clusterApiUrl = (network: string) => `https://api.${network}.solana.com`;

export class PhantomWalletAdapter {
  publicKey = null;
  connected = false;
  
  connect() {
    this.connected = true;
    this.publicKey = { toBase58: () => "FakePublicKey123456789abcdef" };
    return Promise.resolve();
  }
  
  disconnect() {
    this.connected = false;
    this.publicKey = null;
    return Promise.resolve();
  }
}
