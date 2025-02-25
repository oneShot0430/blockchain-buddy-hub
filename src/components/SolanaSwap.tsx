
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CoinSelete } from "./SelectedCoin";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { transfer } from "@/hooks/li-fi";
import { swap_rango } from "@/hooks/rango";
import { USDC } from "@/const/const";
import { TokenInfo } from "@/type/interface";
import { fetchRaydiumTokens, fetchBaseTokenList } from "@/hooks/fetchToken";
import { BRETT } from "@/const/const";
import { performTokenSwap } from "@/hooks/swap";

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
    logoURI: "",
    coingeckoId: ""
  });
  const [selectedBaseCoin, setSelectedBaseCoin] = useState<TokenInfo>({
    symbol: "",
    name: "",
    mint: "",
    address: "",
    logoURI: "",
    coingeckoId:""
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryOnBase, setSearchQueryOnBase] = useState("");

  const { data: memeCoins, isLoading, error } = useQuery({
    queryKey: ['raydiumTokens'],
    queryFn: fetchRaydiumTokens,
  });

  const { data: BaseTokens, isLoading: isBaseCoinFetchLoading, error: baseCoinFetchError } = useQuery({
    queryKey: ['BaseTokens'],
    queryFn: fetchBaseTokenList,
  });

  const [filteredCoins, setFilteredCoins] = useState(memeCoins);

  const [filteredBaseCoins, setFilteredBaseCoins] = useState(BaseTokens);

  useEffect(() => {
    setFilteredCoins(memeCoins);
  }, [memeCoins]);

  useEffect(() => {
    console.log("BaseTokens", BaseTokens);
    setFilteredBaseCoins(BaseTokens);
  }, [BaseTokens]);

  useEffect(() => {
    const filtered = memeCoins?.filter((coin) =>
      coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCoins(filtered);
  }, [searchQuery]);

  useEffect(() => {
    const filtered = BaseTokens?.filter((coin) =>
      coin.name.toLowerCase().includes(searchQueryOnBase.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchQueryOnBase.toLowerCase())
    );
    setFilteredBaseCoins(filtered);
  }, [searchQueryOnBase]);

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
      const result = await swap_rango("BASE", "SOLANA", "USDC", BRETT.symbol, USDC, BRETT.mint, amount, receptionAddress);
      // await performTokenSwap("BASE", "SOLANA", "USDC", BRETT.symbol, USDC, BRETT.mint, amount, receptionAddress);
      toast({
        title: "Swap finished",
        description: "result",
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

  if (isLoading || isBaseCoinFetchLoading) {
    return <div className="text-center p-4">Loading coins...</div>;
  }

  if (error || baseCoinFetchError) {
    return <div className="text-center text-red-500 p-4">Error loading coins</div>;
  }

  return (
    <div className="flex flex-col items-center gap-6 p-6 rounded-lg bg-white border border-gray-200 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900">Swap USDC to Meme Coins</h2>
      
      <div className="w-full max-w-md space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Select Base Chain Coin</label>
          <CoinSelete 
            selectedCoin={selectedBaseCoin} 
            setSelectedCoin={setSelectedBaseCoin} 
            searchQuery={searchQueryOnBase} 
            setSearchQuery={setSearchQueryOnBase} 
            filteredCoins={filteredBaseCoins}
            placeholder={"Select Base Chain Coin"}
          />
        </div>
        <input
          type="text"
          value={receptionAddress}
          onChange={(e) => setReceptionAddress(e.target.value)}
          placeholder="Your Receiption Address..."
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Select Solana Meme Coin</label>
          <CoinSelete 
            selectedCoin={selectedCoin} 
            setSelectedCoin={setSelectedCoin} 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
            filteredCoins={filteredCoins}
            placeholder={"Select Solana Meme Coin"}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Amount (USDC)</label>
          <Input
            type="number"
            placeholder="Enter amount (min. 100 USDC)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="100"
            className="bg-white"
          />
        </div>

        <Button 
          onClick={handleSwap}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          disabled={
            !receptionAddress 
            || !amount 
            || parseFloat(amount) < 100
          }
        >
          Buy {selectedCoin.symbol || "Tokens"}
        </Button>
      </div>
    </div>
  );
};
