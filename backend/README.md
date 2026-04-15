# Backend README

This folder contains backend utilities and services for SB-ROR.

Setup (recommended):

1. Create and activate a virtual environment outside the repository root:

   - Windows (PowerShell):
     ```powershell
     python -m venv .venv
     .\.venv\Scripts\Activate.ps1
     ```

   - Unix/macOS:
     ```bash
     python3 -m venv .venv
     source .venv/bin/activate
     ```

2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Run the backend service (if using FastAPI):

   ```bash
   uvicorn app:app --reload --host 0.0.0.0 --port 8000
   ```

Notes:
- Do NOT commit virtual environments into the repository. Use the project's root `.gitignore`.
- Add a proper `app.py` entrypoint if the FastAPI service is created.
