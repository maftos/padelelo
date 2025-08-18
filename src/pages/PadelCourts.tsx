
import React, { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

import { MapPin, ChevronUp } from "lucide-react";
import { PadelMap } from "@/components/courts/PadelMap";
import { Helmet } from "react-helmet";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Drawer,
  DrawerContent, 
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger 
} from "@/components/ui/drawer";

import { PadelCourtsList } from "@/components/courts/PadelCourtsList";
import { toast } from "sonner";

export interface PadelClub {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number];
  phone?: string;
  email?: string;
  website?: string;
  rating: number;
  numberOfCourts: number;
  openingHours: string;
  description: string;
  amenities: string[];
  priceRange: string;
  region: string;
  estimatedFeePerPerson: string;
  image?: string;
  distanceKm?: number;
}

const PadelCourts = () => {
  const isMobile = useIsMobile();
  const { data: result, isLoading, error, refetch } = useQuery({
    queryKey: ['venues'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_all_venues');
      if (error) {
        console.error('Error fetching venues:', error);
        throw error;
      }
      return data as { 
        venues: any[]; 
        metadata: { 
          is_authenticated: boolean; 
          has_location: boolean; 
          location_based_sorting: boolean; 
          needs_location_prompt: boolean 
        };
        user_location?: { longitude: number; latitude: number } | null;
      };
    },
  });

  // Transform venue data to PadelClub format
  const clubs: PadelClub[] = Array.isArray(result?.venues) ? result!.venues.map((venue: any) => ({
    id: venue.venue_id,
    name: venue.name,
    address: 'Mauritius',
    coordinates: venue.coordinates ? [venue.coordinates.longitude, venue.coordinates.latitude] : [57.5522, -20.3484],
    phone: venue.phone_number,
    email: venue.email_address,
    website: venue.website_url,
    rating: 4.0,
    numberOfCourts: Array.isArray(venue.courts) ? venue.courts.length : 1,
    openingHours: Array.isArray(venue.opening_hours) && venue.opening_hours.length > 0 ? 
      venue.opening_hours.map((h: any) => `${h.day}: ${h.hours}`).join(', ') : 
      'Contact for hours',
    description: `Professional padel facility offering high-quality courts and equipment in Mauritius. Perfect for players of all skill levels looking to enjoy this exciting racquet sport.`,
    amenities: ['Equipment Rental', 'Professional Coaching', 'Parking Available', 'Changing Rooms'],
    priceRange: 'Contact for pricing',
    region: venue.region || 'CENTRAL',
    estimatedFeePerPerson: 'Rs 800',
    image: venue.photo_gallery && venue.photo_gallery.length > 0 ? Object.values(venue.photo_gallery[0])[0] as string : 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    distanceKm: typeof venue.distance === 'number' ? venue.distance : undefined
  })) : [];

const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hasLocalLocation, setHasLocalLocation] = useState<boolean>(() => {
    try { return !!localStorage.getItem('guest_location'); } catch { return false; }
  });
  const locationSavedRef = useRef(false);

  const handleUserLocation = async ({ latitude, longitude }: { latitude: number; longitude: number }) => {
    try {
      if (locationSavedRef.current) return;

      const isAuthenticated = result?.metadata?.is_authenticated === true;
      
      if (isAuthenticated) {
        // Authenticated user: save to database
        const { error } = await (supabase as any).rpc('update_user_location', {
          latitude_param: latitude,
          longitude_param: longitude,
        });
        if (error) throw error;
        locationSavedRef.current = true;
        toast.success('Location saved to your profile');
        // Refetch to get updated location-based data
        refetch();
      } else {
        // Guest user: save locally  
        try {
          localStorage.setItem('guest_location', JSON.stringify({ latitude, longitude, ts: Date.now() }));
          setHasLocalLocation(true);
          locationSavedRef.current = true;
          toast.success('Location saved locally');
        } catch (e) {
          console.warn('Local storage unavailable');
        }
      }
    } catch (err: any) {
      console.error('Failed to save location', err);
      toast.error(err?.message || 'Could not save your location');
    }
  };

  const requestLocation = () => {
    if (!("geolocation" in navigator)) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => handleUserLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      (err) => toast.error(err?.message || "Permission denied"),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Padel Courts in Mauritius",
    "description": "Complete directory of padel courts and clubs across Mauritius",
    "itemListElement": clubs.map((club, index) => ({
      "@type": "SportsClub",
      "position": index + 1,
      "name": club.name,
      "description": club.description,
      "telephone": club.phone,
      "email": club.email,
      "url": club.website,
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "MU",
        "addressLocality": "Mauritius"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": club.coordinates[1],
        "longitude": club.coordinates[0]
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": club.rating,
        "bestRating": 5
      }
    }))
  };

  // Improved location logic to reduce race conditions
  const hasUserLocation = result?.user_location !== null || hasLocalLocation;
  const showLocationPrompt = !hasUserLocation && !locationSavedRef.current;
  
  const handleRefreshLocation = () => {
    locationSavedRef.current = false; // Reset the flag to allow new location updates
    requestLocation();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="w-full max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading padel courts...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="w-full max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Error loading padel courts</h3>
              <p className="text-muted-foreground text-sm">
                Unable to load padel court information. Please try again later.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Padel Courts in Mauritius | Complete Directory of Padel Clubs</title>
        <meta name="description" content="Find the best padel courts in Mauritius. Complete directory with locations, contact details, prices, and booking information for all padel clubs across the island." />
        <meta name="keywords" content="padel courts mauritius, padel club mauritius, padel booking mauritius, padel facility mauritius, racquet sports mauritius" />
        <link rel="canonical" href="https://padelelo.com/padel-courts" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      <h1 className="sr-only">Padel Courts in Mauritius</h1>
      <div className="bg-background">
        {/* Desktop: Full-height split view (no page scroll) */}
        <section aria-label="Padel courts map and list" className="hidden md:block">
          <div className="h-[calc(100dvh-3rem)] overflow-hidden flex">
            <div className="flex-1 min-w-0 min-h-0 overflow-hidden">
              <PadelMap
                clubs={clubs}
                selectedClubId={selectedId}
                onClubSelect={(club) => setSelectedId(club.id)}
                onUserLocation={handleUserLocation}
                userLocation={result?.user_location}
              />
            </div>
            <div className="w-[clamp(360px,30%,520px)] shrink-0 min-h-0 overflow-hidden border-l">
              <PadelCourtsList
                clubs={clubs}
                selectedClubId={selectedId}
                onSelectClub={(id) => setSelectedId(id)}
                showLocationPrompt={showLocationPrompt}
                onRequestLocation={requestLocation}
                onRefreshLocation={handleRefreshLocation}
                hasUserLocation={hasUserLocation}
              />
            </div>
          </div>
        </section>

        {/* Mobile: Map backdrop with bottom drawer */}
        {isMobile && (
          <div className="fixed inset-0 h-[100dvh] overflow-hidden">
            {/* Full-screen map backdrop with no padding */}
            <div className="absolute inset-0">
              <PadelMap 
                clubs={clubs} 
                onClubSelect={(club) => setSelectedId(club.id)} 
                selectedClubId={selectedId} 
                onUserLocation={handleUserLocation}
                userLocation={result?.user_location} 
              />
            </div>
            
            {/* Bottom drawer - fixed to viewport bottom */}
            <Drawer>
              <DrawerTrigger asChild>
                <div className="fixed bottom-0 left-0 right-0 z-50">
                  <div className="bg-background/95 backdrop-blur-sm border-t rounded-t-xl shadow-lg">
                    <div className="flex items-center justify-center py-4 cursor-pointer">
                      <div className="w-12 h-1 bg-muted-foreground/50 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </DrawerTrigger>
              <DrawerContent className="h-[85vh] bg-background">
                <div className="flex-1 overflow-hidden">
                  <PadelCourtsList 
                    clubs={clubs} 
                    selectedClubId={selectedId} 
                    onSelectClub={(id) => setSelectedId(id)} 
                    showLocationPrompt={showLocationPrompt} 
                    onRequestLocation={requestLocation}
                    onRefreshLocation={handleRefreshLocation}
                    hasUserLocation={hasUserLocation}
                  />
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        )}

      </div>
    </>
  );
};

export default PadelCourts;
