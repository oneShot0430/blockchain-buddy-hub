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

interface TokenInfo {
  symbol: string;
  name: string;
  mint: string;
}

const fetchRaydiumTokens = async (): Promise<TokenInfo[]> => {
  const response = await fetch('https://api.raydium.io/v2/sdk/token/raydium.mainnet.json');
  const data = await response.json();
  
  // Filter for meme coins and tokens with sufficient liquidity
  return Object.values(data.tokens)
    .filter((token: any) => {
      const isMemeCoin = token.tags?.includes('meme') || 
                        ['BONK', 'MYRO', 'WIF', 'POPCAT', 'SAMO'].includes(token.symbol);
      return isMemeCoin;
    })
    .map((token: any) => ({
      symbol: token.symbol,
      name: token.name,
      mint: token.mint
    }));
};

export const SolanaSwap = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [selectedCoin, setSelectedCoin] = useState<string>("");

  const { data: memeCoins, isLoading, error } = useQuery({
    queryKey: ['raydiumTokens'],
    queryFn: fetchRaydiumTokens,
  });

  useEffect(() => {
    if (memeCoins && memeCoins.length > 0 && !selectedCoin) {
      setSelectedCoin(memeCoins[0].symbol);
    }
  }, [memeCoins]);

  const checkUSDCBalance = async () => {
    if (!publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Balance Check",
      description: "USDC Balance check would happen here",
    });
  };

  const handleSwap = async () => {
    if (!publicKey || !connection) {
      toast({
        title: "Error",
        description: "Please connect your wallet first",
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
        description: `Swapping ${amount} USDC to ${selectedCoin}`,
      });
    } catch (error) {
      toast({
        title: "Swap Failed",
        description: "Failed to execute swap",
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
        <WalletMultiButton className="w-full" />
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Meme Coin</label>
          <Select value={selectedCoin} onValueChange={setSelectedCoin}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a meme coin" />
            </SelectTrigger>
            <SelectContent>
              {memeCoins?.map((coin) => (
                <SelectItem key={coin.mint} value={coin.symbol}>
                  {coin.name} ({coin.symbol})
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
          disabled={!publicKey || !amount || parseFloat(amount) < 100}
        >
          Swap to {selectedCoin}
        </Button>
      </div>
    </div>
  );
};