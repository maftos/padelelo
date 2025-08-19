import { useIsMobile } from "@/hooks/use-mobile";
import { DateTimePickers } from "./DateTimePickers";
import { DatePickerDrawer } from "./DatePickerDrawer";
import { TimePickerDrawer } from "./TimePickerDrawer";

interface DateTimeDrawersProps {
  date: string;
  time: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  required?: boolean;
}

export const DateTimeDrawers = ({ 
  date, 
  time, 
  onDateChange, 
  onTimeChange, 
  required = false 
}: DateTimeDrawersProps) => {
  const isMobile = useIsMobile();

  // Use drawers on mobile, original pickers on desktop
  if (isMobile) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DatePickerDrawer
          date={date}
          onDateChange={onDateChange}
          required={required}
        />
        <TimePickerDrawer
          time={time}
          onTimeChange={onTimeChange}
          required={required}
        />
      </div>
    );
  }

  // Desktop version uses original popover-based pickers
  return (
    <DateTimePickers
      date={date}
      time={time}
      onDateChange={onDateChange}
      onTimeChange={onTimeChange}
      required={required}
    />
  );
};