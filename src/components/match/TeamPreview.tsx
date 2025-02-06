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
        <div className="text-sm">
          <p>Average MMR: {Math.round(mmrData?.team1_avg_mmr || 0)}</p>
          <p>Win probability: {Math.round((mmrData?.team1_expected_win_rate || 0) * 100)}%</p>
          <p className="text-green-600">
            If win: +{Math.round(mmrData?.team1_win_mmr_change_amount || 0)} MMR
          </p>
          <p className="text-red-600">
            If lose: -{Math.round(mmrData?.team2_win_mmr_change_amount || 0)} MMR
          </p>
        </div>
      </Card>
    </div>
  );
};