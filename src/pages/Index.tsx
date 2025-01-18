import { MatchForm } from "@/components/MatchForm";
import { Navigation } from "@/components/Navigation";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container py-8 px-4 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Padel Match Tracker</h1>
          <p className="text-muted-foreground">Register and track your padel matches</p>
        </div>
        
        <div className="flex flex-col items-center">
          <MatchForm />
        </div>
      </main>
    </div>
  );
};

export default Index;