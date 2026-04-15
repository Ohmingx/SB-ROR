# Run both backend services for local development (PowerShell)
Write-Output "Starting backtesting service on port 8001 and live service on port 8002"
Start-Process -NoNewWindow -FilePath pwsh -ArgumentList "-NoExit","-Command","cd $PSScriptRoot/..; uvicorn backend.backtesting.app:app --reload --port 8001"
Start-Process -NoNewWindow -FilePath pwsh -ArgumentList "-NoExit","-Command","cd $PSScriptRoot/..; uvicorn backend.live.app:app --reload --port 8002"
Write-Output "Run frontend separately: cd frontend && pnpm dev"
