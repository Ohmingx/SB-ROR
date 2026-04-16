import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta
from ..shared.db import SessionLocal, MarketData

def ingest_data(symbol: str, start_date: str = None, end_date: str = None, interval: str = "1d"):
    """
    Ingests market data from yfinance into TimescaleDB.
    """
    if not start_date:
        start_date = (datetime.utcnow() - timedelta(days=365)).strftime('%Y-%m-%d')
    if not end_date:
        end_date = datetime.utcnow().strftime('%Y-%m-%d')
        
    print(f"Fetching data for {symbol} from {start_date} to {end_date} (interval: {interval})...")
    df = yf.download(symbol, start=start_date, end=end_date, interval=interval, progress=False)
    
    if df.empty:
        print(f"No data fetched for {symbol}")
        return

    # yfinance multi-index column handling if necessary
    if isinstance(df.columns, pd.MultiIndex):
        # Flatten multiindex columns from yfinance's new output formatting
        df.columns = [col[0] for col in df.columns]
    
    df = df.dropna()
    
    db = SessionLocal()
    try:
        records_to_insert = []
        for index, row in df.iterrows():
            record = MarketData(
                time=index,
                symbol=symbol,
                open=float(row['Open']),
                high=float(row['High']),
                low=float(row['Low']),
                close=float(row['Close']),
                volume=float(row['Volume'])
            )
            # Use merge to overwrite duplicates (upsert behavior)
            db.merge(record)
        
        db.commit()
        print(f"Successfully ingested {len(df)} records for {symbol}.")
    except Exception as e:
        db.rollback()
        print(f"Error ingesting data for {symbol}: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    # Example usage:
    # python -m backend.data.ingestion
    ingest_data("RELIANCE.NS")
    ingest_data("TCS.NS")
    ingest_data("INFY.NS")
