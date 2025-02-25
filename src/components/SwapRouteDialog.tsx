
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
                  <span className="text-sm text-gray-500">${route.fee || '0.00'}</span>
                  <span className="text-sm text-gray-500">{route.estimatedTime || '00:45'}</span>
                  <span className="text-sm text-gray-500">Steps: {route.swaps?.length || 1}</span>
                </div>
                {index === 0 && (
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                    Recommended
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-xs">250</span>
                  </div>
                  <span>{fromToken}</span>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <img 
                      src={route.targetLogo || '/placeholder.svg'} 
                      alt={toToken}
                      className="w-6 h-6"
                    />
                  </div>
                  <div className="text-right">
                    <div>{route.outputAmount || '6,643.775536'} {toToken}</div>
                    <div className="text-sm text-gray-500">≈${route.outputUSD || '251.5985'}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
