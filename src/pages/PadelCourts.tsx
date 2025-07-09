
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Clock, Phone, Mail, Star, Globe, Users } from "lucide-react";
import { PadelMap } from "@/components/courts/PadelMap";
import { Helmet } from "react-helmet";

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
}

const PadelCourts = () => {
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
    priceRange: 'Contact for pricing'
  })) : [];

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
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
        <Navigation />
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

      <div className="min-h-screen bg-background">
        <Navigation />
        
        <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">Padel Courts in Mauritius</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover the best padel courts and clubs across the beautiful island of Mauritius. 
              From professional facilities to community courts, find the perfect place to play this exciting racquet sport.
            </p>
          </div>

          {/* Interactive Map Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Find Courts Near You</h2>
            <Card className="h-[400px]">
              <CardContent className="p-2 h-full">
                <PadelMap clubs={clubs} onClubSelect={() => {}} />
              </CardContent>
            </Card>
          </div>

          {/* Complete Venue Directory */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Complete Directory of Padel Courts</h2>
              <p className="text-muted-foreground">
                Browse all available padel courts in Mauritius with detailed information about facilities, 
                contact details, and booking options.
              </p>
            </div>

            <div className="grid gap-6">
              {clubs.map((club) => (
                <Card key={club.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="space-y-2">
                        <CardTitle className="flex items-center gap-2 text-xl">
                          {club.name}
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{club.rating}</span>
                          </div>
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          Professional padel facility in Mauritius
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2 text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                        <Users className="h-4 w-4" />
                        {club.numberOfCourts} court{club.numberOfCourts !== 1 ? 's' : ''} available
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <p className="text-muted-foreground leading-relaxed">
                      {club.description}
                    </p>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Contact Information */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Contact Information</h3>
                        
                        {club.phone && (
                          <div className="flex items-center gap-3">
                            <Phone className="h-4 w-4 text-primary" />
                            <div>
                              <p className="font-medium">Phone</p>
                              <a href={`tel:${club.phone}`} className="text-primary hover:underline">
                                {club.phone}
                              </a>
                            </div>
                          </div>
                        )}

                        {club.email && (
                          <div className="flex items-center gap-3">
                            <Mail className="h-4 w-4 text-primary" />
                            <div>
                              <p className="font-medium">Email</p>
                              <a href={`mailto:${club.email}`} className="text-primary hover:underline">
                                {club.email}
                              </a>
                            </div>
                          </div>
                        )}

                        {club.website && (
                          <div className="flex items-center gap-3">
                            <Globe className="h-4 w-4 text-primary" />
                            <div>
                              <p className="font-medium">Website</p>
                              <a href={club.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                Visit Website
                              </a>
                            </div>
                          </div>
                        )}

                        <div className="flex items-start gap-3">
                          <Clock className="h-4 w-4 text-primary mt-1" />
                          <div>
                            <p className="font-medium">Opening Hours</p>
                            <p className="text-sm text-muted-foreground">{club.openingHours}</p>
                          </div>
                        </div>
                      </div>

                      {/* Facilities & Pricing */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Facilities & Services</h3>
                        
                        <div>
                          <p className="font-medium mb-2">Available Amenities</p>
                          <div className="flex flex-wrap gap-2">
                            {club.amenities.map((amenity, index) => (
                              <span 
                                key={index}
                                className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full"
                              >
                                {amenity}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="font-medium">Pricing</p>
                          <p className="text-muted-foreground">{club.priceRange}</p>
                        </div>

                        <div>
                          <p className="font-medium">Court Booking</p>
                          <p className="text-sm text-muted-foreground">
                            Contact the facility directly to book your padel court and check availability.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Additional SEO Content */}
          <div className="space-y-6 bg-muted/50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold">Why Play Padel in Mauritius?</h2>
            <div className="prose max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                Mauritius offers an ideal setting for padel enthusiasts with its year-round tropical climate 
                and growing community of passionate players. Whether you're a beginner looking to learn this 
                exciting racquet sport or an experienced player seeking competitive matches, the island's 
                padel courts provide excellent facilities and welcoming environments.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Padel combines elements of tennis and squash, played on an enclosed court with walls that 
                are part of the game. It's perfect for players of all ages and skill levels, making it 
                one of the fastest-growing sports in Mauritius. Book your court today and join the 
                padel community!
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PadelCourts;
