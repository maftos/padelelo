
import React, { useState } from "react";
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

// Updated diverse padel clubs across Mauritius
const sampleClubs: PadelClub[] = [
  {
    id: "1",
    name: "Grand Baie Padel Center",
    address: "Royal Road, Grand Baie, Mauritius",
    coordinates: [57.5808, -20.0103],
    phone: "+230 263 8754",
    email: "info@grandbaiepadel.mu",
    website: "https://grandbaiepadel.mu",
    rating: 4.5,
    numberOfCourts: 4,
    openingHours: "6:00 AM - 10:00 PM",
    description: "Modern padel center in the heart of Grand Baie with professional coaching and equipment rental.",
    amenities: ["Professional Coaching", "Equipment Rental", "Pro Shop", "Changing Rooms", "Parking"],
    priceRange: "Mid-range (Rs 900-1300/hour)"
  },
  {
    id: "2",
    name: "Curepipe Multi-Sports Center",
    address: "Elizabeth Avenue, Curepipe, Mauritius",
    coordinates: [57.5167, -20.3167],
    phone: "+230 674 2891",
    email: "sports@curepipecenter.mu",
    rating: 4.2,
    numberOfCourts: 3,
    openingHours: "5:30 AM - 9:30 PM",
    description: "Community sports center offering affordable padel courts in the central highlands.",
    amenities: ["Equipment Rental", "Coaching", "Cafeteria", "Locker Rooms", "Free Parking"],
    priceRange: "Affordable (Rs 500-700/hour)"
  },
  {
    id: "3",
    name: "Flic en Flac Beach Club",
    address: "Coastal Road, Flic en Flac, Mauritius",
    coordinates: [57.3667, -20.2833],
    phone: "+230 453 9876",
    email: "padel@flicbeachclub.mu",
    website: "https://flicbeachclub.mu",
    rating: 4.7,
    numberOfCourts: 5,
    openingHours: "6:30 AM - 9:30 PM",
    description: "Beachfront padel courts with stunning sunset views and premium facilities.",
    amenities: ["Beach Access", "Restaurant", "Bar", "Equipment Rental", "Coaching", "Pool"],
    priceRange: "Premium (Rs 1400-1800/hour)"
  },
  {
    id: "4",
    name: "Mahébourg Community Center",
    address: "SSR Street, Mahébourg, Mauritius",
    coordinates: [57.7000, -20.4083],
    phone: "+230 631 5432",
    email: "community@mahebourg.mu",
    rating: 4.0,
    numberOfCourts: 2,
    openingHours: "6:00 AM - 8:00 PM",
    description: "Local community center offering accessible padel courts for residents and visitors.",
    amenities: ["Equipment Rental", "Basic Coaching", "Parking", "Changing Rooms"],
    priceRange: "Affordable (Rs 400-600/hour)"
  },
  {
    id: "5",
    name: "Pereybere Sports Complex",
    address: "Pereybere Public Beach Road, Pereybere, Mauritius",
    coordinates: [57.5833, -19.9833],
    phone: "+230 268 7654",
    email: "info@pereyberepadel.mu",
    rating: 4.4,
    numberOfCourts: 3,
    openingHours: "6:00 AM - 9:00 PM",
    description: "Modern sports complex near the beach with well-maintained padel courts.",
    amenities: ["Equipment Rental", "Coaching", "Beach Access", "Restaurant", "Shower Facilities"],
    priceRange: "Mid-range (Rs 800-1100/hour)"
  },
  {
    id: "6",
    name: "Souillac Padel Club",
    address: "B9 Road, Souillac, Mauritius",
    coordinates: [57.5167, -20.5167],
    phone: "+230 625 3456",
    email: "club@souillacpadel.mu",
    rating: 4.3,
    numberOfCourts: 2,
    openingHours: "6:30 AM - 8:30 PM",
    description: "Intimate padel club in the scenic south coast with personalized service.",
    amenities: ["Equipment Rental", "Private Coaching", "Refreshments", "Parking"],
    priceRange: "Mid-range (Rs 750-1000/hour)"
  },
  {
    id: "7",
    name: "Centre de Flacq Sports Hub",
    address: "Royal Road, Centre de Flacq, Mauritius",
    coordinates: [57.7167, -20.2000],
    phone: "+230 413 8901",
    email: "hub@flacqsports.mu",
    rating: 4.1,
    numberOfCourts: 4,
    openingHours: "5:45 AM - 9:15 PM",
    description: "Regional sports hub serving the east coast with quality padel facilities.",
    amenities: ["Equipment Rental", "Group Coaching", "Pro Shop", "Cafeteria", "Ample Parking"],
    priceRange: "Mid-range (Rs 850-1200/hour)"
  },
  {
    id: "8",
    name: "Albion Sports Complex",
    address: "Albion Fisheries Road, Albion, Mauritius",
    coordinates: [57.4000, -20.2333],
    phone: "+230 238 6789",
    email: "sports@albioncomplex.mu",
    rating: 4.2,
    numberOfCourts: 3,
    openingHours: "6:00 AM - 9:00 PM",
    description: "Community-focused sports complex with affordable padel courts and family-friendly atmosphere.",
    amenities: ["Equipment Rental", "Basic Coaching", "Kids Area", "Snack Bar", "Free Parking"],
    priceRange: "Affordable (Rs 600-800/hour)"
  },
  {
    id: "9",
    name: "Cap Malheureux Padel Club",
    address: "Cap Malheureux Road, Cap Malheureux, Mauritius",
    coordinates: [57.6167, -19.9667],
    phone: "+230 262 4567",
    email: "info@capmalheureux-padel.mu",
    website: "https://capmalheureux-padel.mu",
    rating: 4.6,
    numberOfCourts: 6,
    openingHours: "6:30 AM - 10:00 PM",
    description: "Premium padel club at the northern tip of Mauritius with panoramic ocean views.",
    amenities: ["Professional Coaching", "Equipment Rental", "Restaurant", "Pro Shop", "Event Hosting"],
    priceRange: "Premium (Rs 1300-1700/hour)"
  },
  {
    id: "10",
    name: "Rivière des Anguilles Sports Center",
    address: "Main Road, Rivière des Anguilles, Mauritius",
    coordinates: [57.5500, -20.4500],
    phone: "+230 627 9012",
    email: "center@rdasports.mu",
    rating: 3.9,
    numberOfCourts: 1,
    openingHours: "6:00 AM - 7:30 PM",
    description: "Small local sports center providing basic padel facilities for the southern community.",
    amenities: ["Equipment Rental", "Basic Coaching", "Parking", "Refreshments"],
    priceRange: "Affordable (Rs 450-650/hour)"
  }
];

const PadelCourts = () => {
  const [selectedClub, setSelectedClub] = useState<PadelClub | null>(null);

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
                <PadelMap clubs={sampleClubs} onClubSelect={setSelectedClub} />
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
