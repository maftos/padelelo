import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProfileFormData {
  display_name: string;
  nationality: string;
  gender: string;
  location: string;
  languages: string;
  whatsapp_number: string;
  current_mmr: string | number;
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
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="displayName">Display Name</Label>
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
            >
              Male
            </Button>
            <Button
              type="button"
              variant={formData.gender === "FEMALE" ? "default" : "outline"}
              onClick={() => onGenderSelect("FEMALE")}
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

      <div className="space-y-2">
        <Label htmlFor="languages">Languages</Label>
        {isEditing ? (
          <Input
            id="languages"
            value={formData.languages}
            onChange={(e) => onFormChange("languages", e.target.value)}
            placeholder="e.g., English, French"
          />
        ) : (
          <Input
            id="languages"
            value={formData.languages}
            readOnly
            className="bg-muted"
            placeholder="e.g., English, French"
          />
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
        {isEditing ? (
          <Input
            id="whatsappNumber"
            value={formData.whatsapp_number}
            onChange={(e) => onFormChange("whatsapp_number", e.target.value)}
          />
        ) : (
          <Input
            id="whatsappNumber"
            value={formData.whatsapp_number}
            readOnly
            className="bg-muted"
          />
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="mmr">Current MMR</Label>
        <Input
          id="mmr"
          value={formData.current_mmr}
          readOnly
          className="bg-muted"
        />
      </div>

      {isEditing ? (
        <div className="flex gap-4">
          <Button className="flex-1" onClick={onSave}>Save Changes</Button>
          <Button className="flex-1" variant="outline" onClick={onCancel}>Cancel</Button>
        </div>
      ) : (
        <Button className="w-full" onClick={onEdit}>Edit Profile</Button>
      )}
    </div>
  );
};