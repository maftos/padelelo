import { Navigation } from "@/components/Navigation";

const MatchmakingMath = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container py-8 px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold text-primary">Matchmaking Mathematics</h1>
          
          <div className="space-y-6">
            <section className="p-6 rounded-lg bg-accent">
              <h2 className="text-xl font-semibold mb-4">ELO Rating System</h2>
              <p className="text-muted-foreground">
                Our matchmaking system is based on the ELO rating system, originally developed for chess. 
                The system calculates expected win rates and adjusts ratings after each match based on the outcome 
                and the relative skill difference between teams.
              </p>
            </section>

            <section className="p-6 rounded-lg bg-accent">
              <h2 className="text-xl font-semibold mb-4">Expected Win Rate</h2>
              <p className="text-muted-foreground">
                The expected win rate is calculated using the formula:
              </p>
              <pre className="mt-2 p-4 bg-muted rounded-md">
                E = 1 / (1 + 10^((R2 - R1)/400))
              </pre>
              <p className="mt-2 text-muted-foreground">
                Where R1 and R2 are the average MMR ratings of each team.
              </p>
            </section>

            <section className="p-6 rounded-lg bg-accent">
              <h2 className="text-xl font-semibold mb-4">MMR Adjustment</h2>
              <p className="text-muted-foreground">
                After each match, ratings are adjusted using:
              </p>
              <pre className="mt-2 p-4 bg-muted rounded-md">
                New Rating = Old Rating + K * (Actual - Expected)
              </pre>
              <p className="mt-2 text-muted-foreground">
                Where K is the adjustment factor (typically 32) and Actual is 1 for a win, 0 for a loss.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MatchmakingMath;