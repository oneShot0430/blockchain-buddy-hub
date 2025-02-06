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
import { fetchRaydiumTokens } from "@/hooks/fetchToken";

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
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Base Chain Coin</label>
          <CoinSelete 
            selectedCoin={selectedCoin} 
            setSelectedCoin={setSelectedCoin} 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
            filteredCoins={filteredCoins}
            placeholder={"Select Base Chain Coin"}
          />
        </div>
        <input
          type="text"
          value={receptionAddress}
          onChange={(e) => setReceptionAddress(e.target.value)}
          placeholder="Your Receiption Address..."
          className="w-full rounded-md border border-input bg-background px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Solana Meme Coin</label>
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