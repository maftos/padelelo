
import { Trophy } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TournamentFormData } from "@/hooks/tournament/use-tournament-form";

interface TournamentBracketTypeProps {
  formData: TournamentFormData;
  onChange: (data: Partial<TournamentFormData>) => void;
}

export function TournamentBracketType({ formData, onChange }: TournamentBracketTypeProps) {
  return (
    <div className="relative">
      <Trophy className="absolute left-3 top-4 h-5 w-5 text-gray-400 pointer-events-none z-10" />
      <Select
        value={formData.bracketType}
        onValueChange={(value) => onChange({ bracketType: value as TournamentFormData["bracketType"] })}
        required
      >
        <SelectTrigger className="h-14 pt-4 pl-10">
          <SelectValue placeholder=" " />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="SINGLE_ELIM">Single Elimination</SelectItem>
          <SelectItem value="DOUBLE_ELIM">Double Elimination</SelectItem>
          <SelectItem value="ROUND_ROBIN">Round Robin</SelectItem>
          <SelectItem value="AMERICANO_SOLO">Americano Solo</SelectItem>
          <SelectItem value="MEXICANO_SOLO">Mexicano Solo</SelectItem>
          <SelectItem value="AMERICANO_TEAM">Americano Team</SelectItem>
          <SelectItem value="MEXICANO_TEAM">Mexicano Team</SelectItem>
          <SelectItem value="MIXICANO">Mixicano</SelectItem>
        </SelectContent>
      </Select>
      <label className="absolute left-10 top-2 text-xs text-gray-500 z-10">
        Bracket Type
      </label>
    </div>
  );
}

