# SB-ROR — Project Summary

This repository is a modular full-stack trading system scaffold with:

- Frontend: React + Vite (UI, dashboards, strategy builder, replay, journal)
- Backtesting backend: FastAPI service that runs vectorized backtests (SMA, RSI, MACD)
- Live/Paper Trading backend: FastAPI + WebSocket service to simulate real-time trades and manage portfolio
- Database: SQLAlchemy models with default `sqlite` for local dev; configurable via `DATABASE_URL` to PostgreSQL/TimescaleDB

Key folders:

- `frontend/` — Vite + React app (keep existing code; added service layer and pages)
- `backend/backtesting/` — FastAPI app and engine code
- `backend/live/` — FastAPI app for trading and WebSocket
- `backend/shared/` — DB models and helpers
- `docs/` — project documentation and migration/history notes

Run (development):

1. Backend backtesting:

   ```bash
   cd backend
   python -m venv .venv
   .venv\Scripts\activate  # Windows
   pip install -r requirements.txt
   uvicorn backtesting.app:app --reload --port 8001
   ```

2. Backend live service:

   ```bash
   uvicorn live.app:app --reload --port 8002
   ```

3. Frontend:

   ```bash
   cd frontend
   pnpm install
   pnpm dev
   ```

Notes:

- The project intentionally ships scaffolding and clean separation between backtesting and live engines. The backtesting engine is vectorized using pandas for performance; the live engine uses WebSockets for streaming trade updates.
- Database is configurable; for production use, set `DATABASE_URL` to a Postgres/TimescaleDB instance and run the provided model migrations (or use `create_tables()` from `backend/shared/db.py`).
