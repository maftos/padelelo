import { Card } from "@/components/ui/card";

interface TeamPreviewProps {
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
  mmrData,
}: TeamPreviewProps) => {
  return (
    <div className="space-y-4 mb-4">
      <Card className="p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            {mmrData && (
              <div className="text-sm">
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
            {mmrData && (
              <div className="text-sm">
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