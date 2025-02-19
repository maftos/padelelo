
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreateTournamentLayout } from "@/components/tournament/CreateTournamentLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function CreateTournamentStep2() {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const navigate = useNavigate();

  const handleNext = () => {
    if (startDate && endDate) {
      localStorage.setItem("tournament_start_date", startDate.toISOString());
      localStorage.setItem("tournament_end_date", endDate.toISOString());
      navigate("/tournament/create-tournament/step-3");
    }
  };

  return (
    <CreateTournamentLayout currentStep={2} totalSteps={6}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-center">Tournament Dates</h1>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  disabled={(date) => 
                    startDate ? date < startDate : false
                  }
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <Button
          className="w-full"
          onClick={handleNext}
          disabled={!startDate || !endDate}
        >
          Continue
        </Button>
      </div>
    </CreateTournamentLayout>
  );
}
