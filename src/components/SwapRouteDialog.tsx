
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, RotateCw } from "lucide-react";

interface SwapRouteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  routes: any[];
  fromToken: string;
  toToken: string;
  onSelectRoute: (route: any) => void;
}

export const SwapRouteDialog = ({ 
  isOpen, 
  onClose, 
  routes, 
  fromToken, 
  toToken,
  onSelectRoute 
}: SwapRouteDialogProps) => {
  if (!routes) return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>No Available Routes</DialogTitle>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>Routes</DialogTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm">Smart Routing</span>
              <Button size="icon" variant="ghost">
                <RotateCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        <div className="space-y-4">
          {routes?.map((route, index) => (
            <div 
              key={index}
              className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => onSelectRoute(route)}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">${parseFloat(route?.priceImpactUsd).toFixed(2) || '0.00'}</span>
                  <span className="text-sm text-gray-500">{route?.swaps[0]?.estimatedTimeInSeconds || '00:45'}</span>
                  <span className="text-sm text-gray-500">Steps: {route.swaps?.length || 1}</span>
                </div>
                {index === 0 && (
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                    Recommended
                  </span>
                )}
              </div>
              {route.swaps?.map((swap, swap_index) => (
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
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
