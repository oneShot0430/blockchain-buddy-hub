import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { BrowserProvider, formatEther } from "ethers";
import { Wallet } from "lucide-react";
import { useState } from "react";

export const WalletConnect = () => {
  const [address, setAddress] = useState<string>("");
  const [balance, setBalance] = useState<string>("");
  const { toast } = useToast();

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        toast({
          title: "Metamask not found",
          description: "Please install Metamask browser extension",
          variant: "destructive",
        });
        return;
      }

      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const account = accounts[0];
      setAddress(account);

      const balance = await provider.getBalance(account);
      setBalance(formatEther(balance));

      toast({
        title: "Wallet Connected",
        description: "Successfully connected to your wallet",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to wallet",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Button
        onClick={connectWallet}
        className="flex items-center gap-2 bg-primary hover:bg-primary/90"
      >
        <Wallet className="h-4 w-4" />
        {address ? "Connected" : "Connect Wallet"}
      </Button>
      {address && (
        <div className="gradient-card p-4 rounded-lg glow-effect">
          <p className="text-sm text-muted-foreground">
            Address: {address.slice(0, 6)}...{address.slice(-4)}
          </p>
          <p className="text-sm text-muted-foreground">
            Balance: {parseFloat(balance).toFixed(4)} ETH
          </p>
        </div>
      )}
    </div>
  );
};