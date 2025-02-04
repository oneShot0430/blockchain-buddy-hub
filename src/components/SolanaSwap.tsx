import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { transfer } from "@/hooks/li-fi";
import { swap_rango } from "@/hooks/rango";
import { USDC, BRETT } from "@/const/const";

interface RaydiumToken {
  symbol: string;
  name: string;
  mint: string;
  tags?: string[];
  address: string;
  logoURI: string;
}

interface RaydiumResponse {
  tokens: {
    [key: string]: RaydiumToken;
  };
}

interface TokenInfo {
  symbol: string;
  name: string;
  mint: string;
  address: string;
  logoURI: string;
}

// const url = "https://api-v3.raydium.io/mint/list";
const url = "https://tokens.jup.ag/tokens?tags=lst,community";

const fetchRaydiumTokens = async (): Promise<TokenInfo[]> => {
  try {
    const response = await fetch(url);
    // console.log("response", response);
    if (!response.ok) {
      throw new Error('Failed to fetch tokens');
    }
    const data = await response.json();
    console.log("tokens list; ", data);
    // Filter for meme coins and tokens with sufficient liquidity
    return Object.values(data)
      .filter((token: RaydiumToken) => token.symbol && token.symbol.trim() !== '')
      .map((token: RaydiumToken) => ({
        symbol: token.symbol,
        name: token.name,
        mint: token.address,
        address: token.address,
        logoURI: token.logoURI
      }));
  } catch (error) {
    console.error('Error fetching Raydium tokens:', error);
    throw error;
  }
  // return [BRETT];
};

export const SolanaSwap = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const { toast } = useToast();
  const [receptionAddress, setReceptionAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedCoin, setSelectedCoin] = useState<TokenInfo>({
    symbol: "",
    name: "",
    mint: "",
    address: "",
    logoURI: ""
  });
  const [searchQuery, setSearchQuery] = useState("");
  const { data: memeCoins, isLoading, error } = useQuery({
    queryKey: ['raydiumTokens'],
    queryFn: fetchRaydiumTokens,
  });
  const [filteredCoins, setFilteredCoins] = useState(memeCoins);
  // console.log("coins list:", memeCoins, filteredCoins);
  useEffect(() => {
    setFilteredCoins(memeCoins);
  }, [memeCoins]);

  useEffect(() => {
    const filtered = memeCoins?.filter((coin) =>
      coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCoins(filtered);
  }, [searchQuery]);

  // const checkUSDCBalance = async () => {
  //   if (!publicKey) {
  //     toast({
  //       title: "Wallet not connected",
  //       description: "Please connect your wallet first",
  //       variant: "destructive",
  //     });
  //     return;
  //   }

  //   toast({
  //     title: "Balance Check",
  //     description: "USDC Balance check would happen here",
  //   });
  // };

  const handleSwap = async () => {
    if (!receptionAddress) {
      toast({
        title: "Error",
        description: "Please Enter Receiption Address..",
        variant: "destructive",
      });
      return;
    }

    if (parseFloat(amount) < 100) {
      toast({
        title: "Invalid amount",
        description: "Minimum swap amount is 100 USDC",
        variant: "destructive",
      });
      return;
    }

    try {
      toast({
        title: "Swap Initiated",
        description: `Swapping ${amount} USDC on Base to ${selectedCoin.symbol}`,
      });
      console.log("Selected Token:", selectedCoin, amount);
      const BUY_AMOUNT = Number(amount) * 1000000;
      const result = await swap_rango("BASE", "SOLANA", "USDC", selectedCoin.symbol, USDC, selectedCoin.mint, amount, receptionAddress);
      // const {result, tx} = await transfer("8453", "1151111081099710", USDC, selectedCoin.mint, BUY_AMOUNT, receptionAddress);
      // console.log(result, tx);
      toast({
        title: "Swap finished",
        description: result,
        variant: "destructive",
      });
    } catch (error) {
      toast({
        title: `Swap Failed: ${error}`,
        description: `Failed to execute swap: ${error}`,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="text-center p-4">Loading meme coins...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">Error loading meme coins</div>;
  }

  return (
    <div className="flex flex-col items-center gap-6 p-6 rounded-lg border gradient-card text-card-foreground shadow-sm">
      <h2 className="text-2xl font-bold">Swap USDC to Meme Coins</h2>
      
      <div className="w-full max-w-md space-y-4">
        {/* <WalletMultiButton className="w-full" /> */}
        <input
          type="text"
          value={receptionAddress}
          onChange={(e) => setReceptionAddress(e.target.value)}
          placeholder="Your Receiption Address..."
          className="w-full rounded-md border border-input bg-background px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Meme Coin</label>
          <Select value={selectedCoin} onValueChange={setSelectedCoin}>
            <SelectTrigger className="w-full">
              <SelectValue>
                {selectedCoin.symbol !=="" ? (
                  <div className="flex items-center">
                    <img
                      src={selectedCoin.logoURI}
                      alt={selectedCoin.name}
                      className="h-5 w-5 rounded-full mr-2"
                    />
                    {selectedCoin.name} ({selectedCoin.symbol})
                  </div>
                ) : (
                  <span className="text-gray-500">Select a meme coin</span> // Placeholder
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <div className="sticky top-0 z-10 bg-popover p-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search coins..."
                  className="w-full rounded-md border border-input bg-background px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              {filteredCoins?.map((coin) => (
                <SelectItem key={coin.mint} value={coin}>
                  <div className="flex items-center">
                    <img
                      src={coin.logoURI}
                      alt={coin.name}
                      className="h-5 w-5 rounded-full mr-2"
                    />
                    {coin.name} ({coin.symbol})
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Amount (USDC)</label>
          <Input
            type="number"
            placeholder="Enter amount (min. 100 USDC)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="100"
          />
        </div>

        <Button 
          onClick={handleSwap}
          className="w-full"
          disabled={
            !receptionAddress 
            || !amount 
            || parseFloat(amount) < 100
          }
        >
          Buy {selectedCoin.symbol}
        </Button>
      </div>
    </div>
  );
};