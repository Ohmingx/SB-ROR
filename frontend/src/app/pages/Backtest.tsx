import React, { useState } from 'react';
import { runBacktest } from '../services/api';

export default function BacktestPage() {
  const [symbol, setSymbol] = useState('RELIANCE.NS');
  const [strategy, setStrategy] = useState('sma');
  const [result, setResult] = useState<any>(null);

  async function handleRun() {
    const res = await runBacktest({ symbol, strategy });
    setResult(res);
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Backtest</h2>
      <div className="my-2">
        <input value={symbol} onChange={e => setSymbol(e.target.value)} className="border p-1 mr-2" />
        <select value={strategy} onChange={e => setStrategy(e.target.value)} className="border p-1 mr-2">
          <option value="sma">SMA</option>
          <option value="rsi">RSI</option>
          <option value="macd">MACD</option>
        </select>
        <button onClick={handleRun} className="btn">Run</button>
      </div>

      {result && (
        <div className="mt-4">
          <h3>Metrics</h3>
          <pre className="bg-gray-100 p-2">{JSON.stringify(result.metrics, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
