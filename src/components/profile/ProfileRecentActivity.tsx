import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { SetCard } from "@/components/match/SetCard";
interface ProfileRecentActivityProps {
  latestMatches: any[] | undefined;
  profileId?: string;
}

export const ProfileRecentActivity = ({ latestMatches = [], profileId }: ProfileRecentActivityProps) => {
  const getInitials = (first?: string | null, last?: string | null) => {
    const f = (first || "").trim();
    const l = (last || "").trim();
    if (!f && !l) return "?";
    return `${f?.[0] || ""}${l?.[0] || ""}`.toUpperCase();
  };

  const items = (latestMatches || []).slice(0, 5).map((m: any) => {
    const players = (m.players || []) as Array<{
      player_id: string;
      first_name: string | null;
      last_name: string | null;
      profile_photo: string | null;
      team_number: number;
    }>;

    const team1 = players.filter((p) => p.team_number === 1);
    const team2 = players.filter((p) => p.team_number === 2);

    const profileTeam = players.find((p) => p.player_id === profileId)?.team_number ?? 1;

    const sets = (m.sets || []) as Array<{ team1_score: number; team2_score: number; set_number: number }>;
    const setScores = sets.map((s) => `${s.team1_score}-${s.team2_score}`);

    const { won: setsWon, lost: setsLost } = sets.reduce(
      (acc, s) => {
        const wonThis = profileTeam === 1 ? s.team1_score > s.team2_score : s.team2_score > s.team1_score;
        return {
          won: acc.won + (wonThis ? 1 : 0),
          lost: acc.lost + (wonThis ? 0 : 1),
        };
      },
      { won: 0, lost: 0 }
    );

    const matchWon = setsWon > setsLost;

    return {
      id: m.match_id,
      date: m.match_date,
      team1,
      team2,
      sets,
      setsWon,
      setsLost,
      matchWon,
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.length > 0 ? (
              <div key={it.id} className="bg-accent/5 rounded-xl border border-accent/20 p-3 sm:p-4 space-y-3">
                {/* Header: time + result */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {it.date ? formatDistanceToNow(new Date(it.date), { addSuffix: true }) : ""}
                  </span>
                  <Badge variant={it.matchWon ? "default" : "destructive"}>
                    {it.matchWon ? "Won" : "Lost"}
                  </Badge>
                </div>

                {/* Teams - same structure as /matches */}
                <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                  {/* Team 1 */}
                  <div className="flex flex-col space-y-1 flex-1">
                    {it.team1.map((p) => (
                      <div key={p.player_id} className="flex items-center space-x-2">
                        <Avatar className="w-5 h-5 sm:w-6 sm:h-6">
                          <AvatarImage src={p.profile_photo || undefined} />
                          <AvatarFallback className="text-xs">
                            {getInitials(p.first_name, p.last_name)}
                          </AvatarFallback>
                        </Avatar>
                        <p className="font-medium text-foreground truncate text-xs sm:text-sm">
                          {`${p.first_name ?? ""} ${p.last_name ?? ""}`.trim() || "Player"}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Team 2 */}
                  <div className="flex flex-col space-y-1 flex-1">
                    {it.team2.map((p) => (
                      <div key={p.player_id} className="flex items-center justify-end space-x-2">
                        <p className="font-medium text-foreground truncate text-xs sm:text-sm text-right">
                          {`${p.first_name ?? ""} ${p.last_name ?? ""}`.trim() || "Player"}
                        </p>
                        <Avatar className="w-5 h-5 sm:w-6 sm:h-6">
                          <AvatarImage src={p.profile_photo || undefined} />
                          <AvatarFallback className="text-xs">
                            {getInitials(p.first_name, p.last_name)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sets - hide MMR change like /matches when not needed */}
                <div className="space-y-2">
                  {it.sets.map((s) => (
                    <SetCard
                      key={s.set_number}
                      set_number={s.set_number}
                      team1_score={s.team1_score}
                      team2_score={s.team2_score}
                      result={null}
                      change_amount={null}
                      status="SCORE_RECORDED"
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <p className="text-sm">No recent matches</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
