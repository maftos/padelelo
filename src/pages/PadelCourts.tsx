
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Clock, Phone, Mail, Star } from "lucide-react";
import { PadelMap } from "@/components/courts/PadelMap";

export interface PadelClub {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number]; // [longitude, latitude]
  phone?: string;
  email?: string;
  website?: string;
  rating: number;
  numberOfCourts: number;
  openingHours: string;
  description: string;
  amenities: string[];
  priceRange: string;
}

const PadelCourts = () => {
  const [selectedClub, setSelectedClub] = useState<PadelClub | null>(null);

  const { data: venues, isLoading, error } = useQuery({
    queryKey: ['venues'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_all_venues');
      
      if (error) {
        console.error('Error fetching venues:', error);
        throw error;
      }
      
      return data;
    },
  });

  // Transform venue data to PadelClub format
  const clubs: PadelClub[] = Array.isArray(venues) ? venues.map((venue: any) => ({
    id: venue.venue_id,
    name: venue.name,
    address: venue.location || 'Address not available',
    coordinates: venue.coordinates || [57.5522, -20.3484], // Default to center of Mauritius
    phone: venue.phone_number,
    email: venue.email_address,
    website: venue.website_url,
    rating: 4.0, // Default rating since not in venue data
    numberOfCourts: Array.isArray(venue.courts) ? venue.courts.length : 1,
    openingHours: venue.opening_hours || 'Hours not available',
    description: 'Professional padel facility',
    amenities: ['Equipment Rental', 'Coaching', 'Parking'],
    priceRange: 'Contact for pricing'
  })) : [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="w-full max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading venues...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="w-full max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Error loading venues</h3>
              <p className="text-muted-foreground text-sm">
                Unable to load padel courts. Please try again later.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Padel Courts in Mauritius</h1>
              <p className="text-muted-foreground">Discover the best padel clubs across the island</p>
            </div>
          </div>
        </div>

        {/* Map and Details Layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-1">
            <Card className="h-[700px]">
              <CardHeader>
                <CardTitle>Interactive Map</CardTitle>
                <CardDescription>
                  Click on any marker to view club details
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 h-[620px]">
                <PadelMap clubs={clubs} onClubSelect={setSelectedClub} />
              </CardContent>
            </Card>
          </div>

          {/* Club Details Section */}
          <div className="lg:col-span-1">
            {selectedClub ? (
              <Card className="h-[700px] overflow-y-auto">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {selectedClub.name}
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{selectedClub.rating}</span>
                        </div>
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <MapPin className="h-4 w-4" />
                        {selectedClub.address}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">{selectedClub.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Courts</h4>
                      <p className="text-sm text-muted-foreground">{selectedClub.numberOfCourts} courts available</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Price Range</h4>
                      <p className="text-sm text-muted-foreground">{selectedClub.priceRange}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Opening Hours
                    </h4>
                    <p className="text-sm text-muted-foreground">{selectedClub.openingHours}</p>
                  </div>

                  {selectedClub.phone && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Contact
                      </h4>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">{selectedClub.phone}</p>
                        {selectedClub.email && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {selectedClub.email}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Amenities</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedClub.amenities.map((amenity, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-[700px] flex items-center justify-center">
                <CardContent className="text-center">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Select a Padel Club</h3>
                  <p className="text-muted-foreground text-sm">
                    Click on any marker on the map to view detailed information about the club
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PadelCourts;
