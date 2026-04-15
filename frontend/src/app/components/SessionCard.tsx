import { Calendar, DollarSign, Play, Edit, Trash2 } from "lucide-react";
import { Button } from "./ui/button";

interface SessionCardProps {
  name: string;
  capital: number;
  description: string;
  createdDate: string;
  onStart?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function SessionCard({
  name,
  capital,
  description,
  createdDate,
  onStart,
  onEdit,
  onDelete,
}: SessionCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1">{name}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <DollarSign className="w-4 h-4 text-success" />
          <span className="text-muted-foreground">Capital:</span>
          <span className="font-medium">${capital.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">Created:</span>
          <span>{createdDate}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={onStart} className="flex-1" size="sm">
          <Play className="w-4 h-4 mr-2" />
          Start Session
        </Button>
        <Button onClick={onEdit} variant="outline" size="sm">
          <Edit className="w-4 h-4" />
        </Button>
        <Button onClick={onDelete} variant="outline" size="sm">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
