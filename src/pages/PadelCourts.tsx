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

// Sample data for Mauritius padel clubs
const sampleClubs: PadelClub[] = [
  {
    id: "1",
    name: "Heritage Golf & Spa Resort",
    address: "Bel Ombre, Mauritius",
    coordinates: [57.3923, -20.5058],
    phone: "+230 601 1500",
    email: "info@heritageresorts.mu",
    website: "https://heritageresorts.mu",
    rating: 4.8,
    numberOfCourts: 2,
    openingHours: "6:00 AM - 10:00 PM",
    description: "Premium padel courts in a luxury resort setting with stunning views of the Indian Ocean.",
    amenities: ["Pro Shop", "Coaching", "Equipment Rental", "Restaurant", "Spa"],
    priceRange: "Premium (Rs 1500-2000/hour)"
  },
  {
    id: "2",
    name: "Four Seasons Resort Mauritius",
    address: "Anahita Golf & Spa Resort, Beau Champ",
    coordinates: [57.7833, -20.2667],
    phone: "+230 402 3100",
    email: "anahita.reception@fourseasons.com",
    rating: 4.9,
    numberOfCourts: 2,
    openingHours: "7:00 AM - 9:00 PM",
    description: "World-class padel facilities at the prestigious Four Seasons resort.",
    amenities: ["Professional Coaching", "Equipment Rental", "Lounge", "Beach Access"],
    priceRange: "Premium (Rs 1800-2500/hour)"
  },
  {
    id: "3",
    name: "Tamarina Golf Club",
    address: "Tamarin Bay, Mauritius",
    coordinates: [57.3667, -20.3167],
    phone: "+230 401 3003",
    email: "info@tamarina.mu",
    rating: 4.6,
    numberOfCourts: 3,
    openingHours: "6:30 AM - 8:30 PM",
    description: "Scenic padel courts with mountain and ocean views at this championship golf course.",
    amenities: ["Coaching", "Equipment Rental", "Restaurant", "Golf Course Access"],
    priceRange: "High-end (Rs 1200-1800/hour)"
  },
  {
    id: "4",
    name: "Le Touessrok Resort",
    address: "Trou d'Eau Douce, Mauritius",
    coordinates: [57.8833, -20.2333],
    phone: "+230 402 7400",
    email: "reservations@touessrok.com",
    rating: 4.7,
    numberOfCourts: 2,
    openingHours: "7:00 AM - 9:00 PM",
    description: "Exclusive padel courts on the pristine east coast of Mauritius.",
    amenities: ["Pro Shop", "Coaching", "Equipment Rental", "Beach Club"],
    priceRange: "Premium (Rs 1600-2200/hour)"
  },
  {
    id: "5",
    name: "Mont Choisy Beach Resort",
    address: "Trou aux Biches, Mauritius",
    coordinates: [57.5500, -20.0333],
    phone: "+230 204 5000",
    email: "info@montchoisy.com",
    rating: 4.4,
    numberOfCourts: 2,
    openingHours: "6:00 AM - 10:00 PM",
    description: "Beachfront padel courts with easy access to one of Mauritius' most beautiful beaches.",
    amenities: ["Equipment Rental", "Beach Access", "Restaurant", "Water Sports"],
    priceRange: "Mid-range (Rs 800-1200/hour)"
  },
  {
    id: "6",
    name: "Paradis Beachcomber Resort",
    address: "Le Morne Peninsula, Mauritius",
    coordinates: [57.3167, -20.4833],
    phone: "+230 401 5050",
    email: "paradis@beachcomber.com",
    rating: 4.5,
    numberOfCourts: 2,
    openingHours: "7:00 AM - 8:00 PM",
    description: "Padel courts with breathtaking views of Le Morne Brabant mountain.",
    amenities: ["Coaching", "Equipment Rental", "Spa", "Multiple Restaurants"],
    priceRange: "Premium (Rs 1400-2000/hour)"
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
            <Card className="h-[600px]">
              <CardHeader>
                <CardTitle>Interactive Map</CardTitle>
                <CardDescription>
                  Click on any marker to view club details
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 h-[520px]">
                <PadelMap clubs={sampleClubs} onClubSelect={setSelectedClub} />
              </CardContent>
            </Card>
          </div>

          {/* Club Details Section */}
          <div className="lg:col-span-1">
            {selectedClub ? (
              <Card className="h-[600px] overflow-y-auto">
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
              <Card className="h-[600px] flex items-center justify-center">
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