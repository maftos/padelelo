
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { LocateFixed } from 'lucide-react';
import { PadelClub } from '@/pages/PadelCourts';

// Custom styles to override Mapbox's default popup styling
const mapboxPopupStyles = `
  .mapboxgl-popup-content {
    background: transparent !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    padding: 0 !important;
    max-width: none !important;
  }
  
  .mapboxgl-popup-tip {
    border-top-color: hsl(var(--card)) !important;
    border-bottom-color: hsl(var(--card)) !important;
  }
  
  .mapboxgl-popup {
    z-index: 1000 !important;
  }
  
  .mapboxgl-popup-close-button {
    display: none !important;
  }
`;

interface PadelMapProps {
  clubs: PadelClub[];
  selectedClubId?: string | null;
  onClubSelect?: (club: PadelClub) => void;
  onUserLocation?: (coords: { latitude: number; longitude: number }) => void;
  userLocation?: { longitude: number; latitude: number } | null;
}

// Mapbox public token
const MAPBOX_TOKEN = 'pk.eyJ1IjoibWFmbWFhZm1hYWFmIiwiYSI6ImNtY29wN3V2ZTBjOHMybXIyYTF6MzlqYm4ifQ.8ijZH3a-tm0juZeb_PW7ig';

export const PadelMap = ({ clubs, selectedClubId, onClubSelect, onUserLocation, userLocation }: PadelMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const markersMap = useRef<Record<string, { marker: mapboxgl.Marker; el: HTMLDivElement }>>({});
  const geolocateControl = useRef<mapboxgl.GeolocateControl | null>(null);
  const geoFiredRef = useRef(false);
  const userMarker = useRef<mapboxgl.Marker | null>(null);
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



    // Add markers when map loads
    map.current.on('load', () => {
      addMarkers();
      addUserLocationMarker();

      // Fit bounds to all clubs and user location if available
      if (clubs.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        clubs.forEach((c) => bounds.extend(c.coordinates as [number, number]));
        
        // Include user location in bounds if available
        if (userLocation) {
          bounds.extend([userLocation.longitude, userLocation.latitude]);
        }
        
        map.current?.fitBounds(bounds, { padding: 60, animate: true, duration: 800 });
      } else if (userLocation) {
        // If no clubs but have user location, center on user
        map.current?.flyTo({
          center: [userLocation.longitude, userLocation.latitude],
          zoom: 12,
          duration: 800
        });
      }
    });

    return () => {
      // Clean up
      markers.current.forEach(marker => marker.remove());
      userMarker.current?.remove();
      map.current?.remove();
    };
  }, []);

  const addMarkers = () => {
    if (!map.current) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
    markersMap.current = {};

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

      // track in map for selection styling
      markersMap.current[club.id] = { marker, el: markerElement };

      // selected styling
      if (selectedClubId === club.id) {
        markerElement.style.transform = 'scale(1.15)';
        markerElement.style.boxShadow = '0 0 0 3px hsl(var(--primary)), 0 6px 14px rgba(0,0,0,0.3)';
      }

      // Add popup with club info
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        closeOnClick: true,
        maxWidth: '300px'
      }).setHTML(`
        <div class="bg-card border border-border rounded-lg overflow-hidden shadow-xl">
          <div class="flex">
            ${club.image ? `
              <div class="w-20 h-16 bg-cover bg-center flex-shrink-0" style="background-image: url('${club.image}')"></div>
            ` : `
              <div class="w-20 h-16 bg-muted flex items-center justify-center flex-shrink-0">
                <span class="text-lg">🏓</span>
              </div>
            `}
            <div class="flex-1 p-3 min-w-0">
              <h3 class="font-semibold text-sm text-card-foreground truncate mb-1">${club.name}</h3>
              <div class="flex items-center gap-1 mb-1">
                ${Array.from({length: 5}, (_, i) => 
                  i < Math.floor(club.rating || 0) 
                    ? '<span class="text-yellow-400 text-xs leading-none">★</span>' 
                    : '<span class="text-muted-foreground text-xs leading-none">☆</span>'
                ).join('')}
                <span class="text-xs text-muted-foreground ml-1">${club.rating || 'N/A'}</span>
              </div>
              <p class="text-xs text-muted-foreground mb-2">
                ${club.numberOfCourts} court${club.numberOfCourts !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      `);

      marker.setPopup(popup);

      // Add click event if callback is provided
      if (onClubSelect) {
        markerElement.addEventListener('click', () => {
          onClubSelect(club);
          
          // Fly to location and open popup
          map.current?.flyTo({
            center: club.coordinates,
            zoom: 13,
            duration: 1000
          });
          
          // Open popup after a short delay to ensure map has moved
          setTimeout(() => {
            popup.setLngLat(club.coordinates as [number, number]).addTo(map.current!);
          }, 500);
        });
      }

      markers.current.push(marker);
    });
  };

  const addUserLocationMarker = () => {
    if (!map.current || !userLocation) return;

    // Remove existing user marker
    userMarker.current?.remove();

    // Create user location marker
    const userElement = document.createElement('div');
    userElement.className = 'user-location-marker';
    userElement.style.width = '20px';
    userElement.style.height = '20px';
    userElement.style.borderRadius = '50%';
    userElement.style.backgroundColor = '#3b82f6';
    userElement.style.border = '3px solid white';
    userElement.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
    userElement.style.cursor = 'default';

    userMarker.current = new mapboxgl.Marker(userElement)
      .setLngLat([userLocation.longitude, userLocation.latitude])
      .addTo(map.current);

    // Add popup for user location
    const userPopup = new mapboxgl.Popup({
      offset: 15,
      closeButton: false,
      closeOnClick: true
    }).setHTML(`
      <div class="bg-card border border-border rounded-lg p-2 shadow-xl">
        <p class="text-xs text-card-foreground font-medium">Your Location</p>
      </div>
    `);

    userMarker.current.setPopup(userPopup);
  };

  // Re-add markers when clubs change
  useEffect(() => {
    if (map.current) {
      addMarkers();
      addUserLocationMarker();
    }
  }, [clubs, onClubSelect, selectedClubId, userLocation]);

  // Update selection styling and fly to
  useEffect(() => {
    if (!map.current) return;

    // reset all markers
    Object.values(markersMap.current).forEach(({ el }) => {
      el.style.transform = 'scale(1)';
      el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
    });

    if (!selectedClubId) return;

    const sel = markersMap.current[selectedClubId];
    const club = clubs.find((c) => c.id === selectedClubId);
    if (sel && club) {
      sel.el.style.transform = 'scale(1.15)';
      sel.el.style.boxShadow = '0 0 0 3px hsl(var(--primary)), 0 6px 14px rgba(0,0,0,0.3)';
      map.current.flyTo({ center: club.coordinates, zoom: 13, duration: 800 });

      // Open the popup for the selected marker programmatically
      const popup = (sel.marker as any).getPopup ? (sel.marker as any).getPopup() : null;
      if (popup && map.current) {
        popup.setLngLat(club.coordinates as [number, number]).addTo(map.current);
      }
    }
  }, [selectedClubId, clubs]);

  // Resize observer to keep map responsive in resizable panels
  useEffect(() => {
    if (!mapContainer.current || !map.current) return;
    const ro = new ResizeObserver(() => {
      map.current?.resize();
    });
    ro.observe(mapContainer.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="relative w-full h-full">
      <style dangerouslySetInnerHTML={{ __html: mapboxPopupStyles }} />
      <div 
        ref={mapContainer} 
        className="absolute inset-0 rounded-lg"
        style={{ minHeight: '400px' }}
      />
    </div>
  );
};
