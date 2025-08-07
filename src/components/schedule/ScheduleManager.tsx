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
  editMode?: boolean;
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

export const ScheduleManager = ({ schedule, onScheduleChange, disabled = false, editMode = true }: ScheduleManagerProps) => {
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
    const currentRanges = schedule[day]?.ranges || [];
    
    // Find a non-overlapping default time slot
    let defaultStart = "07:00";
    let defaultEnd = "21:00";
    
    // If there are existing ranges, try to find a non-overlapping slot
    if (currentRanges.length > 0) {
      // Sort existing ranges by start time
      const sortedRanges = [...currentRanges].sort((a, b) => 
        new Date(`2000-01-01T${a.start}:00`).getTime() - new Date(`2000-01-01T${b.start}:00`).getTime()
      );
      
      // Try to find a gap after the last range
      const lastRange = sortedRanges[sortedRanges.length - 1];
      const lastEndTime = new Date(`2000-01-01T${lastRange.end}:00`);
      
      // Set default start to 30 minutes after the last range ends
      const newStartTime = new Date(lastEndTime.getTime() + 30 * 60000);
      if (newStartTime.getHours() < 23) {
        defaultStart = newStartTime.toTimeString().substring(0, 5);
        // Set end time to 2 hours later or 23:30, whichever is earlier
        const newEndTime = new Date(newStartTime.getTime() + 2 * 60 * 60000);
        if (newEndTime.getHours() >= 23 && newEndTime.getMinutes() > 30) {
          defaultEnd = "23:30";
        } else {
          defaultEnd = newEndTime.toTimeString().substring(0, 5);
        }
      }
    }
    
    const newSchedule = {
      ...schedule,
      [day]: {
        enabled: true, // Enable the day when adding a range
        ranges: [
          ...currentRanges,
          { start: defaultStart, end: defaultEnd },
        ],
      },
    };
    onScheduleChange(newSchedule);
  };

  const removeTimeRange = (day: string, rangeIndex: number) => {
    const currentRanges = schedule[day]?.ranges || [];
    const newRanges = currentRanges.filter((_, index) => index !== rangeIndex);
    
    const newSchedule = {
      ...schedule,
      [day]: {
        enabled: newRanges.length > 0, // Disable the day if no ranges left
        ranges: newRanges,
      },
    };
    onScheduleChange(newSchedule);
  };

  const updateTimeRange = (day: string, rangeIndex: number, field: 'start' | 'end', value: string) => {
    const currentRanges = schedule[day]?.ranges || [];
    const currentRange = currentRanges[rangeIndex];
    
    // Create the updated range
    const updatedRange = { ...currentRange, [field]: value };
    
    // Validation
    const startTime = new Date(`2000-01-01T${updatedRange.start}:00`);
    const endTime = new Date(`2000-01-01T${updatedRange.end}:00`);
    
    // Check if start time is after end time
    if (startTime >= endTime) {
      return; // Don't update if validation fails
    }
    
    // Check if end time is before midnight (23:59)
    const midnight = new Date(`2000-01-01T23:59:00`);
    if (endTime > midnight) {
      return; // Don't update if end time is after 23:59
    }
    
    // Check for overlaps with other ranges (excluding current range)
    const otherRanges = currentRanges.filter((_, index) => index !== rangeIndex);
    const hasOverlap = otherRanges.some(otherRange => {
      const otherStart = new Date(`2000-01-01T${otherRange.start}:00`);
      const otherEnd = new Date(`2000-01-01T${otherRange.end}:00`);
      
      // Check if ranges overlap
      return (startTime < otherEnd && endTime > otherStart);
    });
    
    if (hasOverlap) {
      return; // Don't update if there's an overlap
    }
    
    const newSchedule = {
      ...schedule,
      [day]: {
        enabled: true,
        ranges: currentRanges.map((range, index) =>
          index === rangeIndex ? updatedRange : range
        ),
      },
    };
    onScheduleChange(newSchedule);
  };

  return (
    <div className="space-y-3">
      {Object.entries(dayLabels).map(([day, label]) => {
        const daySchedule = schedule[day];
        const hasRanges = daySchedule?.ranges && daySchedule.ranges.length > 0;
        
        return (
          <div key={day} className="border rounded-lg p-3 bg-muted/20">
            {/* Day Header */}
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium">{label}</Label>
            </div>

            {/* Time Ranges Container - consistent height */}
            <div className="min-h-[32px] space-y-2">
              {hasRanges ? (
                <div className="space-y-2">
                  {daySchedule.ranges.map((range, rangeIndex) => {
                    // Calculate available time options based on current range
                    const startTime = new Date(`2000-01-01T${range.start}:00`);
                    const endTime = new Date(`2000-01-01T${range.end}:00`);
                    
                    // Get other ranges for overlap checking
                    const otherRanges = daySchedule.ranges.filter((_, index) => index !== rangeIndex);
                    
                    // Filter end time options to only show times after start time and not overlapping
                    const availableEndTimes = timeOptions.filter(time => {
                      const optionTime = new Date(`2000-01-01T${time}:00`);
                      if (optionTime <= startTime || optionTime > new Date(`2000-01-01T23:59:00`)) {
                        return false;
                      }
                      
                      // Check if this end time would create an overlap with other ranges
                      return !otherRanges.some(otherRange => {
                        const otherStart = new Date(`2000-01-01T${otherRange.start}:00`);
                        const otherEnd = new Date(`2000-01-01T${otherRange.end}:00`);
                        return (startTime < otherEnd && optionTime > otherStart);
                      });
                    });
                    
                    // Filter start time options to only show times before end time and not overlapping
                    const availableStartTimes = timeOptions.filter(time => {
                      const optionTime = new Date(`2000-01-01T${time}:00`);
                      if (optionTime >= endTime) {
                        return false;
                      }
                      
                      // Check if this start time would create an overlap with other ranges
                      return !otherRanges.some(otherRange => {
                        const otherStart = new Date(`2000-01-01T${otherRange.start}:00`);
                        const otherEnd = new Date(`2000-01-01T${otherRange.end}:00`);
                        return (optionTime < otherEnd && endTime > otherStart);
                      });
                    });
                    
                    return (
                      <div key={rangeIndex} className="flex items-center gap-2 text-sm">
                        {editMode ? (
                          <Select
                            value={range.start}
                            onValueChange={(value) => updateTimeRange(day, rangeIndex, 'start', value)}
                            disabled={disabled}
                          >
                            <SelectTrigger className="w-20 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {availableStartTimes.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <span className="w-20 h-8 px-3 py-1 text-sm border rounded-md bg-muted/50 flex items-center">
                            {range.start}
                          </span>
                        )}
                        
                        <span className="text-xs text-muted-foreground">to</span>
                        
                        {editMode ? (
                          <Select
                            value={range.end}
                            onValueChange={(value) => updateTimeRange(day, rangeIndex, 'end', value)}
                            disabled={disabled}
                          >
                            <SelectTrigger className="w-20 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {availableEndTimes.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <span className="w-20 h-8 px-3 py-1 text-sm border rounded-md bg-muted/50 flex items-center">
                            {range.end}
                          </span>
                        )}

                        {editMode && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTimeRange(day, rangeIndex)}
                            disabled={disabled}
                            className="h-7 w-7 p-0"
                          >
                            <Trash2 className="h-3 w-3 text-muted-foreground" />
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                // Placeholder for consistent spacing when no ranges exist
                <div className="h-8" />
              )}

              {/* Add time range button - always in the same position */}
              {editMode && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addTimeRange(day)}
                  disabled={disabled}
                  className="h-7 text-xs px-2 flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" />
                  Add time range
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};