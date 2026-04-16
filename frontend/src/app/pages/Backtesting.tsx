import { useState, useEffect, useRef } from "react";
import TradingChart from "../components/TradingChart";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { Play, Pause, SkipForward, SkipBack, Save, DownloadCloud } from "lucide-react";

export default function Backtesting() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState("1000"); // MS per candle
  const [positionSize, setPositionSize] = useState("1");
  const [stopLoss, setStopLoss] = useState("");
  const [takeProfit, setTakeProfit] = useState("");
  
  // Websocket State
  const wsRef = useRef<WebSocket | null>(null);
  const [marketData, setMarketData] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Generate random client ID
    const clientId = Math.random().toString(36).substring(7);
    const wsUrl = `ws://localhost:8002/ws/trades/${clientId}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => setIsConnected(true);
    ws.onclose = () => setIsConnected(false);
    
    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === 'market_data') {
           setMarketData(prev => {
             // Keep last 500 candles max
             const updated = [...prev, payload.data];
             if(updated.length > 500) return updated.slice(-500);
             return updated;
           });
        }
      } catch (err) {}
    };

    wsRef.current = ws;
    return () => ws.close();
  }, []);

  const handleSocketCommand = (cmd: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(cmd));
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      handleSocketCommand({ command: 'pause' });
    } else {
      handleSocketCommand({ command: 'play' });
    }
    setIsPlaying(!isPlaying);
  };
  
  const handleLoadData = () => {
      handleSocketCommand({ command: 'load', symbol: 'RELIANCE.NS', start: '2023-01-01', end: '2024-01-01' });
      setMarketData([]); // flush state
      alert("Loading engine data...");
  };

  const handleSpeedChange = (val: string) => {
      setSpeed(val);
      handleSocketCommand({ command: 'speed', ms: parseInt(val) });
  };

  const [strategyCode, setStrategyCode] = useState(
`# Example Strategy
if sma(50) crosses above sma(200):
    buy()

if sma(50) crosses below sma(200):
    sell()

# Risk Management
if profit >= 5%:
    take_profit()

if loss >= 2%:
    stop_loss()`
  );

  const indicators = [
    { name: "SMA", period: 50 },
    { name: "SMA", period: 200 },
    { name: "EMA", period: 20 },
    { name: "RSI", period: 14 },
  ];

  const [selectedIndicators, setSelectedIndicators] = useState(["SMA 50", "SMA 200"]);

  return (
    <div className="h-screen flex">
      {/* Left Side - Chart */}
      <div className="flex-1 flex flex-col p-6 overflow-auto">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                  Market Replay
                  <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-success' : 'bg-destructive'}`}></span>
              </h1>
              <p className="text-sm text-muted-foreground">RELIANCE.NS • 1D</p>
            </div>
            <div className="flex items-center gap-4">
              <Button onClick={handleLoadData} size="sm" variant="outline">
                  <DownloadCloud className="w-4 h-4 mr-2" /> Load Ticker
              </Button>
              <div className="flex flex-col items-end">
                  <span className="text-sm text-muted-foreground">Current Simulated Price:</span>
                  <span className="text-lg font-semibold text-success">
                      ${marketData.length > 0 ? Number(marketData[marketData.length-1].close).toFixed(2) : "0.00"}
                  </span>
              </div>
            </div>
          </div>

          {/* Indicators */}
          <div className="flex gap-2 flex-wrap">
            {selectedIndicators.map((indicator, index) => (
              <span key={index} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                {indicator}
              </span>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="bg-card border border-border rounded-lg p-4 mb-4 flex-1 min-h-[400px]">
          <TradingChart height={500} data={marketData.length > 0 ? marketData.map(d => ({time: new Date(d.time).getTime()/1000, open: d.open, high: d.high, low: d.low, close: d.close})) : undefined} />
        </div>

        {/* Replay Controls */}
        <div className="bg-card border border-border rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => {}}
              >
                <SkipBack className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                onClick={togglePlay}
                className="w-12 h-12"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {}}
              >
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Speed:</span>
              <Select value={speed} onValueChange={handleSpeedChange}>
                <SelectTrigger className="w-24 bg-input-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2000">Slow</SelectItem>
                  <SelectItem value="1000">1x (1s)</SelectItem>
                  <SelectItem value="300">Fast</SelectItem>
                  <SelectItem value="50">Turbo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-muted-foreground">
              Candle: <span className="text-foreground font-medium">234 / 500</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-primary w-[46.8%] transition-all" />
          </div>
        </div>

        {/* Trade Controls */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold mb-4">Trade Controls</h3>

          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="space-y-2">
              <Label>Position Size</Label>
              <Input
                type="number"
                value={positionSize}
                onChange={(e) => setPositionSize(e.target.value)}
                className="bg-input-background"
              />
            </div>

            <div className="space-y-2">
              <Label>Stop Loss ($)</Label>
              <Input
                type="number"
                placeholder="50000"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                className="bg-input-background"
              />
            </div>

            <div className="space-y-2">
              <Label>Take Profit ($)</Label>
              <Input
                type="number"
                placeholder="52000"
                value={takeProfit}
                onChange={(e) => setTakeProfit(e.target.value)}
                className="bg-input-background"
              />
            </div>

            <div className="space-y-2 flex items-end">
              <Select defaultValue="limit">
                <SelectTrigger className="bg-input-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="market">Market</SelectItem>
                  <SelectItem value="limit">Limit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4">
            <Button className="flex-1 bg-success hover:bg-success/90">
              Buy / Long
            </Button>
            <Button className="flex-1 bg-destructive hover:bg-destructive/90">
              Sell / Short
            </Button>
          </div>
        </div>
      </div>

      {/* Right Side - Strategy Editor */}
      <div className="w-[400px] border-l border-border flex flex-col bg-card">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold mb-1">Strategy Editor</h2>
          <p className="text-sm text-muted-foreground">Write and test your strategy</p>
        </div>

        <div className="flex-1 p-6 overflow-auto">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Strategy Code</Label>
              <Textarea
                value={strategyCode}
                onChange={(e) => setStrategyCode(e.target.value)}
                className="font-mono text-sm bg-input-background min-h-[400px]"
                placeholder="Write your strategy..."
              />
            </div>

            <div className="space-y-2">
              <Label>Indicators</Label>
              <div className="space-y-2">
                {indicators.map((indicator, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-input-background rounded-lg">
                    <span className="text-sm">
                      {indicator.name} ({indicator.period})
                    </span>
                    <Button variant="outline" size="sm">
                      Add
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-border space-y-3">
          <Button className="w-full">
            <Play className="w-4 h-4 mr-2" />
            Run Strategy
          </Button>
          <Button variant="outline" className="w-full">
            <Save className="w-4 h-4 mr-2" />
            Save Strategy
          </Button>
        </div>
      </div>
    </div>
  );
}
