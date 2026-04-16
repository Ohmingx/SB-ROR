import pandas as pd
import numpy as np
import yfinance as yf
from typing import Tuple, Dict
from .regime import classify_regimes


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


def performance_metrics(equity: pd.Series, df: pd.DataFrame = None) -> Dict:
    returns = equity.pct_change().dropna()
    if len(returns) == 0:
        return {"sharpe": 0.0, "cagr": 0.0, "max_drawdown": 0.0}
    sharpe = (returns.mean() / returns.std()) * np.sqrt(252) if returns.std() != 0 else 0
    total_return = equity.iloc[-1] / equity.iloc[0] - 1
    days = (equity.index[-1] - equity.index[0]).days if hasattr(equity.index, 'dtype') else len(equity)
    cagr = (1 + total_return) ** (365.0 / max(days, 1)) - 1
    roll_max = equity.cummax()
    drawdown = (equity - roll_max) / roll_max
    max_dd = drawdown.min()
    
    metrics = {"sharpe": float(sharpe), "cagr": float(cagr), "max_drawdown": float(max_dd)}
    
    # Calculate regime-wise metrics if regime is present
    if df is not None and "regime" in df.columns:
        regime_stats = {}
        for regime in df['regime'].unique():
            regime_returns = df.loc[df['regime'] == regime, 'strategy_returns']
            if len(regime_returns) > 0:
                ann_return = regime_returns.mean() * 252
                regime_stats[regime] = {"annualized_return": float(ann_return)}
        metrics["regime_stats"] = regime_stats
        
    return metrics


def run_vector_backtest(df: pd.DataFrame, trading_fee: float = 0.001) -> Tuple[pd.Series, pd.DataFrame]:
    df = df.copy()
    # The 'position' represents whether we are in the market on a given day.
    df["position"] = df["signal"].shift(1).fillna(0)
    df["returns"] = df["Close"].pct_change().fillna(0)
    
    # Calculate transaction costs when position changes
    df["trades"] = df["position"].diff().abs().fillna(0)
    df["costs"] = df["trades"] * trading_fee
    
    df["strategy_returns"] = (df["position"] * df["returns"]) - df["costs"]
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

    fee = float(params.get("fee", 0.001))
    equity, df_out = run_vector_backtest(df, trading_fee=fee)
    
    # Run Regime Classification and merge signals
    df_out = classify_regimes(df_out)
    
    metrics = performance_metrics(equity, df=df_out)

    return {
        "symbol": symbol,
        "strategy": strategy,
        "metrics": metrics,
        "equity_series": equity.tail(100).to_dict(),
        "last_rows": df_out.tail(20).reset_index().to_dict(orient="records"),
    }
