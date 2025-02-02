import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { InfoIcon } from "lucide-react";

interface ProfileFormData {
  display_name: string;
  nationality: string;
  gender: string;
  location: string;
  languages: string;
  whatsapp_number: string;
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
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="displayName">Display Name</Label>
          {isEditing ? (
            <Input
              id="displayName"
              value={formData.display_name}
              onChange={(e) => onFormChange("display_name", e.target.value)}
              className="max-w-[300px]"
            />
          ) : (
            <Input
              id="displayName"
              value={formData.display_name}
              readOnly
              className="bg-muted max-w-[300px]"
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
              className="max-w-[300px]"
            />
          ) : (
            <Input
              id="nationality"
              value={formData.nationality}
              readOnly
              className="bg-muted max-w-[300px]"
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
                className="flex-1 max-w-[140px]"
              >
                Male
              </Button>
              <Button
                type="button"
                variant={formData.gender === "FEMALE" ? "default" : "outline"}
                onClick={() => onGenderSelect("FEMALE")}
                className="flex-1 max-w-[140px]"
              >
                Female
              </Button>
            </div>
          ) : (
            <Input
              value={formData.gender}
              readOnly
              className="bg-muted max-w-[300px]"
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
              className="max-w-[300px]"
            />
          ) : (
            <Input
              id="location"
              value={formData.location}
              readOnly
              className="bg-muted max-w-[300px]"
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
                className="max-w-[500px]"
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
          <div className="flex items-center gap-2">
            <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>This information is not shared with other users</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {isEditing ? (
            <Input
              id="whatsappNumber"
              value={formData.whatsapp_number}
              onChange={(e) => onFormChange("whatsapp_number", e.target.value)}
              className="max-w-[300px]"
            />
          ) : (
            <Input
              id="whatsappNumber"
              value={formData.whatsapp_number}
              readOnly
              className="bg-muted max-w-[300px]"
            />
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="mmr">Current MMR</Label>
          <Input
            id="mmr"
            value={formData.current_mmr}
            readOnly
            className="bg-accent/50 text-accent-foreground font-medium max-w-[300px]"
          />
        </div>
      </div>

      {isEditing ? (
        <div className="flex gap-4 pt-4">
          <Button className="flex-1 max-w-[200px]" onClick={onSave}>Save Changes</Button>
          <Button className="flex-1 max-w-[200px]" variant="outline" onClick={onCancel}>Cancel</Button>
        </div>
      ) : (
        <Button className="w-full max-w-[200px]" onClick={onEdit}>Edit Profile</Button>
      )}
    </div>
  );
};