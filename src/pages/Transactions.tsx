
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw, ExternalLink, Send, ArrowLeftRight, ArrowDown } from "lucide-react";
import { SideBarPanel } from "@/components/Sidebar";

const Transactions = () => {
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState("Last 7 days");
  const [chainFilter, setChainFilter] = useState("Base Chain");

  // Mock transaction data
  const transactions = [
    {
      id: 1,
      type: "Send",
      hash: "0xf4e9...db7c",
      date: "Mar 29, 4:39 AM",
      from: "0x7833...7c1b",
      to: "0xd9aa...b6ca",
      amount: "0.05 ETH",
      amountUsd: "$154.00 USD",
      status: "confirmed",
    },
    {
      id: 2,
      type: "Swap",
      hash: "0x3661...e8a9",
      date: "Mar 29, 2:39 AM",
      from: "0xfd22...c0e3",
      to: "0x7833...7c1b",
      amount: "50 BASED",
      amountUsd: "$48.50 USD",
      status: "confirmed",
    },
    {
      id: 3,
      type: "Receive",
      hash: "0x8472...1250",
      date: "Mar 28, 10:39 PM",
      from: "0x866e...0afa",
      to: "0x7833...7c1b",
      amount: "0.1 ETH",
      amountUsd: "$307.80 USD",
      status: "confirmed",
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Send":
        return <Send className="h-4 w-4 text-red-500 rotate-45" />;
      case "Swap":
        return <ArrowLeftRight className="h-4 w-4 text-blue-500" />;
      case "Receive":
        return <ArrowDown className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-[#1A1F2C] text-white">
      <SideBarPanel />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6 border-b border-gray-800">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="px-4 text-gray-400 hover:text-white hover:bg-gray-900"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Dashboard
          </Button>
        </div>
        
        <div className="p-6">
          <h1 className="text-2xl font-bold text-[#9b87f5] mb-8">Transactions</h1>
          
          <div className="bg-[#12151F] rounded-lg overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-800">
              <h2 className="text-xl font-semibold">Transaction History</h2>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-transparent text-gray-400 border-gray-700 hover:bg-gray-800"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                
                <div className="relative">
                  <select 
                    className="rounded px-3 py-1 bg-gray-900 border border-gray-700 text-gray-300 appearance-none pr-8 focus:outline-none focus:ring-1 focus:ring-[#9b87f5]"
                    value={chainFilter}
                    onChange={(e) => setChainFilter(e.target.value)}
                  >
                    <option value="Base Chain">Base Chain</option>
                    <option value="Ethereum">Ethereum</option>
                    <option value="Solana">Solana</option>
                  </select>
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                
                <div className="relative">
                  <select 
                    className="rounded px-3 py-1 bg-gray-900 border border-gray-700 text-gray-300 appearance-none pr-8 focus:outline-none focus:ring-1 focus:ring-[#9b87f5]"
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                  >
                    <option value="Last 7 days">Last 7 days</option>
                    <option value="Last 30 days">Last 30 days</option>
                    <option value="Last 90 days">Last 90 days</option>
                    <option value="All time">All time</option>
                  </select>
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 flex justify-end">
              <Button 
                variant="outline" 
                className="flex items-center bg-[#1f2331] text-blue-400 border-none hover:bg-[#2a2f3f]"
              >
                <span>View All Transactions on Block Explorer</span>
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full min-w-full">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-400 text-sm font-medium">
                    <th className="text-left pl-6 py-3">Type</th>
                    <th className="text-left py-3">Transaction</th>
                    <th className="text-left py-3">Date</th>
                    <th className="text-left py-3">From</th>
                    <th className="text-left py-3">To</th>
                    <th className="text-left py-3">Amount</th>
                    <th className="text-left py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-gray-800 hover:bg-[#1E2538]">
                      <td className="pl-6 py-4 flex items-center">
                        {getTypeIcon(tx.type)}
                        <span className="ml-2">{tx.type}</span>
                      </td>
                      <td className="py-4">
                        <a href="#" className="text-blue-400 flex items-center hover:underline">
                          {tx.hash}
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </td>
                      <td className="py-4">{tx.date}</td>
                      <td className="py-4">
                        <a href="#" className="text-blue-400 flex items-center hover:underline">
                          {tx.from}
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </td>
                      <td className="py-4">
                        <a href="#" className="text-blue-400 flex items-center hover:underline">
                          {tx.to}
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </td>
                      <td className="py-4">
                        <div className="font-medium">{tx.amount}</div>
                        <div className="text-green-500 text-sm">{tx.amountUsd}</div>
                      </td>
                      <td className="py-4">
                        <span className="bg-green-900/20 text-green-500 px-2 py-1 rounded-full text-xs">
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
