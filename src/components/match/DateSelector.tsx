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
      <Input
        id="date"
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full"
      />
      <p className="text-sm text-muted-foreground mt-1">
        {isToday(new Date(value)) ? "Today" : format(new Date(value), "PPP")}
      </p>
    </div>
  );
};