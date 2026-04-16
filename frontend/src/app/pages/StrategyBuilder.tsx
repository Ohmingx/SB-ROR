import React, { useState } from 'react';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

export default function StrategyBuilder() {
  const [strategy, setStrategy] = useState("sma");
  const [symbol, setSymbol] = useState("RELIANCE.NS");
  const [startDate, setStartDate] = useState("2023-01-01");
  const [endDate, setEndDate] = useState("2024-01-01");

  // Strategy SpecificParams
  const [smaShort, setSmaShort] = useState("50");
  const [smaLong, setSmaLong] = useState("200");
  
  const [rsiPeriod, setRsiPeriod] = useState("14");
  const [rsiBuy, setRsiBuy] = useState("30");
  const [rsiSell, setRsiSell] = useState("70");

  const handleBacktest = async () => {
    // Collect params based on strat
    let params: any = {};
    if (strategy === "sma") {
      params = { short: parseInt(smaShort), long: parseInt(smaLong) };
    } else if (strategy === "rsi") {
      params = { period: parseInt(rsiPeriod), buy: parseInt(rsiBuy), sell: parseInt(rsiSell) };
    }
    
    // In actual implementation, send to backend
    console.log("Running backtest for:", symbol, strategy, params);
    alert(`Backtest Submitted for ${symbol} with ${strategy.toUpperCase()} strategy.`);
  };

  return (
    <div className="p-6 h-full bg-background flex flex-col gap-6 overflow-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Strategy Builder</h1>
          <p className="text-sm text-muted-foreground">Configure indicator parameters, asset pairs, and run simulated backtests.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
        {/* Core Settings */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-4 shadow-sm">
          <h3 className="font-semibold text-lg border-b border-border pb-2">Simulation Setup</h3>
          
          <div className="space-y-2">
            <Label>Symbol (NSE ticker)</Label>
            <Input 
              value={symbol} 
              onChange={(e) => setSymbol(e.target.value)} 
              placeholder="e.g. RELIANCE.NS" 
              className="bg-input-background"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input 
                type="date"
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)} 
                className="bg-input-background"
              />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input 
                type="date"
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)} 
                className="bg-input-background"
              />
            </div>
          </div>
          
          <div className="space-y-2 pt-2">
            <Label>Select Strategy Logic</Label>
            <Select value={strategy} onValueChange={setStrategy}>
              <SelectTrigger className="bg-input-background">
                <SelectValue placeholder="Strategy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sma">SMA Crossover</SelectItem>
                <SelectItem value="rsi">RSI Mean Reversion</SelectItem>
                <SelectItem value="macd">MACD Momentum</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Dynamic Parameter Settings */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-4 shadow-sm">
          <h3 className="font-semibold text-lg border-b border-border pb-2">Indicator Parameters</h3>
          
          {strategy === "sma" && (
            <div className="space-y-4 animate-in fade-in zoom-in duration-300">
              <div className="space-y-2">
                <Label>Short Window</Label>
                <Input 
                  type="number"
                  value={smaShort} 
                  onChange={(e) => setSmaShort(e.target.value)} 
                  className="bg-input-background"
                />
              </div>
              <div className="space-y-2">
                <Label>Long Window</Label>
                <Input 
                  type="number"
                  value={smaLong} 
                  onChange={(e) => setSmaLong(e.target.value)} 
                  className="bg-input-background"
                />
              </div>
            </div>
          )}

          {strategy === "rsi" && (
            <div className="space-y-4 animate-in fade-in zoom-in duration-300">
              <div className="space-y-2">
                <Label>RSI Period</Label>
                <Input 
                  type="number"
                  value={rsiPeriod} 
                  onChange={(e) => setRsiPeriod(e.target.value)} 
                  className="bg-input-background"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Buy Threshold (Oversold)</Label>
                  <Input 
                    type="number"
                    value={rsiBuy} 
                    onChange={(e) => setRsiBuy(e.target.value)} 
                    className="bg-input-background text-success"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sell Threshold (Overbought)</Label>
                  <Input 
                    type="number"
                    value={rsiSell} 
                    onChange={(e) => setRsiSell(e.target.value)} 
                    className="bg-input-background text-destructive"
                  />
                </div>
              </div>
            </div>
          )}

          {strategy === "macd" && (
            <div className="p-4 bg-muted/20 text-muted-foreground rounded-lg border border-dashed border-border flex items-center justify-center">
              MACD uses default params (12, 26, 9)
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end mt-auto">
        <Button size="lg" className="w-full md:w-auto md:min-w-[200px]" onClick={handleBacktest}>
          Execute Backtest Engine
        </Button>
      </div>
    </div>
  );
}
