
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Users, ExternalLink, CreditCard } from "lucide-react";
import { PadelMap } from "@/components/courts/PadelMap";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

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
    priceRange: 'Contact for pricing',
    region: venue.region || 'CENTRAL',
    estimatedFeePerPerson: 'Rs 800-1200',
    image: venue.photo_gallery && venue.photo_gallery.length > 0 ? Object.values(venue.photo_gallery[0])[0] as string : 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
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
          {/* Header Section */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Padel Courts</h1>
              <p className="text-muted-foreground">Find your perfect court across Mauritius</p>
            </div>
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

          {/* Court Directory */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">All Padel Courts</h2>
              <p className="text-muted-foreground">
                Browse available padel courts across Mauritius
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {clubs.map((club) => (
                <Link key={club.id} to={`/padel-courts/${club.id}`}>
                  <Card className="hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer overflow-hidden">
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={club.image} 
                        alt={club.name}
                        className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                      />
                    </div>
                    <CardHeader className="pb-3">
                      <div className="space-y-2">
                        <CardTitle className="flex items-center justify-between text-lg">
                          {club.name}
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{club.rating}</span>
                          </div>
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {club.region}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-3 pt-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                          <Users className="h-4 w-4" />
                          {club.numberOfCourts} court{club.numberOfCourts !== 1 ? 's' : ''}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <CreditCard className="h-4 w-4" />
                          {club.estimatedFeePerPerson}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
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
