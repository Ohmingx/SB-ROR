import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Search, Plus, TrendingUp, TrendingDown } from "lucide-react";
import TradingChart from "../components/TradingChart";

export default function Assets() {
  const [filterExchange, setFilterExchange] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<any>(null);

  const assets = [
    {
      symbol: "BTCUSDT",
      name: "Bitcoin",
      exchange: "Binance",
      price: 51234.56,
      change: 2.34,
      volume: "24.5B",
      category: "Crypto",
    },
    {
      symbol: "ETHUSDT",
      name: "Ethereum",
      exchange: "Binance",
      price: 3456.78,
      change: -1.23,
      volume: "12.3B",
      category: "Crypto",
    },
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      exchange: "NASDAQ",
      price: 182.45,
      change: 1.56,
      volume: "45.2M",
      category: "Stock",
    },
    {
      symbol: "TSLA",
      name: "Tesla Inc.",
      exchange: "NASDAQ",
      price: 234.56,
      change: -2.45,
      volume: "98.7M",
      category: "Stock",
    },
    {
      symbol: "GOOGL",
      name: "Alphabet Inc.",
      exchange: "NASDAQ",
      price: 142.34,
      change: 0.89,
      volume: "28.4M",
      category: "Stock",
    },
    {
      symbol: "EUR/USD",
      name: "Euro vs US Dollar",
      exchange: "FX",
      price: 1.0875,
      change: 0.12,
      volume: "1.2T",
      category: "Forex",
    },
    {
      symbol: "GBP/USD",
      name: "British Pound vs US Dollar",
      exchange: "FX",
      price: 1.2634,
      change: -0.08,
      volume: "856B",
      category: "Forex",
    },
    {
      symbol: "NIFTY",
      name: "Nifty 50",
      exchange: "NSE",
      price: 22134.75,
      change: 1.23,
      volume: "2.3B",
      category: "Index",
    },
    {
      symbol: "SPX",
      name: "S&P 500",
      exchange: "US",
      price: 4987.23,
      change: 0.67,
      volume: "3.4B",
      category: "Index",
    },
  ];

  const filteredAssets = assets.filter((asset) => {
    const matchesExchange = filterExchange === "all" || asset.exchange === filterExchange;
    const matchesSearch =
      searchTerm === "" ||
      asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesExchange && matchesSearch;
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Assets</h1>
        <p className="text-muted-foreground">Browse and select assets for backtesting</p>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-input-background"
            />
          </div>

          <Select value={filterExchange} onValueChange={setFilterExchange}>
            <SelectTrigger className="bg-input-background">
              <SelectValue placeholder="Exchange" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Exchanges</SelectItem>
              <SelectItem value="Binance">Binance</SelectItem>
              <SelectItem value="NASDAQ">NASDAQ</SelectItem>
              <SelectItem value="FX">FX</SelectItem>
              <SelectItem value="NSE">NSE</SelectItem>
              <SelectItem value="US">US</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assets List */}
        <div className="space-y-4">
          {filteredAssets.map((asset) => (
            <div
              key={asset.symbol}
              className={`bg-card border rounded-lg p-6 cursor-pointer transition-all hover:border-primary/50 ${
                selectedAsset?.symbol === asset.symbol ? "border-primary" : "border-border"
              }`}
              onClick={() => setSelectedAsset(asset)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg">{asset.symbol}</h3>
                    <span className="text-xs px-2 py-0.5 bg-muted rounded-full">{asset.category}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{asset.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{asset.exchange}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-semibold">${asset.price.toLocaleString()}</p>
                  <div className={`flex items-center gap-1 text-sm ${asset.change >= 0 ? "text-success" : "text-destructive"}`}>
                    {asset.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    <span>{asset.change >= 0 ? "+" : ""}{asset.change}%</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="text-muted-foreground">Volume: </span>
                  <span className="font-medium">{asset.volume}</span>
                </div>
                <Button size="sm" onClick={(e) => {
                  e.stopPropagation();
                  // Add to session logic
                }}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add to Session
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Chart Preview */}
        <div className="lg:sticky lg:top-8 lg:self-start">
          <div className="bg-card border border-border rounded-lg p-6">
            {selectedAsset ? (
              <>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-1">{selectedAsset.symbol}</h3>
                  <p className="text-sm text-muted-foreground">{selectedAsset.name}</p>
                </div>
                <TradingChart height={500} />
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Current Price</p>
                    <p className="text-lg font-semibold">${selectedAsset.price.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">24h Change</p>
                    <p className={`text-lg font-semibold ${selectedAsset.change >= 0 ? "text-success" : "text-destructive"}`}>
                      {selectedAsset.change >= 0 ? "+" : ""}{selectedAsset.change}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Volume</p>
                    <p className="text-lg font-semibold">{selectedAsset.volume}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Exchange</p>
                    <p className="text-lg font-semibold">{selectedAsset.exchange}</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-20 text-muted-foreground">
                <p>Select an asset to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
