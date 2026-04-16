import asyncio
import pandas as pd
from typing import Callable, Any
from ..shared.db import SessionLocal, MarketData

class MarketReplayServer:
    def __init__(self, callback: Callable[[dict], Any]):
        self.callback = callback
        self.is_playing = False
        self.speed = 1.0  # seconds between candles
        self.task = None
        self.df = None
        self.current_index = 0

    def load_data(self, symbol: str, start: str, end: str):
        db = SessionLocal()
        try:
            # Load from Timescale DB
            query = db.query(MarketData).filter(
                MarketData.symbol == symbol,
                MarketData.time >= start,
                MarketData.time <= end
            ).order_by(MarketData.time.asc())
            
            # Read into dataframe
            data = [{
                'time': r.time.isoformat(), 
                'open': r.open, 
                'high': r.high, 
                'low': r.low, 
                'close': r.close, 
                'volume': r.volume
            } for r in query.all()]
            
            self.df = pd.DataFrame(data)
            self.current_index = 0
            
            # Use regime classifier if we want historical overlays
            from ..backtesting.regime import classify_regimes
            if not self.df.empty:
                # We need numeric data for regime classifier
                temp_df = self.df.copy()
                temp_df['Close'] = temp_df['close']
                temp_df['High'] = temp_df['high']
                temp_df['Low'] = temp_df['low']
                temp_df = classify_regimes(temp_df)
                self.df['regime'] = temp_df['regime']
                
        finally:
            db.close()

    async def _stream_loop(self):
        while self.is_playing and self.df is not None and self.current_index < len(self.df):
            row = self.df.iloc[self.current_index].to_dict()
            payload = {
                "type": "market_data",
                "data": row
            }
            await self.callback(payload)
            self.current_index += 1
            await asyncio.sleep(self.speed)
                
        if self.current_index >= len(self.df) if self.df is not None else 0:
            self.is_playing = False
            await self.callback({"type": "replay_end"})

    def play(self):
        if not self.is_playing:
            self.is_playing = True
            self.task = asyncio.create_task(self._stream_loop())

    def pause(self):
        self.is_playing = False
        if self.task:
            self.task.cancel()
            self.task = None

    def set_speed(self, speed: float):
        self.speed = speed
