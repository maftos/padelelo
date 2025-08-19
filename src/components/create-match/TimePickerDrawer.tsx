import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Clock, Search } from "lucide-react";

interface TimePickerDrawerProps {
  time: string;
  onTimeChange: (time: string) => void;
  required?: boolean;
}

export const TimePickerDrawer = ({
  time,
  onTimeChange,
  required = false
}: TimePickerDrawerProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const timeOptions = Array.from({ length: 96 }, (_, i) => {
    const hours = Math.floor(i / 4);
    const minutes = (i % 4) * 15;
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    const displayTime = format(new Date(`2000-01-01T${timeString}`), "h:mm a");
    return { value: timeString, display: displayTime };
  });

  const filteredTimeOptions = timeOptions.filter(option =>
    option.display.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTimeSelect = (timeOption: string) => {
    onTimeChange(timeOption);
    setOpen(false);
  };

  // Scroll to selected time or noon when drawer opens
  useEffect(() => {
    if (open && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      let scrollIndex = 48; // noon by default
      
      if (time) {
        const selectedIndex = timeOptions.findIndex(option => option.value === time);
        if (selectedIndex !== -1) {
          scrollIndex = selectedIndex;
        }
      }
      
      // Wait for the next frame to ensure the content is rendered
      requestAnimationFrame(() => {
        const buttonHeight = 48; // height of each time button
        const scrollTop = Math.max(0, (scrollIndex - 4) * buttonHeight);
        container.scrollTo({ top: scrollTop, behavior: 'smooth' });
      });
    }
  }, [open, time, timeOptions]);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "h-14 pt-4 w-full justify-start text-left font-normal",
            !time && "text-muted-foreground"
          )}
        >
          <Clock className="mr-2 h-4 w-4 flex-shrink-0" />
          <div className="flex flex-col items-start flex-1 min-w-0">
            <span className="text-xs text-muted-foreground">
              Time {required && <span className="text-destructive">*</span>}
            </span>
            <span className="mt-0.5 truncate w-full">
              {time ? (
                format(new Date(`2000-01-01T${time}`), "h:mm a")
              ) : (
                "Select Time"
              )}
            </span>
          </div>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[85vh] flex flex-col">
        <DrawerHeader className="border-b border-border pb-4">
          <DrawerTitle className="text-center">
            Select Time
          </DrawerTitle>
        </DrawerHeader>
        
        <div className="flex-1 overflow-hidden p-4 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search time..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Time Options */}
          <div 
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto space-y-1"
          >
            {filteredTimeOptions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No times found
              </div>
            ) : (
              filteredTimeOptions.map((timeOption) => (
                <Button
                  key={timeOption.value}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start h-12 text-left font-normal",
                    time === timeOption.value && "bg-primary/10 text-primary border border-primary/20"
                  )}
                  onClick={() => handleTimeSelect(timeOption.value)}
                >
                  <Clock className="mr-3 h-4 w-4 text-muted-foreground" />
                  {timeOption.display}
                </Button>
              ))
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};