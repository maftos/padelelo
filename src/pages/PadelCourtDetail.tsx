import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Clock, Phone, Mail, Star, Globe, Users } from "lucide-react";
import { Helmet } from "react-helmet";
import { PadelClub } from "./PadelCourts";
import { PhotoGallery } from "@/components/courts/PhotoGallery";
import { ReviewSection } from "@/components/courts/ReviewSection";

const PadelCourtDetail = () => {
  const { courtId } = useParams();
  const navigate = useNavigate();

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
    image: venue.photo_gallery && venue.photo_gallery.length > 0 ? venue.photo_gallery[0] : undefined
  })) : [];

  const club = clubs.find(c => c.id === courtId);

  // Extract photo gallery from venue data
  const venueData = Array.isArray(venues) ? venues.find((v: any) => v.venue_id === courtId) : null;
  const photoGallery = (venueData as any)?.photo_gallery || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="w-full max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading court details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !club) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="w-full max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Court not found</h3>
              <p className="text-muted-foreground text-sm mb-4">
                The padel court you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={() => navigate('/padel-courts')}>
                Back to Courts
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{club.name} | Padel Court in Mauritius</title>
        <meta name="description" content={`${club.name} - ${club.description} Located in Mauritius with ${club.numberOfCourts} courts available.`} />
        <meta name="keywords" content={`${club.name}, padel court mauritius, padel booking mauritius, ${club.name} mauritius`} />
        <link rel="canonical" href={`https://padelelo.com/padel-courts/${club.id}`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />
        
        {/* Back Button */}
        <div className="w-full max-w-7xl mx-auto px-4 py-4">
          <Button variant="ghost" asChild>
            <Link to="/padel-courts">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courts
            </Link>
          </Button>
        </div>

        {/* Photo Gallery - Hero Section */}
        <div className="w-full">
          <PhotoGallery photos={photoGallery} venueName={club.name} />
        </div>

        <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-6">
          {/* Court Header */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                  {club.name}
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-lg font-medium">{club.rating}</span>
                  </div>
                </h1>
                <p className="text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Professional padel facility in Mauritius
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm bg-primary/10 text-primary px-4 py-2 rounded-full">
                <Users className="h-4 w-4" />
                {club.numberOfCourts} court{club.numberOfCourts !== 1 ? 's' : ''} available
              </div>
            </div>
          </div>

          {/* Main Content */}
          <Card className="overflow-hidden">
            <CardContent className="p-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-3">About This Facility</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {club.description}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
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

              {/* Call to Action */}
              <div className="pt-6 border-t">
                <div className="flex flex-col sm:flex-row gap-3">
                  {club.phone && (
                    <Button asChild>
                      <a href={`tel:${club.phone}`}>
                        <Phone className="h-4 w-4 mr-2" />
                        Call Now
                      </a>
                    </Button>
                  )}
                  {club.website && (
                    <Button variant="outline" asChild>
                      <a href={club.website} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4 mr-2" />
                        Visit Website
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Review Section */}
          <ReviewSection venueId={club.id} venueName={club.name} />
        </div>
      </div>
    </>
  );
};

export default PadelCourtDetail;