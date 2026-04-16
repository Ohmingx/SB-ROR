import pandas as pd
import numpy as np

def calculate_atr(df: pd.DataFrame, period: int = 14) -> pd.Series:
    high_low = df['High'] - df['Low']
    high_close = np.abs(df['High'] - df['Close'].shift())
    low_close = np.abs(df['Low'] - df['Close'].shift())
    ranges = pd.concat([high_low, high_close, low_close], axis=1)
    true_range = np.max(ranges, axis=1)
    return true_range.rolling(period).mean()

def classify_regimes(df: pd.DataFrame, atr_period: int = 14, sma_short: int = 20, sma_long: int = 50) -> pd.DataFrame:
    """
    Classifies market regimes based on Trend (SMA crossover) and Volatility (ATR relative to close price).
    Returns basic tags: 'Bull Volatile', 'Bull Quiet', 'Bear Volatile', 'Bear Quiet'.
    """
    df = df.copy()
    
    # Calculate indicators
    df['atr'] = calculate_atr(df, period=atr_period)
    df['sma_short'] = df['Close'].rolling(window=sma_short).mean()
    df['sma_long'] = df['Close'].rolling(window=sma_long).mean()
    
    # Volatility threshold: ATR % of close > 1.5%
    df['atr_pct'] = (df['atr'] / df['Close']) * 100
    median_atr_pct = df['atr_pct'].median()
    
    # Defaults
    df['trend'] = 'Range'
    df['volatility'] = 'Quiet'
    
    # Trend
    df.loc[df['sma_short'] > df['sma_long'], 'trend'] = 'Bull'
    df.loc[df['sma_short'] < df['sma_long'], 'trend'] = 'Bear'
    
    # Volatility
    df.loc[df['atr_pct'] > median_atr_pct, 'volatility'] = 'Volatile'
    
    df['regime'] = df['trend'] + ' ' + df['volatility']
    return df
