import { Navigation } from "@/components/Navigation";

const ReleaseNotes = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container py-8 px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold text-primary">Release Notes</h1>
          <div className="space-y-6">
            <div className="p-6 rounded-lg bg-accent">
              <h2 className="text-xl font-semibold mb-2">Version 1.0.0 - Initial Release</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Launched MatchPadel platform</li>
                <li>Implemented basic matchmaking system</li>
                <li>Added friend system</li>
                <li>Introduced MMR calculations</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReleaseNotes;