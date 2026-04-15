import MetricCard from "../components/MetricCard";
import { TrendingUp, Target, DollarSign, TrendingDown } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function Analytics() {
  const equityData = [
    { date: "Jan 1", equity: 100000 },
    { date: "Jan 15", equity: 102500 },
    { date: "Feb 1", equity: 105000 },
    { date: "Feb 15", equity: 103000 },
    { date: "Mar 1", equity: 108000 },
    { date: "Mar 15", equity: 112000 },
    { date: "Apr 1", equity: 115000 },
    { date: "Apr 15", equity: 118500 },
  ];

  const drawdownData = [
    { date: "Jan 1", drawdown: 0 },
    { date: "Jan 15", drawdown: -2.5 },
    { date: "Feb 1", drawdown: -1.8 },
    { date: "Feb 15", drawdown: -4.2 },
    { date: "Mar 1", drawdown: -2.1 },
    { date: "Mar 15", drawdown: -1.5 },
    { date: "Apr 1", drawdown: -0.8 },
    { date: "Apr 15", drawdown: 0 },
  ];

  const winLossData = [
    { name: "Wins", value: 91, color: "#10b981" },
    { name: "Losses", value: 50, color: "#ef4444" },
  ];

  const tradesPerDay = [
    { day: "Mon", trades: 12 },
    { day: "Tue", trades: 18 },
    { day: "Wed", trades: 15 },
    { day: "Thu", trades: 22 },
    { day: "Fri", trades: 20 },
    { day: "Sat", trades: 8 },
    { day: "Sun", trades: 6 },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Analytics</h1>
        <p className="text-muted-foreground">Comprehensive performance analysis</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Profit"
          value="$18,500"
          icon={TrendingUp}
          trend={{ value: "+15.2%", positive: true }}
        />
        <MetricCard
          title="Win Rate"
          value="64.5%"
          icon={Target}
          trend={{ value: "+2.3%", positive: true }}
        />
        <MetricCard
          title="Max Drawdown"
          value="-4.2%"
          icon={TrendingDown}
          trend={{ value: "-0.8%", positive: true }}
        />
        <MetricCard
          title="Sharpe Ratio"
          value="2.34"
          icon={DollarSign}
          trend={{ value: "+0.15", positive: true }}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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
              <Line type="monotone" dataKey="equity" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Drawdown Chart */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Drawdown Chart</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={drawdownData}>
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
              <Line type="monotone" dataKey="drawdown" stroke="#ef4444" strokeWidth={2} dot={{ fill: "#ef4444" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Win/Loss Pie Chart */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Win/Loss Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={winLossData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {winLossData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#121826",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Trades Per Day */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Trades Per Day</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={tradesPerDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="day" stroke="#9ca3af" />
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

      {/* Detailed Metrics */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-6">Detailed Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Trades</p>
            <p className="text-xl font-semibold">141</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Winning Trades</p>
            <p className="text-xl font-semibold text-success">91</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Losing Trades</p>
            <p className="text-xl font-semibold text-destructive">50</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Average Win</p>
            <p className="text-xl font-semibold text-success">$456.32</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Average Loss</p>
            <p className="text-xl font-semibold text-destructive">-$234.18</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Profit Factor</p>
            <p className="text-xl font-semibold">2.34</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Largest Win</p>
            <p className="text-xl font-semibold text-success">$2,456.78</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Largest Loss</p>
            <p className="text-xl font-semibold text-destructive">-$987.65</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Expectancy</p>
            <p className="text-xl font-semibold">$131.21</p>
          </div>
        </div>
      </div>
    </div>
  );
}
