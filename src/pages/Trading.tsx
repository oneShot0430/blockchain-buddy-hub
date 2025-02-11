
import { WalletConnect } from "@/components/WalletConnect";
import { SolanaSwap } from "@/components/SolanaSwap";
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
import { Link } from "react-router-dom";
import "@solana/wallet-adapter-react-ui/styles.css";

const Trading = () => {
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
          <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
            <div className="dark:bg-background">
              <nav className="bg-white dark:bg-background/95 shadow dark:shadow-gray-800">
                <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between h-16">
                    <div className="flex items-center space-x-8">
                      <div className="flex-shrink-0">
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">ZEX BRIDGE</h1>
                      </div>
                      <div className="hidden sm:flex sm:space-x-4">
                        <Link to="/" className="px-3 py-2 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white">
                          Dashboard
                        </Link>
                        <Link to="/trading" className="px-3 py-2 text-gray-900 dark:text-white font-medium">
                          Trading
                        </Link>
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

              <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="w-full max-w-md mx-auto">
                  <SolanaSwap />
                </div>
              </div>
            </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default Trading;
