
import { Card } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatDate } from "@/lib/date";

interface FeatureUpdate {
  version_number: string;
  is_deployed: boolean;
  release_date: string;
  islikedby: string[];
  change_items: string[];
  title: string;
}

const Roadmap = () => {
  const { data: featureUpdates, isLoading } = useQuery({
    queryKey: ['featureUpdates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_feature_updates');
      
      if (error) throw error;
      return data as FeatureUpdate[];
    },
  });

  const deployedUpdates = featureUpdates?.filter(update => update.is_deployed) || [];
  const futureUpdates = featureUpdates?.filter(update => !update.is_deployed) || [];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Feature Updates - PadelELO</title>
        <meta name="description" content="Check out our latest updates and upcoming features for PadelELO, the premier padel matchmaking platform in Mauritius." />
      </Helmet>
      <main className="container py-8 px-4">
        <div className="max-w-3xl mx-auto space-y-12">
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <ClipboardList className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Released Features</h1>
            </div>
            {isLoading ? (
              <div>Loading updates...</div>
            ) : (
              deployedUpdates.map((update, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">{update.title}</h2>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(update.release_date)}
                    </span>
                  </div>
                  <div className="space-y-4">
                    <span className="inline-block px-2 py-1 text-sm bg-green-100 text-green-800 rounded">
                      Deployed
                    </span>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      {update.change_items.map((item, itemIndex) => (
                        <li key={itemIndex}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </Card>
              ))
            )}
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <ClipboardList className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold">Future Improvements</h2>
            </div>
            {isLoading ? (
              <div>Loading updates...</div>
            ) : (
              futureUpdates.map((update, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">{update.title}</h2>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(update.release_date)}
                    </span>
                  </div>
                  <div className="space-y-4">
                    <span className="inline-block px-2 py-1 text-sm bg-yellow-100 text-yellow-800 rounded">
                      Coming Soon
                    </span>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      {update.change_items.map((item, itemIndex) => (
                        <li key={itemIndex}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </Card>
              ))
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Roadmap;