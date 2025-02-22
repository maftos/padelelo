
import { Input } from "@/components/ui/input";
import { Users, Shield, Globe } from "lucide-react";
import { TournamentFormData } from "@/hooks/tournament/use-tournament-form";

interface TournamentSettingsProps {
  formData: TournamentFormData;
  onChange: (data: Partial<TournamentFormData>) => void;
}

export function TournamentSettings({ formData, onChange }: TournamentSettingsProps) {
  return (
    <>
      {/* Max Players Input */}
      <div className="relative">
        <Users className="absolute left-3 top-4 h-5 w-5 text-gray-400 pointer-events-none" />
        <Input
          type="number"
          min="2"
          max="128"
          value={formData.maxPlayers}
          onChange={(e) => onChange({ maxPlayers: e.target.value })}
          className="peer h-14 pt-4 pl-10"
          placeholder=" "
        />
        <label className="absolute left-10 top-2 text-xs text-gray-500">
          Max Players (Optional)
        </label>
      </div>

      {/* Approval Type Input (Disabled) */}
      <div className="relative">
        <Shield className="absolute left-3 top-4 h-5 w-5 text-gray-400 pointer-events-none" />
        <Input
          value="Automatic"
          disabled
          className="peer h-14 pt-4 pl-10"
          placeholder=" "
        />
        <label className="absolute left-10 top-2 text-xs text-gray-500">
          Approval Type
        </label>
      </div>

      {/* Visibility Input (Disabled) */}
      <div className="relative">
        <Globe className="absolute left-3 top-4 h-5 w-5 text-gray-400 pointer-events-none" />
        <Input
          value="Public"
          disabled
          className="peer h-14 pt-4 pl-10"
          placeholder=" "
        />
        <label className="absolute left-10 top-2 text-xs text-gray-500">
          Visibility
        </label>
      </div>
    </>
  );
}
