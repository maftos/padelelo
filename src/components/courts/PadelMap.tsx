
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Venue {
  venue_id: string;
  name: string;
  location: string;
  phone_number: string;
  opening_hours: string;
  website: string;
  coordinates: [number, number];
  region: string;
}

interface PadelMapProps {
  venues: Venue[];
  onVenueSelect?: (venue: Venue) => void;
}

// Mapbox public token
const MAPBOX_TOKEN = 'pk.eyJ1IjoibWFmbWFhZm1hYWFmIiwiYSI6ImNtY29wN3V2ZTBjOHMybXIyYTF6MzlqYm4ifQ.8ijZH3a-tm0juZeb_PW7ig';

export const PadelMap = ({ venues, onVenueSelect }: PadelMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

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
      maxZoom: 18
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

    console.log('Adding markers for venues:', venues);

    // Add new markers
    venues.forEach((venue, index) => {
      console.log(`Adding marker for ${venue.name} at coordinates:`, venue.coordinates);

      // Create custom marker element
      const markerElement = document.createElement('div');
      markerElement.className = 'custom-marker';
      markerElement.style.width = '32px';
      markerElement.style.height = '32px';
      markerElement.style.borderRadius = '50%';
      markerElement.style.backgroundColor = '#10b981';
      markerElement.style.border = '3px solid white';
      markerElement.style.cursor = 'pointer';
      markerElement.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
      markerElement.style.display = 'flex';
      markerElement.style.alignItems = 'center';
      markerElement.style.justifyContent = 'center';
      markerElement.style.color = 'white';
      markerElement.style.fontSize = '16px';
      markerElement.style.fontWeight = 'bold';
      markerElement.textContent = '🏓';

      // Add hover effect
      markerElement.addEventListener('mouseenter', () => {
        markerElement.style.transform = 'scale(1.1)';
        markerElement.style.backgroundColor = '#059669';
      });

      markerElement.addEventListener('mouseleave', () => {
        markerElement.style.transform = 'scale(1)';
        markerElement.style.backgroundColor = '#10b981';
      });

      // Create marker
      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat(venue.coordinates)
        .addTo(map.current!);

      // Create popup with venue info
      const popupContent = `
        <div class="p-3 min-w-[200px]">
          <h3 class="font-semibold text-base mb-2">${venue.name}</h3>
          <div class="space-y-1 text-sm">
            <div class="flex items-center gap-2">
              <span class="text-gray-500">📍</span>
              <span>${venue.location}</span>
            </div>
            ${venue.phone_number ? `
              <div class="flex items-center gap-2">
                <span class="text-gray-500">📞</span>
                <a href="tel:${venue.phone_number}" class="text-blue-600 hover:underline">${venue.phone_number}</a>
              </div>
            ` : ''}
            <div class="flex items-start gap-2">
              <span class="text-gray-500">🕒</span>
              <span class="text-xs">${venue.opening_hours}</span>
            </div>
            ${venue.website ? `
              <div class="flex items-center gap-2 pt-2">
                <a href="${venue.website}" target="_blank" rel="noopener noreferrer" 
                   class="text-blue-600 hover:underline text-sm font-medium">
                  Visit Website →
                </a>
              </div>
            ` : ''}
          </div>
        </div>
      `;

      const popup = new mapboxgl.Popup({
        offset: 35,
        closeButton: true,
        closeOnClick: false,
        maxWidth: '300px'
      }).setHTML(popupContent);

      marker.setPopup(popup);

      // Add click event if callback is provided
      if (onVenueSelect) {
        markerElement.addEventListener('click', () => {
          onVenueSelect(venue);
          
          // Fly to location
          map.current?.flyTo({
            center: venue.coordinates,
            zoom: 14,
            duration: 1000
          });
        });
      }

      markers.current.push(marker);
    });

    // Fit map to show all markers if there are venues
    if (venues.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      venues.forEach(venue => {
        bounds.extend(venue.coordinates);
      });
      
      // Add some padding to the bounds
      map.current?.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        maxZoom: 15
      });
    }
  };

  // Re-add markers when venues change
  useEffect(() => {
    if (map.current && venues) {
      // Wait a bit for map to be ready
      const timer = setTimeout(() => {
        addMarkers();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [venues, onVenueSelect]);

  return (
    <div className="relative w-full h-full">
      <div 
        ref={mapContainer} 
        className="absolute inset-0 rounded-lg"
        style={{ minHeight: '400px' }}
      />
    </div>
  );
};
