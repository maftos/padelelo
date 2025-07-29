
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { PadelClub } from '@/pages/PadelCourts';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Clock, X } from 'lucide-react';

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
        
        if (onClubSelect) {
          onClubSelect(club);
        }
        
        // Fly to location
        map.current?.flyTo({
          center: club.coordinates,
          zoom: 13,
          duration: 1000
        });
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

  return (
    <div className="relative w-full h-full">
      <div 
        ref={mapContainer} 
        className="absolute inset-0 rounded-lg"
        style={{ minHeight: '400px' }}
      />
      
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="absolute bottom-0 left-0 right-0 max-h-[60%] rounded-t-lg border-t">
          {selectedClub && (
            <>
              <DrawerHeader className="text-left">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <DrawerTitle className="text-xl font-bold">
                      {selectedClub.name}
                    </DrawerTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1">
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
                        <span className="text-sm text-muted-foreground ml-1">
                          {selectedClub.rating || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setDrawerOpen(false)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </DrawerHeader>

              <div className="px-4 pb-4 space-y-4">
                {selectedClub.image && (
                  <div className="aspect-video w-full overflow-hidden rounded-lg">
                    <img 
                      src={selectedClub.image} 
                      alt={selectedClub.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {selectedClub.numberOfCourts} court{selectedClub.numberOfCourts !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Open daily</span>
                  </div>
                </div>

                {selectedClub.address && (
                  <div>
                    <h4 className="font-medium mb-1">Address</h4>
                    <p className="text-sm text-muted-foreground">{selectedClub.address}</p>
                  </div>
                )}
              </div>

              <DrawerFooter className="pt-2">
                <Button 
                  className="w-full" 
                  onClick={() => {
                    window.location.href = `/padel-courts/${selectedClub.id}`;
                  }}
                >
                  View Full Details
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setDrawerOpen(false)}
                >
                  Close
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
};
