import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";
import { Helmet } from "react-helmet";

const Roadmap = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Roadmap - PadelELO</title>
        <meta name="description" content="Check out our latest updates and upcoming features for PadelELO, the premier padel matchmaking platform in Mauritius." />
      </Helmet>
      <Navigation />
      <main className="container py-8 px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <ClipboardList className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Latest Updates</h1>
            </div>
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Version 1.0.0 - Initial Release</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Launched PadelELO platform</li>
                <li>Implemented basic matchmaking system</li>
                <li>Added friend system</li>
                <li>Introduced MMR calculations</li>
              </ul>
            </Card>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold">Coming Soon</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Advanced Statistics</h3>
                <p className="text-muted-foreground">Detailed analytics and visualization of match history and performance metrics.</p>
              </Card>
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Tournament System</h3>
                <p className="text-muted-foreground">Organize and participate in tournaments with automatic bracket generation.</p>
              </Card>
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Mobile App</h3>
                <p className="text-muted-foreground">Native mobile application for iOS and Android platforms.</p>
              </Card>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Roadmap;