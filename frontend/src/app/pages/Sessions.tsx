import { useState } from "react";
import { useNavigate } from "react-router";
import SessionCard from "../components/SessionCard";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Plus } from "lucide-react";

export default function Sessions() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([
    {
      id: 1,
      name: "Crazy",
      capital: 100000,
      description: "Testing scalping strategy on high volatility pairs",
      createdDate: "Mar 1, 2026",
    },
    {
      id: 2,
      name: "Conservative Swing",
      capital: 50000,
      description: "Long-term swing trading with risk management",
      createdDate: "Feb 28, 2026",
    },
    {
      id: 3,
      name: "Breakout Hunter",
      capital: 75000,
      description: "Identifying and trading breakout patterns",
      createdDate: "Feb 25, 2026",
    },
    {
      id: 4,
      name: "Mean Reversion",
      capital: 60000,
      description: "Trading oversold/overbought conditions",
      createdDate: "Feb 20, 2026",
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSession, setNewSession] = useState({
    name: "",
    capital: "100000",
    description: "",
  });

  const handleCreateSession = () => {
    const session = {
      id: sessions.length + 1,
      name: newSession.name,
      capital: parseInt(newSession.capital),
      description: newSession.description,
      createdDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
    setSessions([session, ...sessions]);
    setNewSession({ name: "", capital: "100000", description: "" });
    setIsDialogOpen(false);
  };

  const handleStartSession = () => {
    navigate("/app/backtesting");
  };

  const handleDeleteSession = (id: number) => {
    setSessions(sessions.filter((s) => s.id !== id));
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Sessions</h1>
          <p className="text-muted-foreground">Manage your backtesting sessions</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg">
              <Plus className="w-5 h-5 mr-2" />
              New Session
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card">
            <DialogHeader>
              <DialogTitle>Create New Session</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="session-name">Session Name</Label>
                <Input
                  id="session-name"
                  placeholder="e.g., Scalping Strategy"
                  value={newSession.name}
                  onChange={(e) => setNewSession({ ...newSession, name: e.target.value })}
                  className="bg-input-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capital">Starting Capital ($)</Label>
                <Input
                  id="capital"
                  type="number"
                  placeholder="100000"
                  value={newSession.capital}
                  onChange={(e) => setNewSession({ ...newSession, capital: e.target.value })}
                  className="bg-input-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your trading strategy..."
                  value={newSession.description}
                  onChange={(e) => setNewSession({ ...newSession, description: e.target.value })}
                  className="bg-input-background"
                  rows={4}
                />
              </div>

              <Button onClick={handleCreateSession} className="w-full">
                Create Session
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.map((session) => (
          <SessionCard
            key={session.id}
            name={session.name}
            capital={session.capital}
            description={session.description}
            createdDate={session.createdDate}
            onStart={handleStartSession}
            onEdit={() => {}}
            onDelete={() => handleDeleteSession(session.id)}
          />
        ))}
      </div>
    </div>
  );
}
