# Frontend README

Recommended package manager: `pnpm` (project uses `pnpm` overrides in `package.json`).

Setup:

1. Install `pnpm` (if not already):

   ```bash
   npm install -g pnpm
   ```

2. Install dependencies and generate a lockfile:

   ```bash
   cd frontend
   pnpm install
   ```

3. Run development server:

   ```bash
   pnpm dev
   ```

Notes:
- Add the generated `pnpm-lock.yaml` to version control to ensure reproducible installs.
- If you prefer `npm` or `yarn`, generate and commit the appropriate lockfile and update this README.

  # Trading Strategy Backtester UI

  This is a code bundle for Trading Strategy Backtester UI. The original project is available at https://www.figma.com/design/VmUfPf8vQeQQ4DmDGVr15Y/Trading-Strategy-Backtester-UI.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
  