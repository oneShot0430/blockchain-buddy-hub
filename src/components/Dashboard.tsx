import { useWallet } from "@/lib/mock/solana-wallet-adapter";
import { 
  Search, 
  ChevronUp, 
  ChevronDown, 
  LayoutDashboard, 
  Wallet, 
  Settings, 
  FileText, 
  MoreVertical, 
  RefreshCw, 
  TrendingUp, 
  Clock, 
  CreditCard, 
  DollarSign,
  ArrowUp, 
  ArrowDown,
  Sun,
  Moon,
  ExternalLink
} from "lucide-react";
import { BrowserProvider } from "ethers";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useQuery } from "@tanstack/react-query";
import { fetchRaydiumTokens, fetchMemeOnBaseTokenList } from "@/hooks/fetchToken";
import { useEffect, useState } from "react";
import { getTokenData } from "@/hooks/getTokenData";
import { CMCResult } from "@/type/interface";
import { defaultData, DEXSCREENER_URL } from "@/const/const";
import { useNavigate } from "react-router-dom";
import { WalletConnect } from "@/components/WalletConnect";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { SideBarPanel } from "./Sidebar";

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `$${(num / 1000000).toFixed(2)}M`;
  } else if (num >= 1000) {
    return `$${(num / 1000).toFixed(2)}K`;
  } else {
    return `$${num.toFixed(2)}`;
  }
};

