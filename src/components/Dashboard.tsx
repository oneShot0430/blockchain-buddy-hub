
import { useWallet } from "@solana/wallet-adapter-react";
import { Search, Moon, Rocket, Flame, Star } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useQuery } from "@tanstack/react-query";
import { fetchRaydiumTokens} from "@/hooks/fetchToken";
import { useEffect } from "react";
import { getTokenData } from "@/hooks/getTokenData";

export const Dashboard = () => {

  const { data: memeCoins, isLoading, error } = useQuery({
    queryKey: ['raydiumTokens'],
    queryFn: fetchRaydiumTokens,
  });

  useEffect(()=>{
    if(!memeCoins) return;
    const tokensymbols = memeCoins.map(token => token.symbol);
    getTokenData(tokensymbols);
  }, [memeCoins])
  
  if (isLoading) {
    return <div className="text-center p-4">Loading coins...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">Error loading coins</div>;
  }
  return (
    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Stats Grid */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-sm text-green-600 font-medium">Biggest Gainer (24h)</div>
            <div className="mt-2 flex items-center">
              <div className="h-8 w-8 rounded-full bg-green-100" />
              <div className="ml-2">
                <div className="font-semibold">BONK</div>
                <div className="text-green-600">+45.2%</div>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-sm text-blue-600 font-medium">Most Traded</div>
            <div className="mt-2 flex items-center">
              <div className="h-8 w-8 rounded-full bg-blue-100" />
              <div className="ml-2">
                <div className="font-semibold">WIF</div>
                <div className="text-blue-600">$1.2B Vol</div>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-sm text-purple-600 font-medium">Highest Social Score</div>
            <div className="mt-2 flex items-center">
              <div className="h-8 w-8 rounded-full bg-purple-100" />
              <div className="ml-2">
                <div className="font-semibold">MYRO</div>
                <div className="text-purple-600">Score: 98</div>
              </div>
            </div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="text-sm text-orange-600 font-medium">Total Tracked</div>
            <div className="mt-2">
              <div className="font-semibold text-2xl">2,451</div>
              <div className="text-orange-600 text-sm">Active Tokens</div>
            </div>
          </div>
        </div>
      </div>

      {/* Token Table */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-wrap gap-4 items-center">
            <Button variant="default" className="flex items-center gap-2">
              <Rocket className="h-4 w-4" /> Top Movers
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Flame className="h-4 w-4" /> Trending
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Star className="h-4 w-4" /> New Listings
            </Button>
            <Select>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Chains" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Chains</SelectItem>
                <SelectItem value="solana">Solana</SelectItem>
                <SelectItem value="ethereum">Ethereum</SelectItem>
                <SelectItem value="bsc">BSC</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="24h" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">24h</SelectItem>
                <SelectItem value="7d">7d</SelectItem>
                <SelectItem value="30d">30d</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Token
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  24h Change
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  7d Change
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Volume
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Market Cap
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Social Score
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Sample row - this would be mapped from actual data */}
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gray-100" />
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-gray-900">BONK</div>
                      <div className="text-sm text-gray-500">Bonk</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">$0.00001234</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-green-600">+12.5%</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-green-600">+45.2%</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">$1.2B</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">$11.5B</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-2 w-24 bg-gray-200 rounded">
                      <div className="h-2 bg-green-500 rounded" style={{ width: '85%' }} />
                    </div>
                    <span className="ml-2 text-sm text-gray-700">85</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
