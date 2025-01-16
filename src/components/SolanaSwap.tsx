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
import { useState } from "react";

// Popular Solana meme coins with their symbols and names
const MEME_COINS = [
  { symbol: "BONK", name: "Bonk" },
  { symbol: "MYRO", name: "Myro" },
  { symbol: "WIF", name: "Wif" },
  { symbol: "POPCAT", name: "Pop Cat" },
  { symbol: "SAMO", name: "Samoyedcoin" },
] as const;

export const SolanaSwap = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [selectedCoin, setSelectedCoin] = useState<string>(MEME_COINS[0].symbol);

  const checkUSDCBalance = async () => {
    if (!publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    // Here you would implement the actual USDC balance check
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
              {MEME_COINS.map((coin) => (
                <SelectItem key={coin.symbol} value={coin.symbol}>
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