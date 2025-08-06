
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";

interface DateTimePickersProps {
  date: string;
  time: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  required?: boolean;
}

export const DateTimePickers = ({ 
  date, 
  time, 
  onDateChange, 
  onTimeChange, 
  required = false 
}: DateTimePickersProps) => {
  const [dateOpen, setDateOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);

  const timeOptions = Array.from({ length: 96 }, (_, i) => {
    const hours = Math.floor(i / 4);
    const minutes = (i % 4) * 15;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  });

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      onDateChange(format(selectedDate, 'yyyy-MM-dd'));
      setDateOpen(false);
    }
  };

  const handleTimeSelect = (timeOption: string) => {
    onTimeChange(timeOption);
    setTimeOpen(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Date Picker */}
      <div className="relative">
        <Popover open={dateOpen} onOpenChange={setDateOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "h-14 pt-4 w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              <div className="flex flex-col items-start">
                <span className="text-xs text-gray-500">
                  Date {required && <span className="text-destructive">*</span>}
                </span>
                <span className="mt-0.5">
                  {date ? (
                    format(new Date(date), "PPP")
                  ) : (
                    "Select Date"
                  )}
                </span>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date ? new Date(date) : undefined}
              onSelect={handleDateSelect}
              disabled={(selectedDate) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const selected = new Date(selectedDate);
                selected.setHours(0, 0, 0, 0);
                return selected < today;
              }}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Time Picker */}
      <div className="relative">
        <Popover open={timeOpen} onOpenChange={setTimeOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "h-14 pt-4 w-full justify-start text-left font-normal",
                !time && "text-muted-foreground"
              )}
            >
              <Clock className="mr-2 h-4 w-4" />
              <div className="flex flex-col items-start">
                <span className="text-xs text-gray-500">
                  Time {required && <span className="text-destructive">*</span>}
                </span>
                <span className="mt-0.5">
                  {time ? (
                    format(new Date(`2000-01-01T${time}`), "h:mm a")
                  ) : (
                    "Select Time"
                  )}
                </span>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-52 p-2" align="start">
            <div className="flex flex-col gap-1 max-h-52 overflow-y-auto" ref={(el) => {
              if (el && !time) {
                // Scroll to noon (48th option: 12:00) when opening
                const noonIndex = 48;
                const buttonHeight = 32; // Approximate button height
                el.scrollTop = Math.max(0, (noonIndex - 3) * buttonHeight);
              }
            }}>
              {timeOptions.map((timeOption) => (
                <Button
                  key={timeOption}
                  variant="ghost"
                  className={cn(
                    "justify-start font-normal",
                    time === timeOption && "bg-accent text-accent-foreground"
                  )}
                  onClick={() => handleTimeSelect(timeOption)}
                >
                  {format(new Date(`2000-01-01T${timeOption}`), "h:mm a")}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
