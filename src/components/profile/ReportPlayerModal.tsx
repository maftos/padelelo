import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from "lucide-react";

interface ReportPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerName: string;
  playerId: string;
}

const reportReasons = [
  { value: "late", label: "Late to matches", description: "Player consistently arrives late" },
  { value: "harassment", label: "Harassment/Inappropriate behavior", description: "Offensive language or behavior" },
  { value: "unsportsmanlike", label: "Unsportsmanlike conduct", description: "Poor sportsmanship during games" },
  { value: "no_show", label: "No-show", description: "Failed to show up for scheduled matches" },
  { value: "cheating", label: "Cheating/Rule violations", description: "Breaking game rules or cheating" },
  { value: "other", label: "Other", description: "Other concerning behavior" }
];

export const ReportPlayerModal = ({
  isOpen,
  onClose,
  playerName,
  playerId
}: ReportPlayerModalProps) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!selectedReason) {
      toast({
        title: "Error",
        description: "Please select a reason for reporting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Mock submission for now - will be replaced with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Report submitted",
        description: `Your report about ${playerName} has been submitted successfully. Our team will review it within 24 hours.`,
      });
      
      handleClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedReason("");
    setAdditionalDetails("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Report Player
          </DialogTitle>
          <DialogDescription>
            Report {playerName} for inappropriate behavior. All reports are reviewed by our moderation team.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Reason for reporting</Label>
            <RadioGroup value={selectedReason} onValueChange={setSelectedReason}>
              {reportReasons.map((reason) => (
                <div key={reason.value} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value={reason.value} id={reason.value} className="mt-0.5" />
                  <div className="space-y-1 flex-1">
                    <Label htmlFor={reason.value} className="text-sm font-medium cursor-pointer">
                      {reason.label}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {reason.description}
                    </p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="details" className="text-sm font-medium">
              Additional details (optional)
            </Label>
            <Textarea
              id="details"
              placeholder="Provide any additional context about the incident..."
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1"
              variant="destructive"
            >
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};