
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FormSection } from "@/components/ui/form-section";

interface NotificationPreferences {
  hostedBy: "friends" | "anyone";
  maxDistance: "5km" | "10km" | "20km" | "any";
  level: "500mmr" | "1000mmr" | "any";
  playersNeeded: "one" | "two" | "any";
}

interface PlayerMatchingNotificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PlayerMatchingNotificationModal = ({
  open,
  onOpenChange,
}: PlayerMatchingNotificationModalProps) => {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    hostedBy: "anyone",
    maxDistance: "any",
    level: "any",
    playersNeeded: "any",
  });

  const handleSave = () => {
    console.log("Saving notification preferences:", preferences);
    // TODO: Implement API call to save preferences
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Subscribe to Notifications</DialogTitle>
          <DialogDescription>
            Get WhatsApp notifications when games matching your preferences are posted.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <FormSection title="Hosted by">
            <RadioGroup
              value={preferences.hostedBy}
              onValueChange={(value) =>
                setPreferences({ ...preferences, hostedBy: value as "friends" | "anyone" })
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="friends" id="friends" />
                <Label htmlFor="friends">Friends only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="anyone" id="anyone" />
                <Label htmlFor="anyone">Anyone</Label>
              </div>
            </RadioGroup>
          </FormSection>

          <FormSection title="Maximum Distance">
            <RadioGroup
              value={preferences.maxDistance}
              onValueChange={(value) =>
                setPreferences({ 
                  ...preferences, 
                  maxDistance: value as "5km" | "10km" | "20km" | "any" 
                })
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="5km" id="5km" />
                <Label htmlFor="5km">5km</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="10km" id="10km" />
                <Label htmlFor="10km">10km</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="20km" id="20km" />
                <Label htmlFor="20km">20km</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="any" id="any-distance" />
                <Label htmlFor="any-distance">Any distance</Label>
              </div>
            </RadioGroup>
          </FormSection>

          <FormSection title="Level">
            <RadioGroup
              value={preferences.level}
              onValueChange={(value) =>
                setPreferences({ 
                  ...preferences, 
                  level: value as "500mmr" | "1000mmr" | "any" 
                })
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="500mmr" id="500mmr" />
                <Label htmlFor="500mmr">Within 500 MMR</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1000mmr" id="1000mmr" />
                <Label htmlFor="1000mmr">Within 1000 MMR</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="any" id="any-level" />
                <Label htmlFor="any-level">Any</Label>
              </div>
            </RadioGroup>
          </FormSection>

          <FormSection title="Players Needed">
            <RadioGroup
              value={preferences.playersNeeded}
              onValueChange={(value) =>
                setPreferences({ 
                  ...preferences, 
                  playersNeeded: value as "one" | "two" | "any" 
                })
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="one" id="one" />
                <Label htmlFor="one">One</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="two" id="two" />
                <Label htmlFor="two">Two</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="any" id="any-players" />
                <Label htmlFor="any-players">Any</Label>
              </div>
            </RadioGroup>
          </FormSection>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Subscribe
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
