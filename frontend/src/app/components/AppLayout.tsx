import { Outlet, Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  FolderOpen,
  TrendingUp,
  Receipt,
  BarChart3,
  Coins,
  Settings,
  User,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/app", icon: LayoutDashboard },
  { name: "Sessions", href: "/app/sessions", icon: FolderOpen },
  { name: "Backtesting", href: "/app/backtesting", icon: TrendingUp },
  { name: "Trades", href: "/app/trades", icon: Receipt },
  { name: "Analytics", href: "/app/analytics", icon: BarChart3 },
  { name: "Assets", href: "/app/assets", icon: Coins },
  { name: "Settings", href: "/app/settings", icon: Settings },
];

export default function AppLayout() {
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === "/app") {
      return location.pathname === "/app";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <h1 className="text-xl font-bold text-primary">QuantLab</h1>
          <p className="text-sm text-muted-foreground">Backtester</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sidebar-accent cursor-pointer transition-colors">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <User className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">John Trader</p>
              <p className="text-xs text-muted-foreground">john@example.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
