import { Link } from "react-router";
import { Button } from "../components/ui/button";
import TradingChart from "../components/TradingChart";
import { Clock, Repeat, BookOpen, BarChart3, TrendingUp, Bitcoin, DollarSign, Globe } from "lucide-react";

export default function Landing() {
  const features = [
    {
      icon: Clock,
      title: "Time-based analytics",
      description: "Track performance across different time periods with detailed analytics",
    },
    {
      icon: Repeat,
      title: "Strategy replay",
      description: "Replay your trades candle by candle to understand your decision making",
    },
    {
      icon: BookOpen,
      title: "Trade journaling",
      description: "Keep detailed records of all your trades with notes and insights",
    },
    {
      icon: BarChart3,
      title: "Session analytics",
      description: "Compare different trading sessions and strategies side by side",
    },
  ];

  const assets = [
    { icon: TrendingUp, name: "Stocks", symbol: "AAPL", exchange: "NASDAQ", price: "$182.45" },
    { icon: Bitcoin, name: "Crypto", symbol: "BTCUSDT", exchange: "Binance", price: "$51,234.56" },
    { icon: DollarSign, name: "Forex", symbol: "EUR/USD", exchange: "FX", price: "1.0875" },
    { icon: Globe, name: "Indices", symbol: "S&P 500", exchange: "US", price: "4,987.23" },
  ];

  const faqs = [
    {
      question: "Can I test multiple pairs at the same time?",
      answer: "Yes, you can create multiple sessions and test different pairs simultaneously.",
    },
    {
      question: "What assets are supported?",
      answer: "We support stocks, crypto, forex, and indices from major exchanges worldwide.",
    },
    {
      question: "Can I use custom indicators?",
      answer: "Yes, our platform supports SMA, EMA, RSI, and many more technical indicators.",
    },
    {
      question: "Is replay trading available?",
      answer: "Absolutely! Replay mode allows you to step through historical data candle by candle.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-primary">QuantLab</h1>
            <p className="text-xs text-muted-foreground">Backtester</p>
          </div>
          <div className="flex gap-4">
            <Link to="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link to="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-5xl font-bold mb-6">
            Test trading strategies without risking real money
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Professional backtesting platform for traders and quants.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/app">
              <Button size="lg" className="text-lg px-8">
                Start Backtesting
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8">
              Explore Features
            </Button>
          </div>
        </div>

        {/* Chart Preview */}
        <div className="max-w-5xl mx-auto bg-card border border-border rounded-lg p-6">
          <TradingChart height={400} />
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Assets Section */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Supported Assets</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {assets.map((asset, index) => {
            const Icon = asset.icon;
            return (
              <div
                key={index}
                className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs text-muted-foreground">{asset.exchange}</span>
                </div>
                <h3 className="font-semibold mb-1">{asset.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{asset.symbol}</p>
                <p className="text-lg font-semibold text-success">{asset.price}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold mb-2">{faq.question}</h3>
              <p className="text-sm text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>© 2026 QuantLab Backtester. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
