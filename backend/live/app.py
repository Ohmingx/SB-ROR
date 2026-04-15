from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Any
import asyncio
from ..shared.auth import create_access_token, get_current_user, get_db, verify_password
from ..shared.db import SessionLocal, create_demo_user, User

app = FastAPI(title="SB-ROR Live/Paper Trading API")


class Order(BaseModel):
    symbol: str
    side: str  # buy or sell
    qty: float
    price: float = None


# In-memory portfolio (demo). In production, persist in DB.
PORTFOLIO: Dict[str, Any] = {"cash": 100000.0, "positions": {}}


@app.post("/trade/execute")
async def execute_order(order: Order, user=Depends(get_current_user)):
    if order.price is None or order.price <= 0:
        raise HTTPException(status_code=400, detail="Price must be provided for simulation")
    price = order.price
    cost = price * order.qty
    if order.side.lower() == "buy":
        if PORTFOLIO["cash"] < cost:
            return {"status": "rejected", "reason": "insufficient cash"}
        PORTFOLIO["cash"] -= cost
        pos = PORTFOLIO["positions"].get(order.symbol, 0.0)
        PORTFOLIO["positions"][order.symbol] = pos + order.qty
    else:
        pos = PORTFOLIO["positions"].get(order.symbol, 0.0)
        if pos < order.qty:
            return {"status": "rejected", "reason": "insufficient position"}
        PORTFOLIO["positions"][order.symbol] = pos - order.qty
        PORTFOLIO["cash"] += cost

    return {"status": "filled", "portfolio": PORTFOLIO}


@app.get("/portfolio")
async def get_portfolio(user=Depends(get_current_user)):
    return PORTFOLIO


class ConnectionManager:
    def __init__(self):
        self.active: Dict[str, WebSocket] = {}

    async def connect(self, ws: WebSocket, client_id: str):
        await ws.accept()
        self.active[client_id] = ws

    def disconnect(self, client_id: str):
        self.active.pop(client_id, None)

    async def broadcast(self, message: dict):
        for ws in list(self.active.values()):
            try:
                await ws.send_json(message)
            except Exception:
                pass


manager = ConnectionManager()


@app.websocket("/ws/trades/{client_id}")
async def websocket_trades(ws: WebSocket, client_id: str):
    await manager.connect(ws, client_id)
    try:
        while True:
            data = await ws.receive_json()
            # echo or broadcast simple messages
            await manager.broadcast({"from": client_id, "payload": data})
    except WebSocketDisconnect:
        manager.disconnect(client_id)


@app.post("/auth/token")
async def auth_token(username: str, password: str):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.username == username).first()
        if not user:
            from ..shared.auth import get_password_hash
            user = create_demo_user(username=username, password_hash=get_password_hash(password))
        if not verify_password(password, user.hashed_password):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        token = create_access_token({"sub": username})
        return {"access_token": token, "token_type": "bearer"}
    finally:
        db.close()
