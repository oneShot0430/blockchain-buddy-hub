import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const CoinSelete = ({selectedCoin, setSelectedCoin, searchQuery, setSearchQuery, filteredCoins, placeholder}) => {
  return (
    <Select value={selectedCoin} onValueChange={setSelectedCoin}>
    <SelectTrigger className="w-full">
      <SelectValue>
        {selectedCoin.symbol !=="" ? (
          <div className="flex items-center">
            <img
              src={selectedCoin.logoURI}
              alt={selectedCoin.name}
              className="h-5 w-5 rounded-full mr-2"
            />
            {selectedCoin.name} ({selectedCoin.symbol})
          </div>
        ) : (
          <span className="text-gray-500">{placeholder}</span>
        )}
      </SelectValue>
    </SelectTrigger>
    <SelectContent>
      <div className="sticky top-0 z-10 bg-popover p-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search coins..."
          className="w-full rounded-md border border-input bg-background px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      {filteredCoins?.map((coin) => (
        <SelectItem key={coin.mint} value={coin}>
          <div className="flex items-center">
            <img
              src={coin.logoURI}
              alt={coin.name}
              className="h-5 w-5 rounded-full mr-2"
            />
            {coin.name} ({coin.symbol})
          </div>
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
  );
}
