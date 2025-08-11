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
      profileTeam,
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
              <div key={it.id} className="bg-accent/5 rounded-xl border border-accent/20 p-3 sm:p-4 space-y-3">
                {/* Header: time + result */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {it.date ? formatDistanceToNow(new Date(it.date), { addSuffix: true }) : ""}
                  </span>
                </div>

                {/* Teams - two rows per team on larger screens; on mobile, teams stacked and members side-by-side */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-6">
                  {/* Team 1 */}
                  <div className="flex flex-row sm:flex-col flex-1 min-w-0 items-center sm:items-start gap-3">
                    {/* Player 1 */}
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Avatar className="w-5 h-5 sm:w-6 sm:h-6 border border-background">
                        <AvatarImage src={it.team1[0]?.profile_photo || undefined} />
                        <AvatarFallback className="text-[10px]">
                          {getInitials(it.team1[0]?.first_name, it.team1[0]?.last_name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs sm:text-sm font-medium truncate">
                        {it.team1[0]?.first_name || 'Player'}
                      </span>
                    </div>
                    {/* Player 2 */}
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Avatar className="w-5 h-5 sm:w-6 sm:h-6 border border-background">
                        <AvatarImage src={it.team1[1]?.profile_photo || undefined} />
                        <AvatarFallback className="text-[10px]">
                          {getInitials(it.team1[1]?.first_name, it.team1[1]?.last_name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs sm:text-sm font-medium truncate">
                        {it.team1[1]?.first_name || 'Player'}
                      </span>
                    </div>
                  </div>

                  {/* Team 2 */}
                  <div className="flex flex-row sm:flex-col flex-1 min-w-0 items-center sm:items-end gap-3">
                    {/* Player 1 */}
                    <div className="flex items-center gap-1.5 min-w-0 justify-end sm:justify-end">
                      <span className="text-xs sm:text-sm font-medium truncate text-right sm:text-inherit">
                        {it.team2[0]?.first_name || 'Player'}
                      </span>
                      <Avatar className="w-5 h-5 sm:w-6 sm:h-6 border border-background">
                        <AvatarImage src={it.team2[0]?.profile_photo || undefined} />
                        <AvatarFallback className="text-[10px]">
                          {getInitials(it.team2[0]?.first_name, it.team2[0]?.last_name)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    {/* Player 2 */}
                    <div className="flex items-center gap-1.5 min-w-0 justify-end sm:justify-end">
                      <span className="text-xs sm:text-sm font-medium truncate text-right sm:text-inherit">
                        {it.team2[1]?.first_name || 'Player'}
                      </span>
                      <Avatar className="w-5 h-5 sm:w-6 sm:h-6 border border-background">
                        <AvatarImage src={it.team2[1]?.profile_photo || undefined} />
                        <AvatarFallback className="text-[10px]">
                          {getInitials(it.team2[1]?.first_name, it.team2[1]?.last_name)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                </div>

                {/* Sets - hide MMR change like /matches when not needed */}
                <div className="space-y-2">
                  {it.sets.map((s, idx) => {
                    const result = (s as any).change_type as 'WIN' | 'LOSS' | undefined;
                    const won = result ? result === 'WIN' : (it.profileTeam === 1 ? s.team1_score > s.team2_score : s.team2_score > s.team1_score);
                    return (
                      <div key={idx} className="grid grid-cols-3 items-center p-3 rounded-lg bg-background/50 border border-border/30">
                        <div />
                        <div className="flex items-center justify-center space-x-2">
                          <span className={`text-sm ${s.team1_score > s.team2_score ? 'font-bold' : 'font-medium'}`}>{s.team1_score}</span>
                          <span className="text-muted-foreground text-sm">-</span>
                          <span className={`text-sm ${s.team2_score > s.team1_score ? 'font-bold' : 'font-medium'}`}>{s.team2_score}</span>
                        </div>
                        <div className="flex justify-end">
                          <Badge variant={won ? 'default' : 'destructive'} className={won ? 'px-2 py-0.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white' : ''}>{won ? 'Won' : 'Lost'}</Badge>
                        </div>
                      </div>
                    );
                  })}
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
