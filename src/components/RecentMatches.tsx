import { Card } from "@/components/ui/card";

interface Match {
  id: number;
  date: string;
  player1: string;
  player2: string;
  score1: number;
  score2: number;
}

const sampleMatches: Match[] = [
  {
    id: 1,
    date: "2024-03-20",
    player1: "John",
    player2: "Sarah",
    score1: 6,
    score2: 4,
  },
  {
    id: 2,
    date: "2024-03-19",
    player1: "Mike",
    player2: "Emma",
    score1: 7,
    score2: 5,
  },
];

export const RecentMatches = () => {
  return (
    <div className="space-y-4 w-full max-w-md animate-slide-up">
      <h2 className="text-xl font-semibold">Recent Matches</h2>
      <div className="space-y-3">
        {sampleMatches.map((match) => (
          <Card key={match.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{match.date}</p>
                <p className="font-medium">
                  {match.player1} vs {match.player2}
                </p>
              </div>
              <div className="text-lg font-semibold">
                {match.score1} - {match.score2}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};