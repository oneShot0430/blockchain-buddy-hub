import { WalletConnect } from "@/components/WalletConnect";
import { SolanaSwap } from "@/components/SolanaSwap";
import {
  WalletProvider,
  ConnectionProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { useMemo } from "react";
// Import Solana wallet adapter styles
import "@solana/wallet-adapter-react-ui/styles.css";

const Index = () => {
  const endpoint = useMemo(() => clusterApiUrl("devnet"), []);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-2">ZEX BRIDGE</h1>
              <p className="text-muted-foreground">
                Connect your wallet and start transferring ETH or swap USDC for meme coins
              </p>
            </div>
            
            <WalletConnect />
            
            {/* <div className="w-full max-w-md">
              <TransferForm />
            </div> */}

            <div className="w-full max-w-md">
              <SolanaSwap />
            </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default Index;