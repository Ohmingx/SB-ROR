from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from .engine import run_backtest

app = FastAPI(title="SB-ROR Backtesting API")


class BacktestRequest(BaseModel):
    symbol: str
    strategy: str = "sma"
    start: str = "2015-01-01"
    end: str = "2024-12-31"
    params: dict = {}


@app.post("/backtest/run")
async def api_run_backtest(req: BacktestRequest):
    try:
        result = run_backtest(req.symbol, req.strategy, req.start, req.end, req.params)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
