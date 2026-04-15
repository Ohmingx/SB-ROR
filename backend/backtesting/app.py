from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from .engine import run_backtest
from ..shared.auth import create_access_token

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


@app.post("/auth/token")
async def auth_token(username: str, password: str):
    # Scaffolding: in real app validate user cred against DB
    if username == "demo" and password == "demo":
        token = create_access_token({"sub": username})
        return {"access_token": token, "token_type": "bearer"}
    raise HTTPException(status_code=401, detail="Invalid credentials")
