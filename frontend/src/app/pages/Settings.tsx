import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Save } from "lucide-react";

export default function Settings() {
  const [defaultCapital, setDefaultCapital] = useState("100000");
  const [tradingFees, setTradingFees] = useState("0.1");
  const [slippage, setSlippage] = useState("0.05");
  const [theme, setTheme] = useState("dark");
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  const handleSave = () => {
    // Mock save settings
    alert("Settings saved successfully!");
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your application preferences</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Trading Settings */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-6">Trading Settings</h2>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="capital">Default Starting Capital ($)</Label>
              <Input
                id="capital"
                type="number"
                value={defaultCapital}
                onChange={(e) => setDefaultCapital(e.target.value)}
                className="bg-input-background"
              />
              <p className="text-sm text-muted-foreground">
                This will be the default capital when creating new sessions
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fees">Trading Fees (%)</Label>
              <Input
                id="fees"
                type="number"
                step="0.01"
                value={tradingFees}
                onChange={(e) => setTradingFees(e.target.value)}
                className="bg-input-background"
              />
              <p className="text-sm text-muted-foreground">
                Fee percentage applied to each trade
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="slippage">Slippage (%)</Label>
              <Input
                id="slippage"
                type="number"
                step="0.01"
                value={slippage}
                onChange={(e) => setSlippage(e.target.value)}
                className="bg-input-background"
              />
              <p className="text-sm text-muted-foreground">
                Expected price slippage for market orders
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="leverage">Default Leverage</Label>
              <Select defaultValue="1">
                <SelectTrigger id="leverage" className="bg-input-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1x</SelectItem>
                  <SelectItem value="2">2x</SelectItem>
                  <SelectItem value="5">5x</SelectItem>
                  <SelectItem value="10">10x</SelectItem>
                  <SelectItem value="20">20x</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Default leverage for new trades
              </p>
            </div>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-6">Appearance</h2>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger id="theme" className="bg-input-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="auto">Auto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="chart-style">Chart Style</Label>
              <Select defaultValue="candlestick">
                <SelectTrigger id="chart-style" className="bg-input-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="candlestick">Candlestick</SelectItem>
                  <SelectItem value="line">Line</SelectItem>
                  <SelectItem value="bar">Bar</SelectItem>
                  <SelectItem value="area">Area</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-6">Notifications</h2>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications about trade executions
                </p>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-save Sessions</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically save session progress
                </p>
              </div>
              <Switch
                checked={autoSave}
                onCheckedChange={setAutoSave}
              />
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-6">Data Management</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">Export All Data</p>
                <p className="text-sm text-muted-foreground">
                  Download all your sessions and trades
                </p>
              </div>
              <Button variant="outline">Export</Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">Import Data</p>
                <p className="text-sm text-muted-foreground">
                  Import sessions from a file
                </p>
              </div>
              <Button variant="outline">Import</Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-destructive/10 rounded-lg border border-destructive/20">
              <div>
                <p className="font-medium text-destructive">Clear All Data</p>
                <p className="text-sm text-muted-foreground">
                  Delete all sessions and trades permanently
                </p>
              </div>
              <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
                Clear
              </Button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <Button onClick={handleSave} size="lg" className="w-full">
          <Save className="w-5 h-5 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}
