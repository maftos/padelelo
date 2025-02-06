import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
    <div className="space-y-4 mb-6">
      <Card className="p-6">
        <div className="space-y-4">
          {/* MMR Section */}
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{Math.round(mmrData?.team1_avg_mmr || 0)}</span>
            <span className="text-muted-foreground">vs</span>
            <span className="text-sm font-medium">{Math.round(mmrData?.team2_avg_mmr || 0)}</span>
          </div>

          <Separator />

          {/* Win Probability */}
          <div className="text-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Win Probability</span>
              <span className="font-medium">
                {Math.round((mmrData?.team1_expected_win_rate || 0) * 100)}%
              </span>
            </div>
          </div>

          <Separator />

          {/* MMR Changes */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">If Win</span>
              <span className="text-sm font-medium text-green-600">
                +{Math.round(mmrData?.team1_win_mmr_change_amount || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">If Lose</span>
              <span className="text-sm font-medium text-red-600">
                -{Math.round(mmrData?.team2_win_mmr_change_amount || 0)}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};