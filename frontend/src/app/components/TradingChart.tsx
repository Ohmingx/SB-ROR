import { useEffect, useRef, useState } from "react";
import {
  createChart,
  ColorType,
  IChartApi,
  ISeriesApi,
  CandlestickSeries,
  LineSeries,
  createSeriesMarkers,
} from "lightweight-charts";

interface Candle {
  time: number | string;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface TradingChartProps {
  data?: Candle[];
  height?: number;
}

export default function TradingChart({ data, height = 500 }: TradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  const [replayIndex, setReplayIndex] = useState(20);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const container = chartContainerRef.current;

    const chart = createChart(container, {
      width: container.clientWidth || 800,
      height,
      layout: {
        background: { type: ColorType.Solid, color: "#121826" },
        textColor: "#9ca3af",
      },
      grid: {
        vertLines: { color: "rgba(255,255,255,0.05)" },
        horzLines: { color: "rgba(255,255,255,0.05)" },
      },
      timeScale: {
        timeVisible: true,
      },
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#10b981",
      downColor: "#ef4444",
      borderVisible: false,
      wickUpColor: "#10b981",
      wickDownColor: "#ef4444",
    });

    const smaSeries = chart.addSeries(LineSeries, {
      color: "#facc15",
      lineWidth: 2,
    });

    const emaSeries = chart.addSeries(LineSeries, {
      color: "#60a5fa",
      lineWidth: 2,
    });

    const equitySeries = chart.addSeries(LineSeries, {
      color: "#a855f7",
      lineWidth: 2,
    });

    const chartData = data || generateSampleData();

    candleSeries.setData(chartData);

    smaSeries.setData(calculateSMA(chartData, 14));
    emaSeries.setData(calculateEMA(chartData, 14));
    equitySeries.setData(generateEquityCurve(chartData));

    const markers = generateTradeMarkers(chartData);

    createSeriesMarkers(candleSeries, markers);

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;

    const handleResize = () => {
      chart.applyOptions({
        width: container.clientWidth,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [data, height]);

  const stepForward = () => {
    if (!candleSeriesRef.current) return;

    const chartData = data || generateSampleData();
    const next = replayIndex + 1;

    if (next >= chartData.length) return;

    setReplayIndex(next);

    candleSeriesRef.current.update(chartData[next]);
  };

  return (
    <div>
      <div
        ref={chartContainerRef}
        style={{ width: "100%", height }}
      />

      <div className="flex gap-2 mt-3">
        <button
          onClick={stepForward}
          className="px-3 py-1 bg-blue-600 text-white rounded"
        >
          Replay Next
        </button>
      </div>
    </div>
  );
}

function calculateSMA(data: Candle[], period: number) {
  const result: any[] = [];

  for (let i = period; i < data.length; i++) {
    let sum = 0;

    for (let j = 0; j < period; j++) {
      sum += data[i - j].close;
    }

    result.push({
      time: data[i].time,
      value: sum / period,
    });
  }

  return result;
}

function calculateEMA(data: Candle[], period: number) {
  const result: any[] = [];
  const multiplier = 2 / (period + 1);

  let ema = data[0].close;

  data.forEach((c) => {
    ema = (c.close - ema) * multiplier + ema;

    result.push({
      time: c.time,
      value: ema,
    });
  });

  return result;
}

function generateTradeMarkers(data: Candle[]) {
  const markers: any[] = [];

  for (let i = 10; i < data.length; i += 20) {
    markers.push({
      time: data[i].time,
      position: "belowBar",
      color: "#22c55e",
      shape: "arrowUp",
      text: "BUY",
    });

    if (data[i + 5]) {
      markers.push({
        time: data[i + 5].time,
        position: "aboveBar",
        color: "#ef4444",
        shape: "arrowDown",
        text: "SELL",
      });
    }
  }

  return markers;
}

function generateEquityCurve(data: Candle[]) {
  let equity = 10000;

  return data.map((c) => {
    equity += (Math.random() - 0.5) * 200;

    return {
      time: c.time,
      value: equity,
    };
  });
}

function generateSampleData(): Candle[] {
  const data: Candle[] = [];

  let price = 50000;
  const now = Math.floor(Date.now() / 1000);
  const oneDay = 86400;

  for (let i = 120; i >= 0; i--) {
    const time = now - i * oneDay;

    const open = price + (Math.random() - 0.5) * 500;
    const close = open + (Math.random() - 0.5) * 500;

    const high = Math.max(open, close) + Math.random() * 200;
    const low = Math.min(open, close) - Math.random() * 200;

    data.push({ time, open, high, low, close });

    price = close;
  }

  return data;
}