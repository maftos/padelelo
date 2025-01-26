import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { isToday, format } from "date-fns";

interface DateSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const DateSelector = ({ value, onChange }: DateSelectorProps) => {
  return (
    <div className="flex items-center gap-4">
      <Label htmlFor="date" className="flex-shrink-0">Date</Label>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <Input
            id="date"
            type="date"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full"
          />
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            {isToday(new Date(value)) ? "Today" : format(new Date(value), "PPP")}
          </span>
        </div>
      </div>
    </div>
  );
};