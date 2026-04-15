from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from .engine import run_backtest
from ..shared.auth import create_access_token, get_current_user
from ..shared.db import SessionLocal, create_demo_user
from ..shared.auth import verify_password
from ..shared.db import User

app = FastAPI(title="SB-ROR Backtesting API")


class BacktestRequest(BaseModel):
    symbol: str
    strategy: str = "sma"
    start: str = "2015-01-01"
    end: str = "2024-12-31"
    params: dict = {}


@app.post("/backtest/run")
async def api_run_backtest(req: BacktestRequest, user=Depends(get_current_user)):
    try:
        result = run_backtest(req.symbol, req.strategy, req.start, req.end, req.params)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/auth/token")
async def auth_token(username: str, password: str):
    # Validate against DB; create demo user if missing
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.username == username).first()
        if not user:
            # create demo user with provided password (only for dev)
            from ..shared.auth import get_password_hash
            user = create_demo_user(username=username, password_hash=get_password_hash(password))
        # verify password
        if not verify_password(password, user.hashed_password):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        token = create_access_token({"sub": username})
        return {"access_token": token, "token_type": "bearer"}
    finally:
        db.close()
