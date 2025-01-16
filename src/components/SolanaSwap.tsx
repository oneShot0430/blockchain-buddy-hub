import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export const SolanaSwap = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const { toast } = useToast();
  const [amount, setAmount] = useState("");

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
    // This is a placeholder for demo purposes
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
      // Here you would implement the actual swap logic
      // This is a placeholder for demo purposes
      toast({
        title: "Swap Initiated",
        description: "Swap would happen here",
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
    <div className="flex flex-col items-center gap-6 p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
      <h2 className="text-2xl font-bold">Swap USDC to Meme Coins</h2>
      
      <div className="w-full max-w-md space-y-4">
        <WalletMultiButton className="w-full" />
        
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
          Swap to Meme Coins
        </Button>
      </div>
    </div>
  );
};