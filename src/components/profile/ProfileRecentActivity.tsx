import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

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
      setScores,
      setsWon,
      setsLost,
      matchWon,
      venue: m.venue_name || undefined,
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
            items.map((it) => (
              <div key={it.id} className="p-4 rounded-lg bg-card/50 hover:bg-card/80 transition-colors">
                <div className="flex items-center justify-between gap-3">
                  {/* Left: Teams */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {/* Team 1 */}
                      <div className="flex items-center gap-1 min-w-0">
                        {it.team1.map((p, idx) => (
                          <div key={p.player_id} className="flex items-center gap-1 min-w-0">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={p.profile_photo || undefined} />
                              <AvatarFallback className="text-[10px]">
                                {getInitials(p.first_name, p.last_name)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs truncate max-w-[90px]">
                              {`${p.first_name ?? ""} ${p.last_name ?? ""}`.trim() || "Player"}
                            </span>
                            {idx === 0 && <span className="text-xs text-muted-foreground">&</span>}
                          </div>
                        ))}
                      </div>

                      <span className="text-xs text-muted-foreground">vs</span>

                      {/* Team 2 */}
                      <div className="flex items-center gap-1 min-w-0">
                        {it.team2.map((p, idx) => (
                          <div key={p.player_id} className="flex items-center gap-1 min-w-0">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={p.profile_photo || undefined} />
                              <AvatarFallback className="text-[10px]">
                                {getInitials(p.first_name, p.last_name)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs truncate max-w-[90px]">
                              {`${p.first_name ?? ""} ${p.last_name ?? ""}`.trim() || "Player"}
                            </span>
                            {idx === 0 && <span className="text-xs text-muted-foreground">&</span>}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Time and venue */}
                    <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                      <span>
                        {it.date ? formatDistanceToNow(new Date(it.date), { addSuffix: true }) : ""}
                      </span>
                      {it.venue && <span>• {it.venue}</span>}
                    </div>
                  </div>

                  {/* Right: Result and Score */}
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <Badge variant={it.matchWon ? "default" : "destructive"}>
                      {it.matchWon ? "Win" : "Loss"}
                    </Badge>
                    <div className="text-xs text-muted-foreground">
                      {it.setsWon}-{it.setsLost} ({it.setScores.join(", ")})
                    </div>
                  </div>
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
