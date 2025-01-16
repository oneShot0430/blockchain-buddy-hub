import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { BrowserProvider, parseEther } from "ethers";
import { Send } from "lucide-react";
import { useState } from "react";

export const TransferForm = () => {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!window.ethereum) return;

    setLoading(true);
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const tx = await signer.sendTransaction({
        to: recipient,
        value: parseEther(amount),
      });

      toast({
        title: "Transaction Sent",
        description: `Hash: ${tx.hash.slice(0, 6)}...${tx.hash.slice(-4)}`,
      });

      setRecipient("");
      setAmount("");
    } catch (error) {
      toast({
        title: "Transaction Failed",
        description: "Failed to send transaction",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleTransfer} className="space-y-4 w-full max-w-md">
      <Input
        placeholder="Recipient Address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        className="bg-secondary"
      />
      <Input
        placeholder="Amount (ETH)"
        type="number"
        step="0.0001"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="bg-secondary"
      />
      <Button
        type="submit"
        disabled={loading || !recipient || !amount}
        className="w-full flex items-center gap-2"
      >
        <Send className="h-4 w-4" />
        {loading ? "Sending..." : "Send ETH"}
      </Button>
    </form>
  );
};