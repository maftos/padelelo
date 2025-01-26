import { Navigation } from "@/components/Navigation";

const MatchmakingMath = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container py-8 px-4 max-w-4xl mx-auto">
        <div className="space-y-8">
          <h1 className="text-3xl font-bold text-primary">Matchmaking Algorithm</h1>
          
          <div className="space-y-6">
            <section className="p-6 rounded-lg bg-accent">
              <h2 className="text-xl font-semibold mb-4">ELO Rating System</h2>
              <p className="text-muted-foreground mb-6">
                Our matchmaking system is based on the ELO rating system, originally developed for chess. 
                The system calculates expected win rates and adjusts ratings after each match based on the outcome 
                and the relative skill difference between teams.
              </p>
              <div className="bg-muted p-6 rounded-md overflow-x-auto">
                <div className="text-center space-y-4">
                  <p className="text-lg font-medium">Expected Win Rate Formula:</p>
                  <div className="inline-block text-xl">
                    <div className="border-b border-foreground pb-2">
                      <span>E</span>
                      <sub>team1</sub>
                      <span> = </span>
                      <span>1</span>
                    </div>
                    <div className="pt-2">
                      <span>1 + 10</span>
                      <sup>(R<sub>team2</sub> - R<sub>team1</sub>)/1500</sup>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="p-6 rounded-lg bg-accent">
              <h2 className="text-xl font-semibold mb-4">MMR Adjustment</h2>
              <p className="text-muted-foreground mb-6">
                After each match, ratings are adjusted using:
              </p>
              <div className="bg-muted p-6 rounded-md overflow-x-auto">
                <div className="text-center space-y-4">
                  <p className="text-lg font-medium">New Rating Formula:</p>
                  <div className="text-xl">
                    <span>New Rating = Old Rating + K × (Actual - Expected)</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    Where K is the adjustment factor (50) and Actual is 1 for a win, 0 for a loss
                  </p>
                </div>
              </div>
            </section>

            <section className="p-6 rounded-lg bg-accent">
              <h2 className="text-xl font-semibold mb-4">Example Calculation</h2>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  In an even matchup where both teams have the same average MMR:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Expected win rate would be 50% (0.5) for both teams</li>
                  <li>When a team wins, their Actual score is 1 (while the losing team gets 0)</li>
                  <li>MMR Change = 50 × (1 - 0.5) = 25 points</li>
                  <li>Winners gain 25 MMR points</li>
                  <li>Losers lose 25 MMR points</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  The MMR change will be smaller when a higher-rated team wins against a lower-rated team 
                  (as this was expected) and larger when a lower-rated team wins against a higher-rated team 
                  (as this was unexpected).
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MatchmakingMath;