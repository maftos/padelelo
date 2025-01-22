import { Card } from "@/components/ui/card";

interface TeamPreviewProps {
  team1Player1Name: string;
  team1Player2Name: string;
  team2Player1Name: string;
  team2Player2Name: string;
  mmrData?: {
    team1_avg_mmr: number;
    team2_avg_mmr: number;
    team1_expected_win_rate: number;
    team2_expected_win_rate: number;
    team1_win_mmr_change_amount: number;
    team2_win_mmr_change_amount: number;
  };
}

export const TeamPreview = ({
  team1Player1Name,
  team1Player2Name,
  team2Player1Name,
  team2Player2Name,
  mmrData,
}: TeamPreviewProps) => {
  return (
    <div className="space-y-4 mb-4">
      <Card className="p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">Team 1</h3>
            <p className="text-sm">{team1Player1Name}</p>
            <p className="text-sm">{team1Player2Name}</p>
            {mmrData && (
              <div className="mt-2 text-sm">
                <p>Avg MMR: {Math.round(mmrData.team1_avg_mmr)}</p>
                <p>Win probability: {Math.round(mmrData.team1_expected_win_rate * 100)}%</p>
                <p className="text-green-600">
                  If win: +{Math.round(mmrData.team1_win_mmr_change_amount)} MMR
                </p>
                <p className="text-red-600">
                  If lose: -{Math.round(mmrData.team2_win_mmr_change_amount)} MMR
                </p>
              </div>
            )}
          </div>
          <div>
            <h3 className="font-semibold mb-2">Team 2</h3>
            <p className="text-sm">{team2Player1Name}</p>
            <p className="text-sm">{team2Player2Name}</p>
            {mmrData && (
              <div className="mt-2 text-sm">
                <p>Avg MMR: {Math.round(mmrData.team2_avg_mmr)}</p>
                <p>Win probability: {Math.round(mmrData.team2_expected_win_rate * 100)}%</p>
                <p className="text-green-600">
                  If win: +{Math.round(mmrData.team2_win_mmr_change_amount)} MMR
                </p>
                <p className="text-red-600">
                  If lose: -{Math.round(mmrData.team1_win_mmr_change_amount)} MMR
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};