
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { TournamentFormData } from "@/hooks/tournament/use-tournament-form";

interface TournamentDateTimeProps {
  formData: TournamentFormData;
  onChange: (data: Partial<TournamentFormData>) => void;
  showEndDate: boolean;
  onShowEndDateChange: (show: boolean) => void;
}

export function TournamentDateTime({ 
  formData, 
  onChange, 
  showEndDate, 
  onShowEndDateChange 
}: TournamentDateTimeProps) {
  const timeOptions = Array.from({ length: 96 }, (_, i) => {
    const hours = Math.floor(i / 4);
    const minutes = (i % 4) * 15;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  });

  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        {/* Start Date */}
        <div className="relative">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-14 pt-4 w-full justify-start text-left font-normal",
                  !formData.startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                <div className="flex flex-col items-start">
                  <span className="text-xs text-gray-500">Start Date</span>
                  <span className="mt-0.5">
                    {formData.startDate ? (
                      format(new Date(formData.startDate), "PPP")
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
                selected={formData.startDate ? new Date(formData.startDate) : undefined}
                onSelect={(date) =>
                  onChange({
                    startDate: date ? format(date, 'yyyy-MM-dd') : ''
                  })
                }
                disabled={(date) =>
                  date < new Date()
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Start Time */}
        <div className="relative">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-14 pt-4 w-full justify-start text-left font-normal",
                  !formData.startTime && "text-muted-foreground"
                )}
              >
                <Clock className="mr-2 h-4 w-4" />
                <div className="flex flex-col items-start">
                  <span className="text-xs text-gray-500">Start Time</span>
                  <span className="mt-0.5">
                    {formData.startTime ? (
                      format(new Date(`2000-01-01T${formData.startTime}`), "h:mm a")
                    ) : (
                      "Select Time"
                    )}
                  </span>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-52 p-2" align="start">
              <div className="flex flex-col gap-1 max-h-52 overflow-y-auto">
                {timeOptions.map((time) => (
                  <Button
                    key={time}
                    variant="ghost"
                    className={cn(
                      "justify-start font-normal",
                      formData.startTime === time && "bg-accent text-accent-foreground"
                    )}
                    onClick={() => onChange({ startTime: time })}
                  >
                    {format(new Date(`2000-01-01T${time}`), "h:mm a")}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onShowEndDateChange(!showEndDate)}
        className="mt-2 text-sm text-primary hover:underline focus:outline-none"
      >
        {showEndDate ? "Remove end date/time" : "+ Add end date and time"}
      </button>

      {showEndDate && (
        <div className="grid grid-cols-2 gap-4 mt-4">
          {/* End Date */}
          <div className="relative">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "h-14 pt-4 w-full justify-start text-left font-normal",
                    !formData.endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <div className="flex flex-col items-start">
                    <span className="text-xs text-gray-500">End Date</span>
                    <span className="mt-0.5">
                      {formData.endDate ? (
                        format(new Date(formData.endDate), "PPP")
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
                  selected={formData.endDate ? new Date(formData.endDate) : undefined}
                  onSelect={(date) =>
                    onChange({
                      endDate: date ? format(date, 'yyyy-MM-dd') : ''
                    })
                  }
                  disabled={(date) =>
                    date < (formData.startDate ? new Date(formData.startDate) : new Date())
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* End Time */}
          <div className="relative">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "h-14 pt-4 w-full justify-start text-left font-normal",
                    !formData.endTime && "text-muted-foreground"
                  )}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  <div className="flex flex-col items-start">
                    <span className="text-xs text-gray-500">End Time</span>
                    <span className="mt-0.5">
                      {formData.endTime ? (
                        format(new Date(`2000-01-01T${formData.endTime}`), "h:mm a")
                      ) : (
                        "Select Time"
                      )}
                    </span>
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-52 p-2" align="start">
                <div className="flex flex-col gap-1 max-h-52 overflow-y-auto">
                  {timeOptions.map((time) => (
                    <Button
                      key={time}
                      variant="ghost"
                      className={cn(
                        "justify-start font-normal",
                        formData.endTime === time && "bg-accent text-accent-foreground"
                      )}
                      onClick={() => onChange({ endTime: time })}
                    >
                      {format(new Date(`2000-01-01T${time}`), "h:mm a")}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}
    </div>
  );
}
