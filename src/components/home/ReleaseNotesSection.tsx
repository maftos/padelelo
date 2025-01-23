import { Card } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";

export const ReleaseNotesSection = () => {
  return (
    <section className="mb-16 relative">
      <div className="absolute inset-0 bg-secondary/20 rounded-2xl backdrop-blur-sm -z-10" />
      <div className="p-8 md:p-12">
        <div className="flex items-center gap-3 mb-8">
          <ClipboardList className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold">Latest Updates</h2>
        </div>
        <Card className="p-8 bg-card/50 backdrop-blur border-accent">
          <h3 className="text-xl font-semibold mb-4">Version 1.0.0 - Initial Release</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Launched PadelELO platform</li>
            <li>Implemented basic matchmaking system</li>
            <li>Added friend system</li>
            <li>Introduced MMR calculations</li>
          </ul>
        </Card>
      </div>
    </section>
  );
};