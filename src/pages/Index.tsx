import { WalletConnect } from "@/components/WalletConnect";
import { TransferForm } from "@/components/TransferForm";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Web3 Wallet</h1>
        <p className="text-muted-foreground">Connect your wallet and start transferring ETH</p>
      </div>
      
      <WalletConnect />
      
      <div className="w-full max-w-md">
        <TransferForm />
      </div>
    </div>
  );
};

export default Index;