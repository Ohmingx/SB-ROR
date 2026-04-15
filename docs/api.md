# API Documentation (overview)

Backtesting service (default port 8001):

- POST /backtest/run
  - payload: { symbol, strategy, start?, end?, params? }
  - response: { symbol, strategy, metrics, equity_series, last_rows }

Live trading service (default port 8002):

- POST /trade/execute
  - payload: { symbol, side, qty, price? }
  - response: { status, portfolio }

- GET /portfolio
  - response: current portfolio snapshot

- WebSocket /ws/trades/{client_id}
  - simple message broadcast for demo streaming and replay

Notes:

- The frontend `src/app/services/api.ts` contains convenience wrappers for calling these endpoints.
