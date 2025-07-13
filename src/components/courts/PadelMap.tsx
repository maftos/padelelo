
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
    venues.forEach((venue) => {
      // Create simple marker element
      const markerElement = document.createElement('div');
      markerElement.className = 'custom-marker';
      markerElement.style.width = '30px';
      markerElement.style.height = '30px';
      markerElement.style.borderRadius = '50%';
      markerElement.style.backgroundColor = '#10b981';
      markerElement.style.border = '3px solid white';
      markerElement.style.cursor = 'pointer';
      markerElement.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
      markerElement.style.display = 'flex';
      markerElement.style.alignItems = 'center';
      markerElement.style.justifyContent = 'center';
      markerElement.style.color = 'white';
      markerElement.style.fontSize = '12px';
      markerElement.style.fontWeight = 'bold';
      markerElement.textContent = '🏓';

      // Create marker
      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat(venue.coordinates)
        .addTo(map.current!);

      // Add popup with venue info
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        closeOnClick: true
      }).setHTML(`
        <div class="p-2">
          <h3 class="font-semibold text-sm">${venue.name}</h3>
          <p class="text-xs text-gray-600">${venue.location}</p>
          ${venue.phone_number ? `<p class="text-xs">${venue.phone_number}</p>` : ''}
        </div>
      `);

      marker.setPopup(popup);

      // Add click event if callback is provided
      if (onVenueSelect) {
        markerElement.addEventListener('click', () => {
          onVenueSelect(venue);
          
          // Fly to location
          map.current?.flyTo({
            center: venue.coordinates,
            zoom: 13,
            duration: 1000
          });
        });
      }

      markers.current.push(marker);
    });
  };

  // Re-add markers when venues change
  useEffect(() => {
    if (map.current) {
      addMarkers();
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
