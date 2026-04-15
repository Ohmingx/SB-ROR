import { createBrowserRouter } from "react-router";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Sessions from "./pages/Sessions";
import Backtesting from "./pages/Backtesting";
import Trades from "./pages/Trades";
import Analytics from "./pages/Analytics";
import Assets from "./pages/Assets";
import Settings from "./pages/Settings";
import AppLayout from "./components/AppLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/app",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "sessions",
        element: <Sessions />,
      },
      {
        path: "backtesting",
        element: <Backtesting />,
      },
      {
        path: "trades",
        element: <Trades />,
      },
      {
        path: "analytics",
        element: <Analytics />,
      },
      {
        path: "assets",
        element: <Assets />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
]);
