import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimeRange {
  start: string;
  end: string;
}

interface DaySchedule {
  enabled: boolean;
  ranges: TimeRange[];
}

interface ScheduleManagerProps {
  schedule: Record<string, DaySchedule>;
  onScheduleChange: (schedule: Record<string, DaySchedule>) => void;
  disabled?: boolean;
}

const timeOptions = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return [`${hour}:00`, `${hour}:30`];
}).flat();

const dayLabels = {
  monday: "Monday",
  tuesday: "Tuesday", 
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

export const ScheduleManager = ({ schedule, onScheduleChange, disabled = false }: ScheduleManagerProps) => {
  const updateDayEnabled = (day: string, enabled: boolean) => {
    const newSchedule = {
      ...schedule,
      [day]: {
        ...schedule[day],
        enabled,
      },
    };
    onScheduleChange(newSchedule);
  };

  const addTimeRange = (day: string) => {
    const newSchedule = {
      ...schedule,
      [day]: {
        ...schedule[day],
        ranges: [
          ...schedule[day].ranges,
          { start: "07:00", end: "21:00" },
        ],
      },
    };
    onScheduleChange(newSchedule);
  };

  const removeTimeRange = (day: string, rangeIndex: number) => {
    const newSchedule = {
      ...schedule,
      [day]: {
        ...schedule[day],
        ranges: schedule[day].ranges.filter((_, index) => index !== rangeIndex),
      },
    };
    onScheduleChange(newSchedule);
  };

  const updateTimeRange = (day: string, rangeIndex: number, field: 'start' | 'end', value: string) => {
    const newSchedule = {
      ...schedule,
      [day]: {
        ...schedule[day],
        ranges: schedule[day].ranges.map((range, index) =>
          index === rangeIndex ? { ...range, [field]: value } : range
        ),
      },
    };
    onScheduleChange(newSchedule);
  };

  return (
    <div className="space-y-4">
      {Object.entries(dayLabels).map(([day, label]) => {
        const daySchedule = schedule[day];
        
        return (
          <Card key={day} className="p-4">
            <div className="space-y-3">
              {/* Day Toggle */}
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">{label}</Label>
                <Switch
                  checked={daySchedule?.enabled || false}
                  onCheckedChange={(enabled) => updateDayEnabled(day, enabled)}
                  disabled={disabled}
                />
              </div>

              {/* Time Ranges */}
              {daySchedule?.enabled && (
                <div className="space-y-2 ml-4">
                  {daySchedule.ranges.map((range, rangeIndex) => (
                    <div key={rangeIndex} className="flex items-center gap-2">
                      <Select
                        value={range.start}
                        onValueChange={(value) => updateTimeRange(day, rangeIndex, 'start', value)}
                        disabled={disabled}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <span className="text-muted-foreground">to</span>
                      
                      <Select
                        value={range.end}
                        onValueChange={(value) => updateTimeRange(day, rangeIndex, 'end', value)}
                        disabled={disabled}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTimeRange(day, rangeIndex)}
                        disabled={disabled || daySchedule.ranges.length <= 1}
                        className="p-1"
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  ))}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addTimeRange(day)}
                    disabled={disabled}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" />
                    Add time range
                  </Button>
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
};