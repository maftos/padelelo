
import { Textarea } from "@/components/ui/textarea";
import { TournamentFormData } from "@/hooks/tournament/use-tournament-form";

interface TournamentDescriptionProps {
  formData: TournamentFormData;
  onChange: (data: Partial<TournamentFormData>) => void;
}

export function TournamentDescription({ formData, onChange }: TournamentDescriptionProps) {
  return (
    <div className="relative">
      <Textarea
        value={formData.description}
        onChange={(e) => onChange({ description: e.target.value })}
        className="pt-6 resize-y min-h-[96px]"
        placeholder=" "
      />
      <label className="absolute left-3 top-2 text-xs text-gray-500">
        Description (Optional)
      </label>
    </div>
  );
}
