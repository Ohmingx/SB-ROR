import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Input } from "../components/ui/input";
import { Search } from "lucide-react";

export default function Trades() {
  const [filterAsset, setFilterAsset] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const trades = [
    {
      id: "TRD-1234",
      asset: "BTCUSDT",
      entryPrice: 50234.56,
      exitPrice: 51420.32,
      positionSize: 1.5,
      pnl: 1778.64,
      type: "Long",
      session: "Crazy",
      date: "Mar 10, 2026",
    },
    {
      id: "TRD-1235",
      asset: "ETHUSDT",
      entryPrice: 3456.78,
      exitPrice: 3389.21,
      positionSize: 10,
      pnl: -675.70,
      type: "Long",
      session: "Crazy",
      date: "Mar 10, 2026",
    },
    {
      id: "TRD-1236",
      asset: "AAPL",
      entryPrice: 182.45,
      exitPrice: 185.20,
      positionSize: 100,
      pnl: 275.00,
      type: "Long",
      session: "Conservative Swing",
      date: "Mar 9, 2026",
    },
    {
      id: "TRD-1237",
      asset: "BTCUSDT",
      entryPrice: 51234.56,
      exitPrice: 50987.43,
      positionSize: 2,
      pnl: -494.26,
      type: "Short",
      session: "Crazy",
      date: "Mar 9, 2026",
    },
    {
      id: "TRD-1238",
      asset: "TSLA",
      entryPrice: 234.56,
      exitPrice: 242.10,
      positionSize: 50,
      pnl: 377.00,
      type: "Long",
      session: "Breakout Hunter",
      date: "Mar 8, 2026",
    },
    {
      id: "TRD-1239",
      asset: "ETHUSDT",
      entryPrice: 3520.45,
      exitPrice: 3645.89,
      positionSize: 15,
      pnl: 1881.60,
      type: "Long",
      session: "Crazy",
      date: "Mar 8, 2026",
    },
    {
      id: "TRD-1240",
      asset: "SPY",
      entryPrice: 498.72,
      exitPrice: 501.34,
      positionSize: 200,
      pnl: 524.00,
      type: "Long",
      session: "Conservative Swing",
      date: "Mar 7, 2026",
    },
    {
      id: "TRD-1241",
      asset: "BTCUSDT",
      entryPrice: 49876.54,
      exitPrice: 50124.32,
      positionSize: 1,
      pnl: 247.78,
      type: "Long",
      session: "Mean Reversion",
      date: "Mar 7, 2026",
    },
  ];

  const filteredTrades = trades.filter((trade) => {
    const matchesAsset = filterAsset === "all" || trade.asset === filterAsset;
    const matchesType = filterType === "all" || trade.type === filterType;
    const matchesSearch =
      searchTerm === "" ||
      trade.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trade.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trade.session.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesAsset && matchesType && matchesSearch;
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Trades</h1>
        <p className="text-muted-foreground">Your complete trade journal</p>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search trades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-input-background"
            />
          </div>

          <Select value={filterAsset} onValueChange={setFilterAsset}>
            <SelectTrigger className="bg-input-background">
              <SelectValue placeholder="All Assets" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Assets</SelectItem>
              <SelectItem value="BTCUSDT">BTCUSDT</SelectItem>
              <SelectItem value="ETHUSDT">ETHUSDT</SelectItem>
              <SelectItem value="AAPL">AAPL</SelectItem>
              <SelectItem value="TSLA">TSLA</SelectItem>
              <SelectItem value="SPY">SPY</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="bg-input-background">
              <SelectValue placeholder="Trade Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Long">Long</SelectItem>
              <SelectItem value="Short">Short</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all">
            <SelectTrigger className="bg-input-background">
              <SelectValue placeholder="Session" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sessions</SelectItem>
              <SelectItem value="crazy">Crazy</SelectItem>
              <SelectItem value="conservative">Conservative Swing</SelectItem>
              <SelectItem value="breakout">Breakout Hunter</SelectItem>
              <SelectItem value="mean">Mean Reversion</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Trades Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium">Trade ID</th>
                <th className="text-left py-4 px-6 text-sm font-medium">Asset</th>
                <th className="text-left py-4 px-6 text-sm font-medium">Type</th>
                <th className="text-right py-4 px-6 text-sm font-medium">Entry Price</th>
                <th className="text-right py-4 px-6 text-sm font-medium">Exit Price</th>
                <th className="text-right py-4 px-6 text-sm font-medium">Position Size</th>
                <th className="text-right py-4 px-6 text-sm font-medium">P&L</th>
                <th className="text-left py-4 px-6 text-sm font-medium">Session</th>
                <th className="text-left py-4 px-6 text-sm font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrades.map((trade) => (
                <tr key={trade.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                  <td className="py-4 px-6">
                    <span className="font-mono text-sm">{trade.id}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-medium">{trade.asset}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        trade.type === "Long"
                          ? "bg-success/10 text-success"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {trade.type}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right font-mono text-sm">
                    ${trade.entryPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-4 px-6 text-right font-mono text-sm">
                    ${trade.exitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-4 px-6 text-right">{trade.positionSize}</td>
                  <td className={`py-4 px-6 text-right font-semibold ${trade.pnl >= 0 ? "text-success" : "text-destructive"}`}>
                    {trade.pnl >= 0 ? "+" : ""}${trade.pnl.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-4 px-6 text-sm text-muted-foreground">{trade.session}</td>
                  <td className="py-4 px-6 text-sm text-muted-foreground">{trade.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTrades.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            <p>No trades found matching your filters.</p>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-sm text-muted-foreground mb-1">Total Trades</p>
          <p className="text-2xl font-semibold">{filteredTrades.length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-sm text-muted-foreground mb-1">Win Rate</p>
          <p className="text-2xl font-semibold text-success">
            {((filteredTrades.filter((t) => t.pnl > 0).length / filteredTrades.length) * 100).toFixed(1)}%
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-sm text-muted-foreground mb-1">Total P&L</p>
          <p className={`text-2xl font-semibold ${filteredTrades.reduce((sum, t) => sum + t.pnl, 0) >= 0 ? "text-success" : "text-destructive"}`}>
            ${filteredTrades.reduce((sum, t) => sum + t.pnl, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-sm text-muted-foreground mb-1">Avg P&L per Trade</p>
          <p className={`text-2xl font-semibold ${filteredTrades.reduce((sum, t) => sum + t.pnl, 0) / filteredTrades.length >= 0 ? "text-success" : "text-destructive"}`}>
            ${(filteredTrades.reduce((sum, t) => sum + t.pnl, 0) / filteredTrades.length).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>
    </div>
  );
}
