import { Card } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { formatDate } from "@/lib/date";
import { Button } from "@/components/ui/button";

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
      const { data, error } = await supabase
        .rpc('get_feature_updates');
      
      if (error) throw error;
      return data as FeatureUpdate[];
    },
  });

  // Only show the most recent update
  const latestUpdate = featureUpdates?.find(update => update.is_deployed);
  
  // Get upcoming features (where is_deployed = false)
  const upcomingFeatures = featureUpdates?.filter(update => !update.is_deployed).slice(0, 3) || [];

  return (
    <section className="mb-16 relative animate-fade-in [animation-delay:200ms]">
      <div className="absolute inset-0 bg-secondary/20 rounded-2xl backdrop-blur-sm -z-10" />
      <div className="p-8 md:p-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <ClipboardList className="h-8 w-8 text-primary animate-pulse-subtle" />
            <h2 className="text-3xl font-bold">Latest Updates</h2>
          </div>
          <Link to="/roadmap">
            <Button variant="outline">View all updates</Button>
          </Link>
        </div>
        {isLoading ? (
          <div>Loading updates...</div>
        ) : latestUpdate ? (
          <Card className="p-8 bg-card/50 backdrop-blur border-accent animate-scale-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">{latestUpdate.title}</h3>
              <span className="text-sm text-muted-foreground">
                {formatDate(latestUpdate.release_date)}
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

        {upcomingFeatures.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Coming Soon</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingFeatures.map((feature, index) => (
                <Card 
                  key={index} 
                  className="p-6 bg-card/50 backdrop-blur border-accent animate-slide-in-right"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.change_items[0]}</p>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};