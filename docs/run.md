Running the project locally

1) Start TimescaleDB and backends with Docker Compose (builds backend images):

    docker-compose up --build

2) Initialize the database and create a demo user (if using local SQLite or Postgres):

    python backend/scripts/init_db.py

3) Frontend: generate lockfile locally and run dev server

    cd frontend
    # install pnpm globally if needed
    npm install -g pnpm
    pnpm install
    pnpm dev

Notes:

- If you prefer not to build backend images, run backends locally with `uvicorn backend.backtesting.app:app --port 8001` and `uvicorn backend.live.app:app --port 8002`.
- Ensure `DATABASE_URL` is configured when using an external Postgres/Timescale instance.
