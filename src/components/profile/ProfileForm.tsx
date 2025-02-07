import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProfileFormData {
  display_name: string;
  nationality: string;
  gender: string;
  location: string;
  languages: string;
  current_mmr: string | number;
  profile_photo?: string;
}

interface ProfileFormProps {
  formData: ProfileFormData;
  isEditing: boolean;
  onFormChange: (field: string, value: string) => void;
  onGenderSelect: (gender: string) => void;
  onSave: () => void;
  onEdit: () => void;
  onCancel: () => void;
}

export const ProfileForm: FC<ProfileFormProps> = ({
  formData,
  isEditing,
  onFormChange,
  onGenderSelect,
  onSave,
  onEdit,
  onCancel,
}) => {
  const languageArray = formData.languages.split(',').map(lang => lang.trim()).filter(Boolean);

  return (
    <div className="space-y-8 max-w-2xl mx-auto bg-card rounded-lg p-6 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="displayName">Display Name</Label>
            {formData.display_name === 'New Player' && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>You will only appear on the leaderboard once you've set your display name.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          {isEditing ? (
            <Input
              id="displayName"
              value={formData.display_name}
              onChange={(e) => onFormChange("display_name", e.target.value)}
            />
          ) : (
            <Input
              id="displayName"
              value={formData.display_name}
              readOnly
              className="bg-muted"
            />
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="nationality">Nationality</Label>
          {isEditing ? (
            <Input
              id="nationality"
              value={formData.nationality}
              onChange={(e) => onFormChange("nationality", e.target.value)}
            />
          ) : (
            <Input
              id="nationality"
              value={formData.nationality}
              readOnly
              className="bg-muted"
            />
          )}
        </div>

        <div className="space-y-2">
          <Label>Gender</Label>
          {isEditing ? (
            <div className="flex gap-4">
              <Button
                type="button"
                variant={formData.gender === "MALE" ? "default" : "outline"}
                onClick={() => onGenderSelect("MALE")}
                className="flex-1"
              >
                Male
              </Button>
              <Button
                type="button"
                variant={formData.gender === "FEMALE" ? "default" : "outline"}
                onClick={() => onGenderSelect("FEMALE")}
                className="flex-1"
              >
                Female
              </Button>
            </div>
          ) : (
            <Input
              value={formData.gender}
              readOnly
              className="bg-muted"
            />
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          {isEditing ? (
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => onFormChange("location", e.target.value)}
            />
          ) : (
            <Input
              id="location"
              value={formData.location}
              readOnly
              className="bg-muted"
            />
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="languages">Languages</Label>
          {isEditing ? (
            <div className="space-y-2">
              <Input
                id="languages"
                value={formData.languages}
                onChange={(e) => onFormChange("languages", e.target.value)}
                placeholder="e.g., English, French"
              />
              <p className="text-sm text-muted-foreground">
                Separate languages with commas
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {languageArray.map((language, index) => (
                <Badge key={index} variant="secondary">
                  {language}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="mmr">Current MMR</Label>
          <Input
            id="mmr"
            value={formData.current_mmr}
            readOnly
            className="bg-accent/50 text-accent-foreground font-medium"
          />
        </div>
      </div>
    </div>
  );
};