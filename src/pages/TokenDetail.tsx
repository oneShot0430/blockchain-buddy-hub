
import { useState, useEffect } from "react";
import { BrowserProvider} from "ethers";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Route, ArrowRight } from "lucide-react";
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
// import { getRoute, confirmRoute, createRangoTransaction, checkApprovalTx, checkStatus } from "@/hooks/rango";
import { getRoute, confirmRoute, createTransaction, checkApprovalTx, checkStatus } from "@/hooks/transaction";
import { getSocialData } from "@/hooks/getSocialScore";
import { USDC } from "@/const/const";
import { SwapRouteDialog } from "@/components/SwapRouteDialog";
import { useToast } from "@/components/ui/use-toast";
import { Transaction } from "@solana/web3.js";
import { BASE_CHAIN_ID, USDC_CONTRACT, ENTRYPOINT_ADDRESS, PAYMASTER_PROXY_URL } from "@/const/const";

const TokenDetail = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const { toast } = useToast();
  const { symbol } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [tokenData, setTokenData] = useState<CMCResult | null>(null);
  const [chartData, setChartData] = useState<{ time: string; price: number }[]>([]);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1);
  const [showBuyDialog, setShowBuyDialog] = useState(false);
  const [amount, setAmount] = useState("");
  const [receiptionAddress, setReceiptionAddress] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [logoUri, setLogoUri] = useState("");
  const [pubAddress, setPubAddress] = useState("");
  const [signer, setSigner] = useState(null);
  const [usdcBalance, setUsdcBalance] = useState("");
  const [showRoutesDialog, setShowRoutesDialog] = useState(false);
  const [routes, setRoutes] = useState<any[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<any>(null);
  const [socialScore, setSocialScore] = useState<string | number>("N/A");

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
      setSigner(signer);
      const baseUSDCBalance = await getUSDCBalance(signer.address);
      console.log("baseUSDCBalance:", baseUSDCBalance);
      setUsdcBalance(baseUSDCBalance);
    }

    getBalance();
  }, [window.ethereum]);
  
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
    const getSocialScore = async () => {
      try {
        if(!tokenData || !tokenData.contract) return;
        console.log(tokenData.contract);
        const response = await getSocialData(tokenData.contract, tokenData.platform.name);
        console.log("response:", response);
        const {slug, data, socialScore, averageScore} = response;
        setSocialScore(averageScore? averageScore : "It is not support now");
      } catch (error) {
        setSocialScore("It is not support now");
        console.log("Error for getting Social Score", error);
      }
    }
    getSocialScore();
  }, [tokenData]);


  useEffect(() => {
    const minPrice = min(chartData.map((d) => d.price));
    const maxPrice = max(chartData.map((d) => d.price));
    console.log(minPrice, maxPrice);
    setMinPrice(minPrice || 0);
    setMaxPrice(maxPrice || 1);
  }, [chartData]);

  useEffect(() => {
    if (!pubAddress || !tokenData) return;
    if (tokenData.platform.name !== "Solana") setReceiptionAddress(pubAddress);
  }, [pubAddress, tokenData])

  const handleBack = () => {
    if (location.key === "default") {
      navigate("/");
    } else {
      navigate(-1);
    }
  };

  const handleShowRoutes = async () => {
    try {
      const toChain = tokenData.platform.name === "Ethereum" ? "ETH" : tokenData.platform.name.toUpperCase();
      const allRoutes = await getRoute("BASE", toChain, "USDC", tokenData.symbol, USDC, tokenData.contract, amount);
      console.log("Available routes:", allRoutes);
      const filteredRoutes = (allRoutes?.results || []).filter(
        result => result.swaps?.length === 1
      );
      setRoutes(filteredRoutes);
      // setShowBuyDialog(false);

      console.log(routes);
      setShowRoutesDialog(true);
    } catch (error) {
      console.error("Error fetching routes:", error);
    }
  };

  const handleSelectRoute = (route: any) => {
    console.log("Selected route:", route);
    setSelectedRoute(route);
    setShowRoutesDialog(false);
    setShowBuyDialog(true);
  };

  const handleBuy = async () => {
    try {
      if(!receiptionAddress) {
        toast({
          title: "No Receiption Address",
          description: "You must have fill receiption address to this transaction"
        });
        return;
      }
      console.log("Buy tokens");
      const toChain = tokenData.platform.name === "Ethereum" ? "ETH" : tokenData.platform.name.toUpperCase();
      const confirmResponse = await confirmRoute(selectedRoute.requestId, "BASE", toChain, pubAddress, receiptionAddress);
      const confirmedRoute = confirmResponse.result;
      console.log("confirmed Route:", confirmedRoute);    
      if (!confirmedRoute) {
        throw new Error(`Error in confirming route, ${confirmResponse.error}`)
      }
      const transactionResponse = await createTransaction(confirmedRoute.requestId, 1, 1);
      console.log("transaction:", transactionResponse);
      if (!transactionResponse.transaction) {
        throw new Error(`Error in swapping, ${transactionResponse.error}`)
      }
      const tx = transactionResponse.transaction;
      if (tx.isApprovalTx) {
        // sign the approve transaction
        const approveTransaction = {
          from: tx.from,
          to: tx.to,
          data: tx.data,
          value: tx.value,
          maxFeePerGas: tx.maxFeePerGas,
          maxPriorityFeePerGas: tx.maxPriorityFeePerGas,
          gasPrice: tx.gasPrice,
          gasLimit: tx.gasLimit,
          chainId: 8453,
        }
        const { ApproveHash } = await signer.sendTransaction(approveTransaction);
        console.log("txHash for Approve:", ApproveHash);
        toast({
          title: "Approve Transaction",
          description: "Please approve in your Wallet"
        });
        // wait for approval
        while (true) {
          // await setTimeout(5000)
          await setTimeout(() => {}, 5000);
          const { isApproved, currentApprovedAmount, requiredApprovedAmount, txStatus } = await checkApprovalTx(confirmedRoute.requestId, ApproveHash)
          if (isApproved)
            break
          else if (txStatus === "failed")
            throw new Error('Approve transaction failed in blockchain')
          else if (txStatus === "success")
            throw new Error(`Insufficient approve, current amount: ${currentApprovedAmount}, required amount: ${requiredApprovedAmount}`)
        }
      }
      tx.paymasterAndData = await getCoinbasePaymasterData(tx.from, USDC_CONTRACT);

      const mainTransaction = {
        from: tx.from,
        to: tx.to,
        data: tx.data,
        value: tx.value,
        maxFeePerGas: tx.maxFeePerGas,
        maxPriorityFeePerGas: tx.maxPriorityFeePerGas,
        gasPrice: tx.gasPrice,
        gasLimit: tx.gasLimit,
        chainId: 8453,
      };
      let status = "pending";
      toast({
        title: "Swap Initiated",
        description: `Swapping ${amount} USDC on Base to ${tokenData.symbol}, It is already initalized and ${status}`,
      });
      while (true) {
        await setTimeout(() => {}, 10000);
        const { hash } = await signer.sendTransaction(mainTransaction);
        console.log("txHash for Main:", hash);
        const state = await checkStatus(confirmedRoute.requestId, hash, 1);
        console.log("txState:", state);
        if (state.status === "success") {status = state.status; setShowBuyDialog(false); break;}
        else if (state.status === "failed") {status = state.status; setShowBuyDialog(false); throw new Error(`Swap failed`)}
      }
      toast({
        title: "Swap Finished",
        description: `Swapping ${amount} USDC on Base to ${tokenData.symbol} is ${status}`,
      });
    } catch (error) {
      console.log("error:", error);
      toast({
        title: "Error occured in Swapping",
        description: error,
      })
    }
  }
  const getCoinbasePaymasterData = async (sender: any, tokenAddress: any) => {
    const response = await fetch(PAYMASTER_PROXY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "pm_getPaymasterData",
        params: [
          { sender, paymasterAndData: "0x" },
          ENTRYPOINT_ADDRESS,
          BASE_CHAIN_ID,
          { erc20: tokenAddress },
        ],
      }),
    });

    const data = await response.json();
    console.log("data from Paymaster:", data);
    return data.result.paymasterAndData;
  };

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

                {selectedRoute && (
                  <div className="border rounded-lg p-4 bg-blue-50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Route className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">Selected Route</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          setShowBuyDialog(false);
                          setShowRoutesDialog(true);
                        }}
                      >
                        Change
                      </Button>
                    </div>
                    {/* <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                          <span className="text-xs">{amount}</span>
                        </div>
                        <span>USDC</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                          <img 
                            src={logoUri} 
                            alt={tokenData.symbol}
                            className="w-6 h-6"
                          />
                        </div>
                        <div className="text-right">
                          <div>{selectedRoute.outputAmount || amount} {tokenData.symbol}</div>
                          <div className="text-sm text-gray-500">≈${selectedRoute.outputUSD || '0.00'}</div>
                        </div>
                      </div>
                    </div> */}
                    {selectedRoute.swaps?.map((swap, swap_index) => (
                      <div className="flex items-center justify-between" key={swap_index}>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-xs">{parseFloat(swap?.fromAmount).toFixed(2)}</span>
                          </div>
                          <img
                            src={swap?.from?.logo}
                            alt={swap?.from?.symbol}
                            className="w-8 h-8 rounded-full"
                          />
                          <span>{swap?.from?.symbol}</span>
                        </div>
                        <ArrowRight className="h-4 w-16 text-gray-400" />
                        <div>
                          <img
                            src={swap?.swapperLogo}
                            alt={swap?.swapperId}
                            className="w-8 h-8 rounded-full"
                          />
                        </div>
                        <ArrowRight className="h-4 w-16 text-gray-400" />
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <img 
                              src={swap?.to?.logo || '/placeholder.svg'} 
                              alt={swap?.to?.symbol}
                              className="w-6 h-6"
                            />
                          </div>
                          <div className="text-right">
                            <div>{parseFloat(swap?.toAmount).toFixed(2) || '6,643.775536'} {swap?.to?.symbol}</div>
                            <div className="text-sm text-gray-500">≈${(swap?.toAmount * swap?.to?.usdPrice).toFixed(2) || '251.5985'}</div>
                          </div>
                        </div>
                      </div>
                    ) )}
                  </div>
                )}

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
                <div className="space-y-2">
                  <label className="text-sm font-medium">Address {(tokenData.platform.name === "Solana") ? "(Mandatory)": "(Optional)"}</label>
                  <div className="relative">
                    <Input
                      type="string"
                      placeholder="Please Enter Receiption Address"
                      value={receiptionAddress}
                      onChange={(e) => setReceiptionAddress(e.target.value)}
                    />
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
                  onClick={selectedRoute ? handleBuy : handleShowRoutes}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={!amount || parseFloat(amount) <= 0}
                >
                  {selectedRoute ? `Buy ${tokenData.symbol}` : 'See Available Routes'}
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

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
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
              <a href={`https://basescan.org/token/${tokenData.contract}`} target="_blank" rel="noopener noreferrer">
                <div className="bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100">
                  <div className="text-sm text-gray-500">Contract</div>
                  <div className="text-sm font-mono truncate">{tokenData.contract.slice(0, 4)}...{tokenData.contract.slice(-3)}</div>
                </div>
              </a>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Social Score</div>
                <div className="text-sm font-mono truncate">{socialScore}</div>
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
