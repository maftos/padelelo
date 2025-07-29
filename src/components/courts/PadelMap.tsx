
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { PadelClub } from '@/pages/PadelCourts';

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

      // Add popup with club info
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        closeOnClick: true,
        maxWidth: '320px'
      }).setHTML(`
        <div class="bg-card border border-border rounded-lg overflow-hidden shadow-lg">
          <div class="flex h-20">
            ${club.image ? `
              <div class="w-24 h-20 bg-cover bg-center flex-shrink-0" style="background-image: url('${club.image}')"></div>
            ` : `
              <div class="w-24 h-20 bg-muted flex items-center justify-center flex-shrink-0">
                <span class="text-2xl">🏓</span>
              </div>
            `}
            <div class="flex-1 p-3 flex flex-col justify-between">
              <div>
                <h3 class="font-semibold text-sm text-card-foreground mb-1">${club.name}</h3>
                <div class="flex items-center gap-1 mb-1">
                  ${Array.from({length: 5}, (_, i) => 
                    i < Math.floor(club.rating || 0) 
                      ? '<span class="text-yellow-400 text-xs">★</span>' 
                      : '<span class="text-muted-foreground text-xs">☆</span>'
                  ).join('')}
                  <span class="ml-1 text-xs text-muted-foreground">${club.rating || 'N/A'}</span>
                </div>
                <p class="text-xs text-muted-foreground">
                  ${club.numberOfCourts} court${club.numberOfCourts !== 1 ? 's' : ''}
                </p>
              </div>
              <a href="/padel-courts/${club.id}" 
                 class="inline-block text-center bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium hover:bg-primary/90 transition-colors mt-1">
                View Details
              </a>
            </div>
          </div>
        </div>
      `);

      marker.setPopup(popup);

      // Add click event if callback is provided
      if (onClubSelect) {
        markerElement.addEventListener('click', () => {
          onClubSelect(club);
          
          // Fly to location
          map.current?.flyTo({
            center: club.coordinates,
            zoom: 13,
            duration: 1000
          });
        });
      }

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
    </div>
  );
};
