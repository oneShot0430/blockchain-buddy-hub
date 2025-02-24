
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { getTokenData, fetchHistoricalData } from "@/hooks/getTokenData";
import { CMCResult } from "@/type/interface";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { min, max } from "lodash";

const TokenDetail = () => {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [tokenData, setTokenData] = useState<CMCResult | null>(null);
  const [chartData, setChartData] = useState<{ time: string; price: number }[]>([]);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1);

  useEffect(() => {
    const fetchToken = async () => {
      if (symbol) {
        const data = await getTokenData([symbol]);
        console.log(data);
        if (data.length > 0) {
          setTokenData(data[0]);
          const historicalData = await fetchHistoricalData(data[0].symbol);
          setChartData(historicalData);
        }
      }
    };
    fetchToken();
  }, [symbol]);

  useEffect(() => {
    const minPrice = min(chartData.map((d) => d.price));
    const maxPrice = max(chartData.map((d) => d.price));
    console.log(minPrice, maxPrice);
    setMinPrice(minPrice);
    setMaxPrice(maxPrice);
  }, [chartData])

  const handleBack = () => {
    if (location.key === "default") {
      // If there's no history (user landed directly on this page), go to home
      navigate("/");
    } else {
      // Go back to the previous page in history
      navigate(-1);
    }
  };

  if (!tokenData) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <Button variant="ghost" onClick={handleBack} className="mb-4">
            <ArrowLeft className="mr-2" /> Back
          </Button>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <Button variant="ghost" onClick={handleBack} className="mb-4">
          <ArrowLeft className="mr-2" /> Back
        </Button>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            {tokenData.logo_uri && (
              <img
                src={tokenData.logo_uri}
                alt={tokenData.name}
                className="w-16 h-16 rounded-full"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold">{tokenData.name} ({tokenData.symbol})</h1>
              <div className="flex items-center gap-2">
                <span className="text-xl">${tokenData.price.toFixed(8)}</span>
                <span className={`text-sm ${tokenData.change_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {tokenData.change_24h >= 0 ? '+' : ''}{tokenData.change_24h.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">Market Cap</div>
              <div className="text-lg font-semibold">${tokenData.market_cap.toLocaleString()}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">Volume (24h)</div>
              <div className="text-lg font-semibold">${tokenData.volume_24h.toLocaleString()}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">CMC Rank</div>
              <div className="text-lg font-semibold">#{tokenData.social_score}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">Contract</div>
              <div className="text-sm font-mono truncate">{tokenData.contract}</div>
            </div>
          </div>

          <Tabs defaultValue="activity" className="w-full">
            <TabsList>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="holders">Top Holders</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
            </TabsList>
            <TabsContent value="activity">
              <div className="h-[400px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={[minPrice * 0.99, maxPrice * 1.01]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#8884d8"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="about">
              <div className="p-4">
                <h3 className="font-semibold mb-2">About {tokenData.name}</h3>
                <p className="text-gray-600">
                  Detailed information about {tokenData.name} will be displayed here.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="holders">
              <div className="p-4">
                <h3 className="font-semibold mb-2">Top Holders</h3>
                <p className="text-gray-600">Top holders information will be displayed here.</p>
              </div>
            </TabsContent>
            <TabsContent value="orders">
              <div className="p-4">
                <h3 className="font-semibold mb-2">Orders</h3>
                <p className="text-gray-600">Order information will be displayed here.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default TokenDetail;
