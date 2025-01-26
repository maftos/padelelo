import { Card } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface FeatureUpdate {
  version_number: string;
  is_deployed: boolean;
  release_date: string;
  islikedby: string[];
  change_items: string[];
  title: string;
}

export const ReleaseNotesSection = () => {
  const { data: featureUpdates, isLoading } = useQuery({
    queryKey: ['featureUpdates'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke<FeatureUpdate[]>('get_feature_updates');
      if (error) throw error;
      return data;
    },
  });

  // Only show the most recent update
  const latestUpdate = featureUpdates?.[0];

  return (
    <section className="mb-16 relative">
      <div className="absolute inset-0 bg-secondary/20 rounded-2xl backdrop-blur-sm -z-10" />
      <div className="p-8 md:p-12">
        <div className="flex items-center gap-3 mb-8">
          <ClipboardList className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold">Latest Updates</h2>
        </div>
        {isLoading ? (
          <div>Loading updates...</div>
        ) : latestUpdate ? (
          <Card className="p-8 bg-card/50 backdrop-blur border-accent">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">{latestUpdate.title}</h3>
              <span className="text-sm text-muted-foreground">
                {new Date(latestUpdate.release_date).toLocaleDateString()}
              </span>
            </div>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              {latestUpdate.change_items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </Card>
        ) : (
          <Card className="p-8 bg-card/50 backdrop-blur border-accent">
            <p>No updates available</p>
          </Card>
        )}
      </div>
    </section>
  );
};