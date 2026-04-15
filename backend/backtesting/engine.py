import pandas as pd
import numpy as np
import yfinance as yf
from typing import Tuple, Dict


def fetch_price(symbol: str, start: str, end: str) -> pd.DataFrame:
    df = yf.download(symbol, start=start, end=end, progress=False)
    df = df.dropna()
    return df


def sma_signal(df: pd.DataFrame, short: int = 50, long: int = 200) -> pd.DataFrame:
    df = df.copy()
    df[f"sma_{short}"] = df["Close"].rolling(window=short).mean()
    df[f"sma_{long}"] = df["Close"].rolling(window=long).mean()
    df["signal"] = 0
    df.loc[df[f"sma_{short}"] > df[f"sma_{long}"], "signal"] = 1
    df.loc[df[f"sma_{short}"] < df[f"sma_{long}"], "signal"] = -1
    return df


def rsi(series: pd.Series, period: int = 14) -> pd.Series:
    delta = series.diff()
    up = delta.clip(lower=0)
    down = -1 * delta.clip(upper=0)
    ma_up = up.ewm(com=(period - 1), adjust=False).mean()
    ma_down = down.ewm(com=(period - 1), adjust=False).mean()
    rs = ma_up / ma_down
    return 100 - (100 / (1 + rs))


def rsi_signal(df: pd.DataFrame, period: int = 14, buy_thresh: int = 30, sell_thresh: int = 70) -> pd.DataFrame:
    df = df.copy()
    df["rsi"] = rsi(df["Close"], period)
    df["signal"] = 0
    df.loc[df["rsi"] < buy_thresh, "signal"] = 1
    df.loc[df["rsi"] > sell_thresh, "signal"] = -1
    return df


def macd_signal(df: pd.DataFrame, fast: int = 12, slow: int = 26, signal: int = 9) -> pd.DataFrame:
    df = df.copy()
    ema_fast = df["Close"].ewm(span=fast, adjust=False).mean()
    ema_slow = df["Close"].ewm(span=slow, adjust=False).mean()
    df["macd"] = ema_fast - ema_slow
    df["macd_signal"] = df["macd"].ewm(span=signal, adjust=False).mean()
    df["signal"] = 0
    df.loc[df["macd"] > df["macd_signal"], "signal"] = 1
    df.loc[df["macd"] < df["macd_signal"], "signal"] = -1
    return df


def performance_metrics(equity: pd.Series) -> Dict[str, float]:
    returns = equity.pct_change().dropna()
    if len(returns) == 0:
        return {"sharpe": 0.0, "cagr": 0.0, "max_drawdown": 0.0}
    sharpe = (returns.mean() / returns.std()) * np.sqrt(252)
    total_return = equity.iloc[-1] / equity.iloc[0] - 1
    days = (equity.index[-1] - equity.index[0]).days if hasattr(equity.index, 'dtype') else len(equity)
    cagr = (1 + total_return) ** (365.0 / max(days, 1)) - 1
    roll_max = equity.cummax()
    drawdown = (equity - roll_max) / roll_max
    max_dd = drawdown.min()
    return {"sharpe": float(sharpe), "cagr": float(cagr), "max_drawdown": float(max_dd)}


def run_vector_backtest(df: pd.DataFrame) -> Tuple[pd.Series, pd.DataFrame]:
    df = df.copy()
    df["position"] = df["signal"].shift(1).fillna(0)
    df["returns"] = df["Close"].pct_change().fillna(0)
    df["strategy_returns"] = df["position"] * df["returns"]
    df["equity"] = (1 + df["strategy_returns"]).cumprod()
    return df["equity"], df


def run_backtest(symbol: str, strategy: str = "sma", start: str = "2015-01-01", end: str = "2024-12-31", params: dict = None) -> dict:
    params = params or {}
    df = fetch_price(symbol, start, end)
    if df.empty:
        raise ValueError("No data for symbol")

    if strategy == "sma":
        short = int(params.get("short", 50))
        long = int(params.get("long", 200))
        df = sma_signal(df, short=short, long=long)
    elif strategy == "rsi":
        period = int(params.get("period", 14))
        buy = int(params.get("buy", 30))
        sell = int(params.get("sell", 70))
        df = rsi_signal(df, period=period, buy_thresh=buy, sell_thresh=sell)
    elif strategy == "macd":
        df = macd_signal(df)
    else:
        raise ValueError("Unsupported strategy")

    equity, df_out = run_vector_backtest(df)
    metrics = performance_metrics(equity)

    return {
        "symbol": symbol,
        "strategy": strategy,
        "metrics": metrics,
        "equity_series": equity.tail(100).to_dict(),
        "last_rows": df_out.tail(20).reset_index().to_dict(orient="records"),
    }
