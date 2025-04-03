import { useState, useEffect } from "react";
import { LayoutDashboard, FileText, Settings, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BrowserProvider } from "ethers";

export const SideBarPanel = () => {

  useEffect(() => {
    const getWalletAddress = async () => {
      if (!window.ethereum) return;
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      setPubAddress(signer.address);
    }

    getWalletAddress();
  }, [window.ethereum]);
  
  const navigate = useNavigate();
  const [pubAddress, setPubAddress] = useState("");

  return (
    <div className="w-60 bg-[#12151F] flex flex-col">
      <div className="p-5 flex items-center space-x-2">
        <div className="w-8 h-8 bg-indigo-700 rounded-lg flex items-center justify-center">
          <svg className="h-6 w-6 text-white relative z-10" viewBox="0 0 32 32" fill="none">
            <path d="M16 5L3 12L16 19L29 12L16 5Z" fill="currentColor"/>
            <path d="M3 20L16 27L29 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3"/>
          </svg>
        </div>
        <span className="text-xl font-bold text-[#9b87f5]">ZEX</span>
      </div>
      
      <div className="flex-1 px-2 py-4">
        <div className="text-gray-400 p-2 rounded-lg flex items-center space-x-3 hover:bg-[#1E2538] transition-colors cursor-pointer" onClick={() => navigate('/')}>
          <LayoutDashboard className="h-5 w-5" />
          <span className="font-medium">Dashboard</span>
        </div>
        <div className="text-gray-400 p-2 rounded-lg flex items-center space-x-3 hover:bg-[#1E2538] transition-colors">
          <FileText className="h-5 w-5" />
          <span>Transactions</span>
        </div>
        <div className="text-gray-400 p-2 rounded-lg flex items-center space-x-3 hover:bg-[#1E2538] transition-colors">
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-800">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Smart Wallet</span>
          <span className="text-xs bg-indigo-800 text-indigo-200 px-2 py-0.5 rounded-full">Active</span>
        </div>
        <div className="bg-[#1E2538] rounded-lg p-3 mb-2">
          <div className="flex justify-between items-center">
            {pubAddress ? 
              <span className="text-xs text-gray-400">{pubAddress.slice(0, 6)}...{pubAddress.slice(-4)}</span> : 
              <span className="text-xs text-gray-400"></span>
            }
            <div className="bg-indigo-600 rounded-md p-1">
              <CreditCard className="h-4 w-4" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-[#1E2538] rounded-lg p-2 text-center">
            <div className="text-xs text-gray-400">BASE</div>
            <div className="font-bold">--</div>
          </div>
          <div className="bg-[#1E2538] rounded-lg p-2 text-center">
            <div className="text-xs text-gray-400">SOLANA</div>
            <div className="font-bold">--</div>
          </div>
        </div>
      </div>
    </div>
  )
}
