import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

interface DatePickerDrawerProps {
  date: string;
  onDateChange: (date: string) => void;
  required?: boolean;
}

export const DatePickerDrawer = ({
  date,
  onDateChange,
  required = false
}: DatePickerDrawerProps) => {
  const [open, setOpen] = useState(false);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      onDateChange(format(selectedDate, 'yyyy-MM-dd'));
      setOpen(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "h-14 pt-4 w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
          <div className="flex flex-col items-start flex-1 min-w-0">
            <span className="text-xs text-muted-foreground">
              Date {required && <span className="text-destructive">*</span>}
            </span>
            <span className="mt-0.5 truncate w-full">
              {date ? (
                format(new Date(date), "EEEE, MMMM d, yyyy")
              ) : (
                "Select Date"
              )}
            </span>
          </div>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-auto">
        <DrawerHeader className="border-b border-border pb-4">
          <DrawerTitle className="text-center">
            Select Date
          </DrawerTitle>
        </DrawerHeader>
        
        <div className="p-4 flex justify-center">
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
        </div>
      </DrawerContent>
    </Drawer>
  );
};