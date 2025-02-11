
import { SolanaSwap } from "@/components/SolanaSwap";
import {
  WalletProvider,
  ConnectionProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import "@solana/wallet-adapter-react-ui/styles.css";
import { Navbar } from "@/components/Navbar";

const Trading = () => {
  const endpoint = useMemo(() => clusterApiUrl("devnet"), []);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();

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
              <Navbar
                isDarkMode={isDarkMode}
                toggleTheme={toggleTheme}
                currentPath={location.pathname}
              />
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
