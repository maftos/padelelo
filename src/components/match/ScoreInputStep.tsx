
import { Card } from "@/components/ui/card";
import { TeamDisplay } from "./TeamDisplay";
import { TeamPreview } from "./TeamPreview";
import { ScoreForm } from "../ScoreForm";
import { Score } from "@/hooks/match/use-score-handling";

interface TeamPlayers {
  player1Id: string;
  player2Id: string;
}

interface ScoreInputStepProps {
  teamPlayers: {
    team1Players: TeamPlayers;
    team2Players: TeamPlayers;
  } | null;
  getPlayerName: (id: string) => string;
  getPlayerPhoto: (id: string) => string;
  scores: Score[];
  setScores: (scores: Score[]) => void;
  mmrData: any;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  onBack: () => void;
}

export const ScoreInputStep = ({
  teamPlayers,
  getPlayerName,
  getPlayerPhoto,
  scores,
  setScores,
  mmrData,
  onSubmit,
  isSubmitting,
  onBack
}: ScoreInputStepProps) => {
  if (!teamPlayers) return null;

  return (
    <div className="max-w-sm mx-auto">
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-2">
            <TeamDisplay
              player1DisplayName={getPlayerName(teamPlayers.team1Players.player1Id)}
              player1ProfilePhoto={getPlayerPhoto(teamPlayers.team1Players.player1Id)}
              player2DisplayName={getPlayerName(teamPlayers.team1Players.player2Id)}
              player2ProfilePhoto={getPlayerPhoto(teamPlayers.team1Players.player2Id)}
              player1IsCompleter={false}
              player2IsCompleter={false}
            />
            <div className="flex items-center gap-2 font-semibold">
              <span>{scores[0].team1}</span>
              <span className="text-muted-foreground">-</span>
              <span>{scores[0].team2}</span>
            </div>
            <TeamDisplay
              player1DisplayName={getPlayerName(teamPlayers.team2Players.player1Id)}
              player1ProfilePhoto={getPlayerPhoto(teamPlayers.team2Players.player1Id)}
              player2DisplayName={getPlayerName(teamPlayers.team2Players.player2Id)}
              player2ProfilePhoto={getPlayerPhoto(teamPlayers.team2Players.player2Id)}
              isRightAligned
              player1IsCompleter={false}
              player2IsCompleter={false}
            />
          </div>
          {mmrData && (
            <TeamPreview
              mmrData={mmrData}
            />
          )}
        </div>
      </Card>
      <ScoreForm
        onBack={onBack}
        scores={scores}
        setScores={setScores}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
