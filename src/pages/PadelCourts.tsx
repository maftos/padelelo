
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { PadelMap } from "@/components/courts/PadelMap";
import { Button } from "@/components/ui/button";
import { MapPin, List, Phone, Clock, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SEOHead } from "@/components/seo/SEOHead";
import { getLocalBusinessSchema, getOrganizationSchema } from "@/utils/structuredData";

interface Venue {
  venue_id: string;
  name: string;
  location: string;
  phone_number: string;
  opening_hours: string;
  website: string;
  coordinates: [number, number];
  region: string;
}

const PadelCourts = () => {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  const { data: venues, isLoading, error } = useQuery({
    queryKey: ['padel-courts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('venues')
        .select('*');

      if (error) {
        console.error("Error fetching venues:", error);
        throw error;
      }

      // Transform the data to match our Venue interface
      return data.map(venue => ({
        venue_id: venue.venue_id,
        name: venue.name,
        location: venue.region || 'Mauritius',
        phone_number: venue.phone_number || '',
        opening_hours: venue.opening_hours ? 
          (Array.isArray(venue.opening_hours) ? venue.opening_hours.join(', ') : String(venue.opening_hours)) 
          : 'Contact for hours',
        website: venue.website_url || '',
        coordinates: [57.5522, -20.3484] as [number, number], // Default to Mauritius center
        region: venue.region || 'Mauritius'
      })) as Venue[];
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const structuredData = [
    getOrganizationSchema(),
    getLocalBusinessSchema(),
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Padel Courts in Mauritius",
      "description": "Professional padel courts and venues across Mauritius",
      "numberOfItems": venues?.length || 0,
      "itemListElement": venues?.map((venue, index) => ({
        "@type": "SportsActivityLocation",
        "position": index + 1,
        "name": venue.name,
        "sport": "Padel",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "MU",
          "addressRegion": venue.region || "Mauritius"
        }
      })) || []
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Padel Courts in Mauritius - Find Courts Near You | PadelELO"
        description="Discover the best padel courts and venues across Mauritius. Find locations, contact details, opening hours, and book your next game at top-quality facilities."
        canonicalUrl="/padel-courts"
        structuredData={structuredData}
        keywords="padel courts mauritius, padel venues, court booking mauritius, padel facilities, where to play padel mauritius"
      />
      <Navigation />
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Padel Courts in Mauritius</h1>
          <div className="space-x-2">
            <Button
              variant={viewMode === 'map' ? 'default' : 'outline'}
              onClick={() => setViewMode('map')}
            >
              <MapPin className="w-4 h-4 mr-2" />
              Map View
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4 mr-2" />
              List View
            </Button>
          </div>
        </div>

        {isLoading && <p>Loading padel courts...</p>}
        {error && <p className="text-red-500">Error: {error.message}</p>}

        {viewMode === 'map' && venues && (
          <PadelMap venues={venues} />
        )}

        {viewMode === 'list' && venues && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.map((venue) => (
              <Card key={venue.venue_id}>
                <CardHeader>
                  <CardTitle>{venue.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">{venue.location}</p>
                  </div>
                  {venue.phone_number && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">{venue.phone_number}</p>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">{venue.opening_hours}</p>
                  </div>
                  {venue.website && (
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a href={venue.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">
                        Website
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PadelCourts;