export const Dashboard = () => {
  const navigate = useNavigate();
  const { data: memeCoins, isLoading, error } = useQuery({
    queryKey: ['raydiumTokens'],
    queryFn: fetchMemeOnBaseTokenList,
  });

  const [coinData, setCoinData] = useState<CMCResult[]>(defaultData);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalToken, setTotalToken] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [pubAddress, setPubAddress] = useState("");
  const itemsPerPage = 50;

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleTokenClick = (symbol: string) => {
    navigate(`/token/${symbol}`);
  };

  const handleDexScreenerClick = (data: CMCResult, e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`${DEXSCREENER_URL}${data.platform.name.toLowerCase()}/${data.contract}`, '_blank');
  };

  useEffect(() => {
    const getBalance = async () => {
      if (!window.ethereum) return;
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      setPubAddress(signer.address);
    }

    getBalance();
  }, [window.ethereum]);

  useEffect(() => {
    const fetchCMCData = async () => {
      if (!memeCoins || memeCoins.length === 0) return;
      const filteredCoins = memeCoins.filter(coin => 
        coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setTotalPages(Math.ceil(filteredCoins.length / itemsPerPage));
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const tokensymbols = filteredCoins.map(token => token.symbol);
      const cmcResult = await getTokenData(tokensymbols.slice(startIndex, endIndex));
      
      if (cmcResult && cmcResult.length > 0) {
        const updatedCMCResult = cmcResult.map((token: CMCResult) => {
          const memeCoin = filteredCoins.find(meme => meme.symbol === token.symbol);       
          return {
            ...token,
            logo_uri: memeCoin?.logoURI || "",
          };
        });
        setCoinData(updatedCMCResult);
      }
    };
    fetchCMCData();
  }, [memeCoins, searchQuery, currentPage]);

  useEffect(() => {
    if (memeCoins) {
      setTotalToken(memeCoins.length);
    }
  }, [memeCoins]);

  const getPageNumbers = () => {
    const visiblePages = 5;
    const pages = [];
    
    if (totalPages <= visiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);

    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    if (currentPage <= 3) {
      endPage = Math.min(visiblePages - 1, totalPages - 1);
    }

    if (currentPage >= totalPages - 2) {
      startPage = Math.max(2, totalPages - 3);
    }

    if (startPage > 2) {
      pages.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages - 1) {
      pages.push('...');
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-[#1A1F2C] text-white">
        <SideBarPanel />
        <div className="text-center p-4 text-white bg-[#1A1F2C]">Loading coins...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen bg-[#1A1F2C] text-white">
        <SideBarPanel />
        <div className="text-center p-4 text-white bg-[#1A1F2C]">Error loading coins</div>
      </div>
    )
   }

  return (
    <div className="flex h-screen bg-[#1A1F2C] text-white">
      <SideBarPanel />
      <div className="flex-1 overflow-auto">
        <div className="px-8 py-6 border-b border-gray-800">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-[#9b87f5]">Hi Trader</h1>
              <p className="text-gray-400">Auto-invest in alpha with one-click</p>
              <div className="flex items-center mt-2 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                <span className="text-gray-300">You and <span className="text-[#9b87f5]">433+</span> others trading today</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
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

        <div className="grid grid-cols-4 gap-6 p-6">
          <div className="bg-[#1E2538] rounded-lg p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-gray-400">Active Trades</h3>
              <TrendingUp className="h-5 w-5 text-[#9b87f5]" />
            </div>
            <div className="text-3xl font-bold">0</div>
            <div className="w-full h-1 bg-gray-700 mt-2">
              <div className="h-1 bg-[#9b87f5] w-0"></div>
            </div>
          </div>
          <div className="bg-[#1E2538] rounded-lg p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-gray-400">24h Performance</h3>
              <TrendingUp className="h-5 w-5 text-[#9b87f5]" />
            </div>
            <div className="text-3xl font-bold">0.0%</div>
            <div className="text-sm text-gray-400">$0.00</div>
          </div>
          <div className="bg-[#1E2538] rounded-lg p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-gray-400">Auto-Invested</h3>
              <Clock className="h-5 w-5 text-[#9b87f5]" />
            </div>
            <div className="text-3xl font-bold text-[#9b87f5]">$0.00</div>
            <div className="text-sm text-gray-400">0 transactions</div>
          </div>
          <div className="bg-[#1E2538] rounded-lg p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-gray-400">Available Balance</h3>
              <DollarSign className="h-5 w-5 text-[#9b87f5]" />
            </div>
            <div className="p-6 bg-[#1A1F2C] rounded-md flex items-center justify-center">
              <span className="text-gray-400">All chains combined</span>
            </div>
          </div>
        </div>

        <div className="mx-6 mb-6 bg-[#1E2538] rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-800 flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center">
              <span className="mr-2">Top Performing Tokens</span>
              <div className="w-32 h-1 bg-[#9b87f5]"></div>
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Auto-updates: 2 min</span>
              <RefreshCw className="h-4 w-4 text-[#9b87f5]" />
              <MoreVertical className="h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#1A1F2C] text-gray-400 text-xs uppercase">
                <tr>
                  <th className="px-6 py-3 text-left">Token</th>
                  <th className="px-6 py-3 text-left">Price</th>
                  <th className="px-6 py-3 text-left">1h Change</th>
                  <th className="px-6 py-3 text-left">24h Change</th>
                  <th className="px-6 py-3 text-left">Volume (24h)</th>
                  <th className="px-6 py-3 text-left">Market Cap</th>
                  <th className="px-6 py-3 text-left">CMC Ranking</th>
                  <th className="px-6 py-3 text-left">Auto-Invest</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {coinData.map((data, index) => (
                  (data.market_cap > 200000000) && 
                  <tr 
                    key={index} 
                    onClick={() => handleTokenClick(data.symbol)}
                    className="cursor-pointer hover:bg-[#222533] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="ml-2">
                          <div className="font-medium">{data.name}</div>
                          <div className="text-sm text-gray-400">{data.symbol}</div>
                          <Button 
                            variant="dexscreener" 
                            size="xs"
                            className="flex items-center gap-1 rounded py-1 px-2"
                            onClick={(e) => handleDexScreenerClick(data, e)}
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span>View on DEXScreener</span>
                          </Button>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">${data.price.toFixed(7)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`text-sm flex items-center gap-1 ${data.change_24h < 0 ? "text-red-500" : "text-green-500"}`}>
                        {data.change_24h < 0 ? (
                          <ArrowDown className="h-4 w-4" />
                        ) : (
                          <ArrowUp className="h-4 w-4" />
                        )}
                        {Math.abs(data.change_24h).toFixed(2)}%
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`text-sm flex items-center gap-1 ${data.change_7d < 0 ? "text-red-500" : "text-green-500"}`}>
                        {data.change_7d < 0 ? (
                          <ArrowDown className="h-4 w-4" />
                        ) : (
                          <ArrowUp className="h-4 w-4" />
                        )}
                        {Math.abs(data.change_7d).toFixed(2)}%
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">{formatNumber(data.volume_24h)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">{formatNumber(data.market_cap)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-2 w-20 bg-gray-700 rounded">
                          <div 
                            className="h-2 bg-[#9b87f5] rounded" 
                            style={{ width: `${Math.min(100, (data.social_score / 100) * 100)}%` }} 
                          />
                        </div>
                        <span className="ml-2 text-sm">{data.social_score}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Button 
                        variant="autoinvest" 
                        size="xs"
                        className="text-xs py-1 px-3"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        Auto-invest $10
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-gray-800 bg-[#1A1F2C]">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className={`${currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} bg-[#1E2538] border-none text-gray-300`}
                  />
                </PaginationItem>
                {getPageNumbers().map((page, index) => (
                  <PaginationItem key={index}>
                    {page === '...' ? (
                      <span className="px-4 py-2 text-gray-400">...</span>
                    ) : (
                      <PaginationLink
                        onClick={() => typeof page === 'number' && setCurrentPage(page)}
                        isActive={currentPage === page}
                        className={`${typeof page === 'number' ? 'cursor-pointer' : ''} ${
                          currentPage === page ? 'bg-[#7E69AB] text-white' : 'bg-[#1E2538] text-gray-300'
                        } border-none`}
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className={`${currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"} bg-[#1E2538] border-none text-gray-300`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  );
};
