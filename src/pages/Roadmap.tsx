
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

const Roadmap = () => {
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
                <div className="space-y-8">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Project Roadmap</h1>
                  
                  <div className="space-y-6">
                    <div className="glass-morphism p-6 rounded-lg">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Q1 2024</h2>
                      <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                        <li>• Launch of ZEX Bridge Beta</li>
                        <li>• Initial Token Integration</li>
                        <li>• Community Feedback Collection</li>
                      </ul>
                    </div>

                    <div className="glass-morphism p-6 rounded-lg">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Q2 2024</h2>
                      <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                        <li>• Advanced Trading Features</li>
                        <li>• Cross-chain Integration</li>
                        <li>• Security Audits</li>
                      </ul>
                    </div>

                    <div className="glass-morphism p-6 rounded-lg">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Q3 2024</h2>
                      <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                        <li>• Mobile App Development</li>
                        <li>• DEX Aggregator Integration</li>
                        <li>• Governance Implementation</li>
                      </ul>
                    </div>

                    <div className="glass-morphism p-6 rounded-lg">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Q4 2024</h2>
                      <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                        <li>• Global Marketing Campaign</li>
                        <li>• Enterprise Partnerships</li>
                        <li>• Advanced Analytics Dashboard</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default Roadmap;
