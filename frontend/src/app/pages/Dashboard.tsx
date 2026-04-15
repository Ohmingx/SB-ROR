import { Link } from "react-router";
import MetricCard from "../components/MetricCard";
import { Button } from "../components/ui/button";
import { Clock, TrendingUp, Target, DollarSign, FolderOpen, ArrowRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

export default function Dashboard() {
  const equityData = [
    { date: "Jan", value: 100000 },
    { date: "Feb", value: 102500 },
    { date: "Mar", value: 98000 },
    { date: "Apr", value: 105000 },
    { date: "May", value: 112000 },
    { date: "Jun", value: 118500 },
  ];

  const tradesBySymbol = [
    { symbol: "BTCUSDT", trades: 45 },
    { symbol: "ETHUSDT", trades: 32 },
    { symbol: "AAPL", trades: 28 },
    { symbol: "TSLA", trades: 21 },
    { symbol: "SPY", trades: 15 },
  ];

  const recentSessions = [
    { name: "Scalping Strategy", trades: 45, winRate: "68%", pnl: "+$5,420" },
    { name: "Swing Trading", trades: 12, winRate: "75%", pnl: "+$8,230" },
    { name: "Trend Following", trades: 28, winRate: "62%", pnl: "+$3,150" },
    { name: "Mean Reversion", trades: 34, winRate: "58%", pnl: "-$1,240" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your trading overview.</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <MetricCard title="Time Invested" value="148h" icon={Clock} />
        <MetricCard title="Trades Taken" value="141" icon={TrendingUp} trend={{ value: "+12%", positive: true }} />
        <MetricCard title="Win Rate" value="64.5%" icon={Target} trend={{ value: "+2.3%", positive: true }} />
        <MetricCard title="Profit Factor" value="2.34" icon={DollarSign} trend={{ value: "+0.15", positive: true }} />
        <MetricCard title="Total Sessions" value="12" icon={FolderOpen} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Equity Curve */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Equity Curve</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={equityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#121826",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                }}
              />
              <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Trades by Symbol */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Trades by Symbol</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={tradesBySymbol}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="symbol" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#121826",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="trades" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Recent Sessions</h2>
          <Link to="/app/sessions">
            <Button variant="outline" size="sm">
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Session Name</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Trades</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Win Rate</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">P&L</th>
              </tr>
            </thead>
            <tbody>
              {recentSessions.map((session, index) => (
                <tr key={index} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4">{session.name}</td>
                  <td className="py-3 px-4">{session.trades}</td>
                  <td className="py-3 px-4">{session.winRate}</td>
                  <td className={`py-3 px-4 font-medium ${session.pnl.startsWith('+') ? 'text-success' : 'text-destructive'}`}>
                    {session.pnl}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <Link to="/app/sessions">
            <Button className="w-full">
              <FolderOpen className="w-4 h-4 mr-2" />
              Create New Session
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
