
import { WalletConnect } from "@/components/WalletConnect";
import { SolanaSwap } from "@/components/SolanaSwap";
import { Dashboard } from "@/components/Dashboard";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  WalletProvider,
  ConnectionProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { useMemo, useState } from "react";
import "@solana/wallet-adapter-react-ui/styles.css";

const Index = () => {
  const endpoint = useMemo(() => clusterApiUrl("devnet"), []);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className={`min-h-screen ${isDarkMode ? 'dark' : ''} bg-gray-50`}>
            <nav className="bg-white shadow">
              <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                  <div className="flex">
                    <div className="flex-shrink-0 flex items-center">
                      <h1 className="text-xl font-bold text-gray-900">ZEX BRIDGE</h1>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleTheme}
                      className="rounded-full"
                    >
                      {isDarkMode ? (
                        <Sun className="h-5 w-5" />
                      ) : (
                        <Moon className="h-5 w-5" />
                      )}
                    </Button>
                    <WalletConnect />
                  </div>
                </div>
              </div>
            </nav>

            <Dashboard />

            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="w-full max-w-md mx-auto">
                <SolanaSwap />
              </div>
            </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default Index;
