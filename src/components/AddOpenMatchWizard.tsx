
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock, MapPin, Users, DollarSign, UserCheck } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface AddOpenMatchWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface MatchFormData {
  title: string;
  courtName: string;
  gameDate: Date | undefined;
  startTime: string;
  endTime: string;
  spotsAvailable: number;
  description: string;
  preferences: string;
  price: string;
}

const timeOptions = Array.from({ length: 96 }, (_, i) => {
  const hours = Math.floor(i / 4);
  const minutes = (i % 4) * 15;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
});

const mockCourts = [
  "RM Club Forbach",
  "La Isla Beau Plan", 
  "Urban Sport Grand Baie",
  "Padel Club Tamarin",
  "Grand Bay Tennis Club"
];

export const AddOpenMatchWizard = ({ open, onOpenChange }: AddOpenMatchWizardProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<MatchFormData>({
    title: "",
    courtName: "",
    gameDate: undefined,
    startTime: "",
    endTime: "",
    spotsAvailable: 1,
    description: "",
    preferences: "All genders",
    price: ""
  });

  const updateFormData = (updates: Partial<MatchFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    console.log("Creating open match:", formData);
    // TODO: Implement actual submission logic
    onOpenChange(false);
    setStep(1);
    setFormData({
      title: "",
      courtName: "",
      gameDate: undefined,
      startTime: "",
      endTime: "",
      spotsAvailable: 1,
      description: "",
      preferences: "All genders",
      price: ""
    });
  };

  const canProceedStep1 = formData.title && formData.courtName && formData.gameDate;
  const canProceedStep2 = formData.startTime && formData.endTime && formData.price;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Open Match - Step {step} of 3</DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Match Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => updateFormData({ title: e.target.value })}
                placeholder="e.g., Looking for 1 player - intermediate"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="court">Court/Venue</Label>
              <Select value={formData.courtName} onValueChange={(value) => updateFormData({ courtName: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a court" />
                </SelectTrigger>
                <SelectContent>
                  {mockCourts.map((court) => (
                    <SelectItem key={court} value={court}>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {court}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Game Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.gameDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.gameDate ? format(formData.gameDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.gameDate}
                    onSelect={(date) => updateFormData({ gameDate: date })}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleNext} disabled={!canProceedStep1}>
                Next
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Select value={formData.startTime} onValueChange={(value) => updateFormData({ startTime: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((time) => (
                      <SelectItem key={time} value={time}>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {format(new Date(`2000-01-01T${time}`), "h:mm a")}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>End Time</Label>
                <Select value={formData.endTime} onValueChange={(value) => updateFormData({ endTime: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((time) => (
                      <SelectItem key={time} value={time}>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {format(new Date(`2000-01-01T${time}`), "h:mm a")}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price per Person</Label>
              <Input
                id="price"
                value={formData.price}
                onChange={(e) => updateFormData({ price: e.target.value })}
                placeholder="e.g., Rs 400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="spots">Players Needed</Label>
              <Select 
                value={formData.spotsAvailable.toString()} 
                onValueChange={(value) => updateFormData({ spotsAvailable: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      1 player needed
                    </div>
                  </SelectItem>
                  <SelectItem value="2">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      2 players needed
                    </div>
                  </SelectItem>
                  <SelectItem value="3">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      3 players needed
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferences">Player Preferences</Label>
              <Select value={formData.preferences} onValueChange={(value) => updateFormData({ preferences: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All genders">
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4" />
                      All genders
                    </div>
                  </SelectItem>
                  <SelectItem value="Male only">
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4" />
                      Male only
                    </div>
                  </SelectItem>
                  <SelectItem value="Female only">
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4" />
                      Female only
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleNext} disabled={!canProceedStep2}>
                Next
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Match Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateFormData({ description: e.target.value })}
                placeholder="Add any additional details about the match, skill level expectations, or special requirements..."
                className="min-h-[100px]"
              />
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <h4 className="font-medium text-sm mb-3">Match Summary</h4>
              <div className="grid gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {formData.courtName}
                </div>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  {formData.gameDate && format(formData.gameDate, "PPP")}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  {formData.startTime && formData.endTime && 
                    `${format(new Date(`2000-01-01T${formData.startTime}`), "h:mm a")} - ${format(new Date(`2000-01-01T${formData.endTime}`), "h:mm a")}`
                  }
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  {formData.price}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  {formData.spotsAvailable} player{formData.spotsAvailable > 1 ? 's' : ''} needed
                </div>
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                  {formData.preferences}
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleSubmit}>
                Create Match
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
