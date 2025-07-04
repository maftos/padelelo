
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { PadelClub } from '@/pages/PadelCourts';

interface PadelMapProps {
  clubs: PadelClub[];
  onClubSelect: (club: PadelClub) => void;
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
        .setLngLat(club.coordinates)
        .addTo(map.current!);

      // Create popup
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false
      }).setHTML(`
        <div style="padding: 10px; min-width: 200px;">
          <h3 style="margin: 0 0 5px 0; font-weight: bold;">${club.name}</h3>
          <p style="margin: 0 0 5px 0; font-size: 12px; color: #666;">${club.address}</p>
          <div style="display: flex; align-items: center; gap: 5px;">
            <span style="color: #fbbf24;">★</span>
            <span style="font-size: 12px;">${club.rating}</span>
            <span style="font-size: 12px; color: #666;">• ${club.numberOfCourts} courts</span>
          </div>
        </div>
      `);

      // Add click event
      markerElement.addEventListener('click', () => {
        onClubSelect(club);
        
        // Fly to location
        map.current?.flyTo({
          center: club.coordinates,
          zoom: 13,
          duration: 1000
        });
      });

      // Add hover events
      markerElement.addEventListener('mouseenter', () => {
        markerElement.style.backgroundColor = '#059669';
        markerElement.style.transform = 'scale(1.1)';
        popup.setLngLat(club.coordinates).addTo(map.current!);
      });

      markerElement.addEventListener('mouseleave', () => {
        markerElement.style.backgroundColor = '#10b981';
        markerElement.style.transform = 'scale(1)';
        popup.remove();
      });

      markers.current.push(marker);
    });
  };

  // Re-add markers when clubs change
  useEffect(() => {
    if (map.current) {
      addMarkers();
    }
  }, [clubs]);

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
