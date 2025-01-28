import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { isToday, format } from "date-fns";

interface DateSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const DateSelector = ({ value, onChange }: DateSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="date">Date</Label>
      <div className="flex items-center gap-2">
        <Input
          id="date"
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1"
        />
        <span className="text-sm text-muted-foreground whitespace-nowrap min-w-[80px]">
          {isToday(new Date(value)) ? "Today" : format(new Date(value), "PPP")}
        </span>
      </div>
    </div>
  );
};