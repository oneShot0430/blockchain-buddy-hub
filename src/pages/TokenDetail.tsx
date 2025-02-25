import { useState, useEffect } from "react";
import { BrowserProvider} from "ethers";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { getTokenData, fetchHistoricalData } from "@/hooks/getTokenData";
import { CMCResult } from "@/type/interface";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { min, max } from "lodash";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { getUSDCBalance } from "@/hooks/getUSDCBalance";
import { getRoute } from "@/hooks/rango";
import { USDC } from "@/const/const";
import { SwapRouteDialog } from "@/components/SwapRouteDialog";

const TokenDetail = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  
  const { symbol } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [tokenData, setTokenData] = useState<CMCResult | null>(null);
  const [chartData, setChartData] = useState<{ time: string; price: number }[]>([]);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1);
  const [showBuyDialog, setShowBuyDialog] = useState(false);
  const [amount, setAmount] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [logoUri, setLogoUri] = useState("");
  const [pubAddress, setPubAddress] = useState("");
  const [usdcBalance, setUsdcBalance] = useState("");
  const [showRoutesDialog, setShowRoutesDialog] = useState(false);
  const [routes, setRoutes] = useState<any[]>([]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  useEffect(() => {
    const getBalance = async () => {
      if (!window.ethereum) return;
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      console.log("Signer:", signer.address);
      setPubAddress(signer.address);

      const baseUSDCBalance = await getUSDCBalance(signer.address);
      console.log("baseUSDCBalance:", baseUSDCBalance);
      setUsdcBalance(baseUSDCBalance);
    }

    getBalance();
  }, []);
  
  useEffect(() => {
    const fetchToken = async () => {
      if (symbol) {
        const data = await getTokenData([symbol]);
        console.log(data);
        if (data.length > 0) {
          setTokenData(data[0]);
          const {formattedData, logo_uri} = await fetchHistoricalData(data[0].symbol);
          setChartData(formattedData);
          setLogoUri(logo_uri);
        }
      }
    };
    fetchToken();
  }, [symbol]);

  useEffect(() => {
    const minPrice = min(chartData.map((d) => d.price));
    const maxPrice = max(chartData.map((d) => d.price));
    console.log(minPrice, maxPrice);
    setMinPrice(minPrice || 0);
    setMaxPrice(maxPrice || 1);
  }, [chartData]);

  const handleBack = () => {
    if (location.key === "default") {
      navigate("/");
    } else {
      navigate(-1);
    }
  };

  const handleShowRoutes = async () => {
    try {
      const allRoutes = await getRoute(
        "BASE",
        "SOLANA",
        "USDC",
        tokenData?.symbol || "",
        USDC,
        tokenData?.contract || "",
        amount
      );
      console.log("Available routes:", allRoutes);
      setRoutes(allRoutes.routes || []);
      setShowBuyDialog(false);
      setShowRoutesDialog(true);
    } catch (error) {
      console.error("Error fetching routes:", error);
    }
  };

  const handleSelectRoute = (route: any) => {
    console.log("Selected route:", route);
    setShowRoutesDialog(false);
    // Here you would implement the actual swap using the selected route
  };

  const handleBuy = async () => {
    const allRoutes = await getRoute("BASE", "BASE", "USDC", tokenData.symbol, USDC, tokenData.contract, amount);
    console.log("allRoutes:", allRoutes);
  }

  if (!tokenData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-background">
        <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} currentPath={location.pathname} />
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            <Button variant="ghost" onClick={handleBack} className="mb-4">
              <ArrowLeft className="mr-2" /> Back
            </Button>
            <div>Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} currentPath={location.pathname} />
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <Button variant="ghost" onClick={handleBack}>
              <ArrowLeft className="mr-2" /> Back
            </Button>
            <Button 
              onClick={() => setShowBuyDialog(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Buy {tokenData.symbol}
            </Button>
          </div>

          <Dialog open={showBuyDialog} onOpenChange={setShowBuyDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Buying {tokenData.symbol}</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  {logoUri && (
                    <img
                      src={logoUri}
                      alt={tokenData.name}
                      className="w-10 h-10 rounded-full"
                    />
                  )}
                  <div>
                    <p className="font-medium">{tokenData.name}</p>
                    <p className="text-sm text-gray-500">{tokenData.symbol}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount</label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pr-16"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                      USDC
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 px-1">
                    <button onClick={() => setAmount("100")}>100</button>
                    <button onClick={() => setAmount("500")}>500</button>
                    <button onClick={() => setAmount("1000")}>1000</button>
                    <button onClick={() => setAmount("5000")}>5000</button>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Active Wallet</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-blue-100 rounded-full"></div>
                      {!pubAddress ? <span className="text-sm">Pending</span> :<span className="text-sm">{pubAddress.slice(0, 4)}...{pubAddress.slice(-3)}</span>}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Live Balance</span>
                    {! usdcBalance ? <span className="text-sm">0.0000 USDC</span> : <span className="text-sm">{parseFloat(usdcBalance).toFixed(3)} USDC</span>}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <Button
                      key={num}
                      variant="outline"
                      className="h-12 text-lg"
                      onClick={() => setAmount(prev => prev + num.toString())}
                    >
                      {num}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    className="h-12 text-lg"
                    onClick={() => setAmount(prev => prev + ".")}
                  >
                    .
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 text-lg"
                    onClick={() => setAmount(prev => prev + "0")}
                  >
                    0
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 text-lg"
                    onClick={() => setAmount(prev => prev.slice(0, -1))}
                  >
                    ←
                  </Button>
                </div>

                <Button
                  onClick={handleBuy}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={!amount || parseFloat(amount) <= 0}
                >
                  Buy {tokenData.symbol}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <SwapRouteDialog
            isOpen={showRoutesDialog}
            onClose={() => setShowRoutesDialog(false)}
            routes={routes}
            fromToken="USDC"
            toToken={tokenData?.symbol || ""}
            onSelectRoute={handleSelectRoute}
          />

          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center gap-4 mb-6">
              {logoUri && (
                <img
                  src={logoUri}
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
    </div>
  );
};

export default TokenDetail;
