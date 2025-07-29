
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { PadelClub } from '@/pages/PadelCourts';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Clock, Phone, X } from 'lucide-react';

interface PadelMapProps {
  clubs: PadelClub[];
  onClubSelect?: (club: PadelClub) => void;
}

// Mapbox public token
const MAPBOX_TOKEN = 'pk.eyJ1IjoibWFmbWFhZm1hYWFmIiwiYSI6ImNtY29wN3V2ZTBjOHMybXIyYTF6MzlqYm4ifQ.8ijZH3a-tm0juZeb_PW7ig';

export const PadelMap = ({ clubs, onClubSelect }: PadelMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [selectedClub, setSelectedClub] = useState<PadelClub | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Set access token
    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [57.5522, -20.3484], // Center of Mauritius
      zoom: 10,
      minZoom: 9,
      maxZoom: 16
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add markers when map loads
    map.current.on('load', () => {
      addMarkers();
    });

    return () => {
      // Clean up
      markers.current.forEach(marker => marker.remove());
      map.current?.remove();
    };
  }, []);

  const addMarkers = () => {
    if (!map.current) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add new markers
    clubs.forEach((club) => {
      // Create simple marker element
      const markerElement = document.createElement('div');
      markerElement.className = 'custom-marker';
      markerElement.style.width = '30px';
      markerElement.style.height = '30px';
      markerElement.style.borderRadius = '50%';
      markerElement.style.border = '3px solid white';
      markerElement.style.cursor = 'pointer';
      markerElement.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
      markerElement.style.display = 'flex';
      markerElement.style.alignItems = 'center';
      markerElement.style.justifyContent = 'center';
      markerElement.style.color = 'white';
      markerElement.style.fontSize = '12px';
      markerElement.style.fontWeight = 'bold';
      
      // Use venue photo as background or fallback to emoji
      if (club.image && !club.image.includes('unsplash.com')) {
        markerElement.style.backgroundImage = `url(${club.image})`;
        markerElement.style.backgroundSize = 'cover';
        markerElement.style.backgroundPosition = 'center';
        markerElement.style.backgroundColor = 'transparent';
        
        // Add error handling for failed image loads
        const img = new Image();
        img.onload = () => {
          // Image loaded successfully, keep the background image
        };
        img.onerror = () => {
          // Image failed to load, fallback to emoji
          markerElement.style.backgroundImage = 'none';
          markerElement.style.backgroundColor = '#10b981';
          markerElement.textContent = '🏓';
        };
        img.src = club.image;
      } else {
        // No image or using fallback image, use emoji
        markerElement.style.backgroundColor = '#10b981';
        markerElement.textContent = '🏓';
      }

      // Create marker
      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat(club.coordinates)
        .addTo(map.current!);

      // Add click event to open drawer
      markerElement.addEventListener('click', () => {
        setSelectedClub(club);
        setDrawerOpen(true);
        
        // Visual feedback - highlight selected marker
        markers.current.forEach(m => {
          const el = m.getElement();
          el.style.transform = 'scale(1)';
          el.style.zIndex = '1';
        });
        markerElement.style.transform = 'scale(1.2)';
        markerElement.style.zIndex = '10';
        
        // Fly to location
        map.current?.flyTo({
          center: club.coordinates,
          zoom: 13,
          duration: 1000
        });
        
        // Call onClubSelect if provided
        if (onClubSelect) {
          onClubSelect(club);
        }
      });

      markers.current.push(marker);
    });
  };

  // Re-add markers when clubs change
  useEffect(() => {
    if (map.current) {
      addMarkers();
    }
  }, [clubs, onClubSelect]);

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    // Reset marker scales when drawer closes
    markers.current.forEach(m => {
      const el = m.getElement();
      el.style.transform = 'scale(1)';
      el.style.zIndex = '1';
    });
  };

  return (
    <div className="relative w-full h-full">
      <div 
        ref={mapContainer} 
        className="absolute inset-0 rounded-lg"
        style={{ minHeight: '400px' }}
      />
      
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="max-h-[80vh]">
          <DrawerHeader className="relative">
            <DrawerClose asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute right-4 top-4 p-2"
                onClick={handleDrawerClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
            
            {selectedClub && (
              <div className="pr-12">
                <DrawerTitle className="text-left text-lg font-semibold mb-2">
                  {selectedClub.name}
                </DrawerTitle>
                
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center">
                    {Array.from({length: 5}, (_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${
                          i < Math.floor(selectedClub.rating || 0)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-muted-foreground'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-muted-foreground ml-2">
                      {selectedClub.rating || 'N/A'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{selectedClub.numberOfCourts} court{selectedClub.numberOfCourts !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>
            )}
          </DrawerHeader>
          
          {selectedClub && (
            <div className="px-4 pb-6 space-y-4">
              {/* Hero Image */}
              {selectedClub.image && (
                <div className="w-full h-48 rounded-lg overflow-hidden bg-muted">
                  <img 
                    src={selectedClub.image} 
                    alt={selectedClub.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
              
              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Open daily 8AM-10PM</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>Call for bookings</span>
                </div>
              </div>
              
              {/* Description */}
              <div>
                <p className="text-sm text-muted-foreground">
                  Professional padel facility with modern courts and equipment. 
                  Perfect for players of all skill levels.
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button 
                  asChild 
                  className="flex-1"
                >
                  <a href={`/padel-courts/${selectedClub.id}`}>
                    View Full Details
                  </a>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    // Get directions - could integrate with maps app
                    const [lng, lat] = selectedClub.coordinates;
                    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
                  }}
                >
                  Get Directions
                </Button>
              </div>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
};
