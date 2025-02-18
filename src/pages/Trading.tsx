
import { SolanaSwap } from "@/components/SolanaSwap";
import {
  WalletProvider,
  ConnectionProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { useMemo, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "@solana/wallet-adapter-react-ui/styles.css";
import { Navbar } from "@/components/Navbar";
import { BrowserProvider, Contract } from "ethers";
import { USDC } from "@/const/const";

// USDC ABI for balanceOf function
const usdcAbi = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

const Trading = () => {
  const endpoint = useMemo(() => clusterApiUrl("devnet"), []);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [usdcBalance, setUsdcBalance] = useState<string>("");
  const location = useLocation();

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  useEffect(() => {
    const fetchUsdcBalance = async () => {
      if (window.ethereum) {
        try {
          const provider = new BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const usdcContract = new Contract(USDC, usdcAbi, provider);
          const balance = await usdcContract.balanceOf(await signer.getAddress());
          const decimals = await usdcContract.decimals();
          const formattedBalance = (Number(balance) / Math.pow(10, decimals)).toFixed(2);
          setUsdcBalance(formattedBalance);
        } catch (error) {
          console.error("Error fetching USDC balance:", error);
          setUsdcBalance("0.00");
        }
      }
    };

    fetchUsdcBalance();
    // Set up event listener for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', fetchUsdcBalance);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', fetchUsdcBalance);
      }
    };
  }, []);

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
                  {usdcBalance && window.ethereum && (
                    <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                      <p className="text-blue-600 font-medium">
                        Base Chain USDC Balance: {usdcBalance} USDC
                      </p>
                    </div>
                  )}
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
