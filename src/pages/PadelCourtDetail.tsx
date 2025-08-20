import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Clock, Phone, Mail, Star, Globe, Users } from "lucide-react";
import { Helmet } from "react-helmet";
import { PadelClub } from "./PadelCourts";
import { PhotoGallery } from "@/components/courts/PhotoGallery";
import { ReviewSection } from "@/components/courts/ReviewSection";

const PadelCourtDetail = () => {
  const { venueId } = useParams();
  const navigate = useNavigate();

  const { data: venue, isLoading, error } = useQuery({
    queryKey: ['venue', venueId],
    queryFn: async () => {
      if (!venueId) throw new Error('Venue ID is required');
      console.log('Fetching venue...', venueId);
      const { data, error } = await supabase
        .from('venues')
        .select('*')
        .eq('venue_id', venueId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!venueId
  });

  // Helper function to extract amenities from court data
  function getVenueAmenities(courts: any): string[] {
    const amenities = ['Professional Courts'];
    
    if (courts && Array.isArray(courts) && courts.length > 0) {
      const hasIndoor = courts.some((court: any) => court.is_indoor);
      const hasOutdoor = courts.some((court: any) => !court.is_indoor);
      const surfaceTypes = [...new Set(courts.map((court: any) => court.surface_type))];
      
      if (hasIndoor) amenities.push('Indoor Courts');
      if (hasOutdoor) amenities.push('Outdoor Courts');
      
      surfaceTypes.forEach(surface => {
        if (surface) amenities.push(`${surface} Surface`);
      });
    }
    
    amenities.push('Equipment Rental', 'Parking Available', 'Changing Rooms');
    return amenities;
  }

  // Parse coordinates data
  const getCoordinatesFromVenue = (venue: any): [number, number] => {
    try {
      if (venue.coordinates && venue.coordinates.longitude && venue.coordinates.latitude) {
        return [venue.coordinates.longitude, venue.coordinates.latitude];
      }
      // Fallback to Mauritius center
      return [57.5522, -20.3484];
    } catch {
      return [57.5522, -20.3484];
    }
  };

  // Parse photo gallery - convert from object array to string array
  const parsePhotoGallery = (photoGallery: any): string[] => {
    try {
      if (Array.isArray(photoGallery) && photoGallery.length > 0) {
        return photoGallery.map((photoObj: any) => {
          if (typeof photoObj === 'object' && photoObj !== null) {
            // Extract the first value from the object (the URL)
            const url = Object.values(photoObj)[0];
            return typeof url === 'string' ? url : '';
          }
          return '';
        }).filter(Boolean); // Remove empty strings
      }
      return [];
    } catch {
      return [];
    }
  };

  // Extract main image from photo gallery
  const getMainImage = (photoGallery: any): string => {
    const photos = parsePhotoGallery(photoGallery);
    return photos.length > 0 ? photos[0] : 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
  };

  // Transform venue data to PadelClub format
  const club: PadelClub | null = venue ? {
    id: venue.venue_id,
    name: venue.name,
    address: `${venue.region}, Mauritius`,
    coordinates: getCoordinatesFromVenue(venue),
    phone: venue.phone_number,
    email: venue.email_address,
    website: venue.website_url,
    numberOfCourts: (venue.courts && typeof venue.courts === 'object' && !Array.isArray(venue.courts) && 'total_count' in venue.courts) ? Number(venue.courts.total_count) : Array.isArray(venue.courts) ? venue.courts.length : 1,
    openingHours: Array.isArray(venue.opening_hours) && venue.opening_hours.length > 0 ? 
      venue.opening_hours.map((h: any) => `${h.day}: ${h.open_time || h.hours}-${h.close_time || ''}`).join(', ') : 
      'Contact for hours',
    description: `Professional padel facility offering high-quality courts and equipment in ${venue.region}, Mauritius. Perfect for players of all skill levels looking to enjoy this exciting racquet sport.`,
    amenities: getVenueAmenities(venue.courts),
    priceRange: 'Contact for pricing',
    region: venue.region || 'CENTRAL',
    estimatedFeePerPerson: 'Rs 800-1200',
    image: getMainImage(venue.photo_gallery),
    status: (venue as any).status || 'ACTIVE'
  } : null;

  // Extract photo gallery from venue data as string array
  const photoGallery = parsePhotoGallery(venue?.photo_gallery);

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
        <div className="w-full max-w-4xl mx-auto px-4 py-4">
          <Button variant="ghost" asChild>
            <Link to="/padel-courts">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courts
            </Link>
          </Button>
        </div>

        {/* Court Header - Above Gallery */}
        <div className="w-full max-w-4xl mx-auto px-4 pb-6">
          <div className="space-y-4">
            <div className="flex flex-col gap-4">
              <div className="space-y-3">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex flex-col sm:flex-row sm:items-center gap-3">
                  <span>{club.name}</span>
                  {(club.status === 'COMING_SOON' || club.status === 'INACTIVE') && (
                    <Badge 
                      variant={club.status === 'COMING_SOON' ? 'secondary' : 'destructive'}
                      className="text-sm px-3 py-1"
                    >
                      {club.status === 'COMING_SOON' ? 'Coming Soon' : 'Inactive'}
                    </Badge>
                  )}
                </h1>
                <p className="text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Professional padel facility in Mauritius
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm bg-primary/10 text-primary px-4 py-2 rounded-full w-fit">
                <Users className="h-4 w-4" />
                {club.numberOfCourts} court{club.numberOfCourts !== 1 ? 's' : ''} available
              </div>
            </div>
          </div>
        </div>

        {/* Photo Gallery */}
        <div className="w-full">
          <PhotoGallery photos={photoGallery} venueName={club.name} />
        </div>

        <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-6">

          {/* Main Content */}
          <Card className="overflow-hidden">
            <CardContent className="p-4 md:p-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-3">About This Facility</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {club.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
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
                <div className="flex flex-col gap-3">
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