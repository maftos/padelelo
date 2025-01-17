import { MatchForm } from "@/components/MatchForm";
import { RecentMatches } from "@/components/RecentMatches";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8 px-4 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Padel Match Tracker</h1>
          <p className="text-muted-foreground">Register and track your padel matches</p>
        </div>
        
        <div className="flex flex-col items-center gap-8 md:gap-12">
          <MatchForm />
          <RecentMatches />
        </div>
      </main>
    </div>
  );
};

export default Index;