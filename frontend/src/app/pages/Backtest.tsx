import React, { useState } from 'react';
import { runBacktest } from '../services/api';
import TradingChart from '../components/TradingChart';
import { Button } from '../components/ui/button';
import { RefreshCw, TrendingUp, AlertTriangle } from 'lucide-react';

export default function BacktestPage() {
  const [symbol, setSymbol] = useState('RELIANCE.NS');
  const [strategy, setStrategy] = useState('sma');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function handleRun() {
    setLoading(true);
    try {
      // Assuming runBacktest is implemented in api.ts
      const res = await runBacktest({ symbol, strategy });
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 h-full bg-background flex flex-col gap-6 overflow-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Backtest Results</h1>
          <p className="text-sm text-muted-foreground">Historical evaluation and performance metrics.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRun} disabled={loading}>
            {loading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            Reload Previous
          </Button>
        </div>
      </div>

      {!result && !loading && (
        <div className="flex-1 flex flex-col items-center justify-center p-12 bg-card border border-dashed border-border rounded-lg text-muted-foreground">
          <TrendingUp className="w-16 h-16 mb-4 opacity-50" />
          <p className="text-lg mb-2">No Results Yet</p>
          <p className="text-sm max-w-md text-center">Run a strategy from the Strategy Builder to view detailed equity curves and metrics.</p>
        </div>
      )}

      {loading && (
        <div className="flex-1 flex items-center justify-center">
          <RefreshCw className="w-12 h-12 text-primary animate-spin" />
        </div>
      )}

      {result && !loading && (
        <>
          {/* Equity Chart */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold text-lg mb-4">Equity Curve</h3>
            <div className="h-[400px]">
                {/* Note: We use TradingChart component to draw equity array. Needs mapping API result to expected chart format. */}
               <TradingChart height={400} />
            </div>
          </div>

          {/* Metrics Panel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <p className="text-sm text-muted-foreground mb-1">CAGR</p>
              <h4 className="text-3xl font-bold text-success">
                {(result.metrics?.cagr * 100).toFixed(2)}%
              </h4>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <p className="text-sm text-muted-foreground mb-1">Sharpe Ratio</p>
              <h4 className="text-3xl font-bold text-primary">
                {result.metrics?.sharpe?.toFixed(2)}
              </h4>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <p className="text-sm text-muted-foreground mb-1">Max Drawdown</p>
              <h4 className="text-3xl font-bold text-destructive flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                {(result.metrics?.max_drawdown * 100).toFixed(2)}%
              </h4>
            </div>
          </div>

          {/* Regime Tags (if any exist) */}
          {result.metrics?.regime_stats && (
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-4">Regime-Wise Performance</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(result.metrics.regime_stats).map(([regime, stats]: [string, any]) => (
                  <div key={regime} className="p-4 bg-muted/20 border border-border rounded-lg flex flex-col items-center">
                    <span className="text-xs uppercase font-bold tracking-wider text-muted-foreground mb-2">{regime}</span>
                    <span className={`text-lg font-semibold ${stats.annualized_return > 0 ? 'text-success' : 'text-destructive'}`}>
                        {(stats.annualized_return * 100).toFixed(2)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
