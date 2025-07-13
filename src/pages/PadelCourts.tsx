
import React, { useState, useMemo } from "react";
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

  const { data: venuesData, isLoading, error } = useQuery({
    queryKey: ['all-venues'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_all_venues');

      if (error) {
        console.error("Error fetching venues:", error);
        throw error;
      }

      return data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  // Transform the venues data from the database function
  const venues: Venue[] = useMemo(() => {
    if (!venuesData || !Array.isArray(venuesData)) {
      return [];
    }

    return venuesData.map(venue => ({
      venue_id: venue.venue_id,
      name: venue.name,
      location: venue.region || 'Mauritius',
      phone_number: venue.phone_number || '',
      opening_hours: venue.opening_hours ? 
        (Array.isArray(venue.opening_hours) ? venue.opening_hours.join(', ') : String(venue.opening_hours)) 
        : 'Contact for hours',
      website: venue.website_url || '',
      coordinates: venue.coordinates || [57.5522, -20.3484], // Default to Mauritius center if no coordinates
      region: venue.region || 'Mauritius'
    }));
  }, [venuesData]);

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
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold">Padel Courts in Mauritius</h1>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'map' ? 'default' : 'outline'}
              onClick={() => setViewMode('map')}
              size="sm"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Map View
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              onClick={() => setViewMode('list')}
              size="sm"
            >
              <List className="w-4 h-4 mr-2" />
              List View
            </Button>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading padel courts...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
            <p className="text-destructive">Error loading venues: {error.message}</p>
          </div>
        )}

        {viewMode === 'map' && venues && venues.length > 0 && (
          <div className="h-[500px] md:h-[600px] rounded-lg overflow-hidden shadow-lg">
            <PadelMap venues={venues} />
          </div>
        )}

        {viewMode === 'list' && venues && venues.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.map((venue) => (
              <Card key={venue.venue_id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{venue.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">{venue.location}</p>
                  </div>
                  {venue.phone_number && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <a 
                        href={`tel:${venue.phone_number}`}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {venue.phone_number}
                      </a>
                    </div>
                  )}
                  <div className="flex items-start space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">{venue.opening_hours}</p>
                  </div>
                  {venue.website && (
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <a 
                        href={venue.website} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-sm text-primary hover:underline transition-colors"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {venues && venues.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No venues found</h3>
            <p className="text-muted-foreground">Check back later for padel court listings.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PadelCourts;
