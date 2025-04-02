
import React, { createContext, useContext, FC, ReactNode, useState, useMemo } from 'react';

// Mock wallet adapter context
interface WalletContextState {
  connected: boolean;
  publicKey: { toBase58: () => string } | null;
  connecting: boolean;
  disconnect: () => Promise<void>;
  connect: () => Promise<void>;
  wallet: any | null;
}

const WalletContext = createContext<WalletContextState>({
  connected: false,
  publicKey: null,
  connecting: false,
  disconnect: async () => {},
  connect: async () => {},
  wallet: null,
});

export const useWallet = () => useContext(WalletContext);

export const WalletProvider: FC<{
  children: ReactNode;
  wallets: any[];
  autoConnect?: boolean;
}> = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<{ toBase58: () => string } | null>(null);

  const value = useMemo(() => ({
    connected,
    publicKey,
    connecting: false,
    disconnect: async () => {
      setConnected(false);
      setPublicKey(null);
    },
    connect: async () => {
      setConnected(true);
      setPublicKey({
        toBase58: () => "8xMJLgUHdVeuYgC8sQsFbTFLwwRbWe6Dj2DHrUJmYN8R" // Mock address
      });
    },
    wallet: null,
  }), [connected, publicKey]);

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

export const ConnectionProvider: FC<{
  children: ReactNode;
  endpoint: string;
}> = ({ children }) => {
  return <>{children}</>;
};

export const WalletModalProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  return <>{children}</>;
};

export const PhantomWalletAdapter = class {
  constructor() {
    // Mock constructor
  }
};

export const clusterApiUrl = (network: string) => {
  return `https://api.${network}.solana.com`;
};
