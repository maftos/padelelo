
import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { countries } from "@/lib/countries";

interface ProfileFormData {
  display_name: string;
  nationality: string;
  gender: string;
  current_mmr: string | number;
  profile_photo?: string;
  years_playing: string;
  favorite_position: string;
  playing_style: string;
  favorite_shot: string;
  whatsapp_number: string;
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
    <div className="space-y-8 max-w-3xl mx-auto bg-card rounded-lg p-6 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Display Name */}
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

        {/* Nationality Dropdown */}
        <div className="space-y-2">
          <Label htmlFor="nationality">Nationality</Label>
          {isEditing ? (
            <Select 
              value={formData.nationality} 
              onValueChange={(value) => onFormChange("nationality", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select nationality" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    <div className="flex items-center gap-2">
                      <span>{country.flag}</span>
                      <span>{country.code}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              id="nationality"
              value={countries.find(c => c.code === formData.nationality)?.code || formData.nationality}
              readOnly
              className="bg-muted"
            />
          )}
        </div>

        {/* Gender */}
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

        {/* WhatsApp Number */}
        <div className="space-y-2">
          <Label htmlFor="whatsapp">WhatsApp Number</Label>
          {isEditing ? (
            <Input
              id="whatsapp"
              value={formData.whatsapp_number}
              onChange={(e) => onFormChange("whatsapp_number", e.target.value)}
              placeholder="+230 xxxx xxxx"
            />
          ) : (
            <Input
              id="whatsapp"
              value={formData.whatsapp_number}
              readOnly
              className="bg-muted"
            />
          )}
        </div>

        {/* Years Playing Padel */}
        <div className="space-y-2">
          <Label htmlFor="yearsPlaying">Years Playing Padel</Label>
          {isEditing ? (
            <Select 
              value={formData.years_playing} 
              onValueChange={(value) => onFormChange("years_playing", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner (Less than 1 year)</SelectItem>
                <SelectItem value="1-2">1-2 years</SelectItem>
                <SelectItem value="3-5">3-5 years</SelectItem>
                <SelectItem value="5+">5+ years</SelectItem>
                <SelectItem value="expert">Expert (10+ years)</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Input
              id="yearsPlaying"
              value={formData.years_playing}
              readOnly
              className="bg-muted"
            />
          )}
        </div>

        {/* Favorite Position */}
        <div className="space-y-2">
          <Label htmlFor="favoritePosition">Favorite Position</Label>
          {isEditing ? (
            <Select 
              value={formData.favorite_position} 
              onValueChange={(value) => onFormChange("favorite_position", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left Side (Backhand)</SelectItem>
                <SelectItem value="right">Right Side (Forehand)</SelectItem>
                <SelectItem value="both">Both Sides</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Input
              id="favoritePosition"
              value={formData.favorite_position}
              readOnly
              className="bg-muted"
            />
          )}
        </div>

        {/* Playing Style */}
        <div className="space-y-2">
          <Label htmlFor="playingStyle">Playing Style</Label>
          {isEditing ? (
            <Select 
              value={formData.playing_style} 
              onValueChange={(value) => onFormChange("playing_style", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aggressive">Aggressive</SelectItem>
                <SelectItem value="defensive">Defensive</SelectItem>
                <SelectItem value="balanced">Balanced</SelectItem>
                <SelectItem value="power">Power Player</SelectItem>
                <SelectItem value="tactical">Tactical</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Input
              id="playingStyle"
              value={formData.playing_style}
              readOnly
              className="bg-muted"
            />
          )}
        </div>

        {/* Favorite Shot */}
        <div className="space-y-2">
          <Label htmlFor="favoriteShot">Favorite Shot</Label>
          {isEditing ? (
            <Select 
              value={formData.favorite_shot} 
              onValueChange={(value) => onFormChange("favorite_shot", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select shot" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="smash">Smash</SelectItem>
                <SelectItem value="volley">Volley</SelectItem>
                <SelectItem value="lob">Lob</SelectItem>
                <SelectItem value="bandeja">Bandeja</SelectItem>
                <SelectItem value="vibora">Víbora</SelectItem>
                <SelectItem value="drop-shot">Drop Shot</SelectItem>
                <SelectItem value="wall-shot">Wall Shot (Pared)</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Input
              id="favoriteShot"
              value={formData.favorite_shot}
              readOnly
              className="bg-muted"
            />
          )}
        </div>

        {/* Current MMR - Read Only */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="mmr">Current MMR</Label>
          <Input
            id="mmr"
            value={formData.current_mmr}
            readOnly
            className="bg-accent/50 text-accent-foreground font-medium max-w-xs"
          />
        </div>
      </div>
    </div>
  );
};
