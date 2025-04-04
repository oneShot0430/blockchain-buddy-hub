
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();
  const [autoInvest, setAutoInvest] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState("10");
  const [profitTarget, setProfitTarget] = useState("20");
  const [stopLoss, setStopLoss] = useState("10");

  return (
    <div className="min-h-screen bg-[#12151F] text-white">
      <div className="flex flex-col">
        {/* Header */}
        <div className="p-4 flex items-center space-x-3 border-b border-gray-800">
          <button 
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="text-gray-400">Back to Dashboard</span>
        </div>
        
        {/* Main Content */}
        <div className="p-6">
          <h1 className="text-2xl font-bold text-[#9b87f5] mb-6">Settings</h1>
          
          <div className="bg-[#1A1F2C] rounded-lg p-6 max-w-2xl">
            <h2 className="text-xl font-medium mb-6">Trading Preferences</h2>
            
            {/* Auto-Invest */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-1">
                <div>
                  <h3 className="text-[#9b87f5]">Auto-Invest</h3>
                  <p className="text-sm text-gray-400">Automatically invest in top performing tokens</p>
                </div>
                <Switch 
                  checked={autoInvest} 
                  onCheckedChange={setAutoInvest}
                  className="data-[state=checked]:bg-[#4285F4]"
                />
              </div>
            </div>
            
            {/* Investment Amount */}
            <div className="mb-6">
              <label className="block text-[#9b87f5] mb-1">Investment Amount (USD)</label>
              <Input 
                type="number" 
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(e.target.value)}
                className="bg-[#1E2538] border-gray-700 text-white"
                placeholder="10"
              />
              <p className="text-xs text-gray-400 mt-1">Amount to invest in each token</p>
            </div>
            
            {/* Profit Target */}
            <div className="mb-6">
              <label className="block text-[#9b87f5] mb-1">Profit Target (%)</label>
              <Input 
                type="number" 
                value={profitTarget}
                onChange={(e) => setProfitTarget(e.target.value)}
                className="bg-[#1E2538] border-gray-700 text-white"
                placeholder="20"
              />
              <p className="text-xs text-gray-400 mt-1">Exit position when profit reaches target</p>
            </div>
            
            {/* Stop Loss */}
            <div className="mb-6">
              <label className="block text-[#9b87f5] mb-1">Stop Loss (%)</label>
              <Input 
                type="number" 
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                className="bg-[#1E2538] border-gray-700 text-white"
                placeholder="10"
              />
              <p className="text-xs text-gray-400 mt-1">Exit position when loss reaches limit</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
