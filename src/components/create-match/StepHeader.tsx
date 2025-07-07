
import { Badge } from "@/components/ui/badge";

interface StepHeaderProps {
  title: string;
  description?: string;
  showOpenGameBadge?: boolean;
}

export const StepHeader = ({ title, description, showOpenGameBadge = false }: StepHeaderProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold">{title}</h2>
        {showOpenGameBadge && (
          <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
            Open Game
          </Badge>
        )}
      </div>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
};
