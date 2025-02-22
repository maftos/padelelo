
import { Input } from "@/components/ui/input";
import { TournamentFormData } from "@/hooks/tournament/use-tournament-form";

interface TournamentBasicInfoProps {
  formData: TournamentFormData;
  onChange: (data: Partial<TournamentFormData>) => void;
}

export function TournamentBasicInfo({ formData, onChange }: TournamentBasicInfoProps) {
  return (
    <div className="relative">
      <Input
        id="name"
        value={formData.name}
        onChange={(e) => onChange({ name: e.target.value })}
        className="peer h-14 pt-4"
        placeholder=" "
        required
      />
      <label
        htmlFor="name"
        className="absolute left-3 top-2 text-xs text-gray-500 transition-all
          peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
          peer-focus:top-2 peer-focus:text-xs"
      >
        Event Name
      </label>
    </div>
  );
}
