import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { PadelClub } from '@/pages/PadelCourts';

interface PadelMapProps {
  clubs: PadelClub[];
  onClubSelect: (club: PadelClub) => void;
}

// Mapbox public token (safe to store in client-side code)
const MAPBOX_TOKEN = 'pk.eyJ1IjoibWFmbWFhZm1hYWFmIiwiYSI6ImNtY29wN3V2ZTBjOHMybXIyYTF6MzlqYm4ifQ.8ijZH3a-tm0juZeb_PW7ig';

export const PadelMap = ({ clubs, onClubSelect }: PadelMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  const initializeMap = () => {
    if (!mapContainer.current) {
      console.error('Map container not found');
      return;
    }

    console.log('Initializing map with token:', MAPBOX_TOKEN.substring(0, 20) + '...');
    
    try {
      mapboxgl.accessToken = MAPBOX_TOKEN;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-v9',
        center: [57.5522, -20.3484], // Center of Mauritius
        zoom: 10,
        pitch: 45,
        bearing: 0
      });

      console.log('Map instance created successfully');

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );

      // Add scale control
      map.current.addControl(new mapboxgl.ScaleControl(), 'bottom-left');

      map.current.on('load', () => {
        console.log('Map loaded successfully');
        addClubMarkers();
      });

      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
      });

    } catch (error) {
      console.error('Error initializing map:', error);
    }
  };

  const addClubMarkers = () => {
    if (!map.current) {
      console.error('Map not available for adding markers');
      return;
    }

    console.log('Adding markers for', clubs.length, 'clubs');

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    clubs.forEach((club) => {
      // Create custom marker element
      const markerElement = document.createElement('div');
      markerElement.className = 'custom-marker';
      markerElement.style.cssText = `
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: hsl(var(--primary));
        border: 3px solid white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        transition: transform 0.2s ease;
      `;
      
      // Add tennis/padel icon
      markerElement.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      `;

      // Add hover effect
      markerElement.addEventListener('mouseenter', () => {
        markerElement.style.transform = 'scale(1.1)';
      });
      markerElement.addEventListener('mouseleave', () => {
        markerElement.style.transform = 'scale(1)';
      });

      // Create marker
      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat(club.coordinates)
        .addTo(map.current!);

      // Create popup
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        className: 'custom-popup'
      }).setHTML(`
        <div style="padding: 8px; min-width: 200px;">
          <h3 style="margin: 0 0 4px 0; font-weight: 600; color: hsl(var(--foreground));">${club.name}</h3>
          <p style="margin: 0 0 4px 0; font-size: 12px; color: hsl(var(--muted-foreground));">${club.address}</p>
          <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 4px;">
            <span style="color: #fbbf24;">★</span>
            <span style="font-size: 12px; color: hsl(var(--foreground));">${club.rating}</span>
            <span style="font-size: 12px; color: hsl(var(--muted-foreground));">• ${club.numberOfCourts} courts</span>
          </div>
          <p style="margin: 0; font-size: 11px; color: hsl(var(--muted-foreground));">Click marker for details</p>
        </div>
      `);

      // Add click event
      markerElement.addEventListener('click', () => {
        onClubSelect(club);
        
        // Center map on selected marker
        map.current?.flyTo({
          center: club.coordinates,
          zoom: 14,
          essential: true
        });
      });

      // Show popup on hover
      marker.getElement().addEventListener('mouseenter', () => {
        popup.addTo(map.current!);
        marker.setPopup(popup);
      });

      marker.getElement().addEventListener('mouseleave', () => {
        popup.remove();
      });

      markers.current.push(marker);
    });
  };

  useEffect(() => {
    initializeMap();
    
    return () => {
      markers.current.forEach(marker => marker.remove());
      map.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (map.current) {
      addClubMarkers();
    }
  }, [clubs]);

  return (
    <div className="relative w-full h-full">
      <div 
        ref={mapContainer} 
        className="absolute inset-0 rounded-lg"
        style={{ minHeight: '400px' }}
      />
      <style>{`
        .mapboxgl-canvas {
          outline: none;
        }
        .custom-popup .mapboxgl-popup-content {
          background: hsl(var(--card));
          border: 1px solid hsl(var(--border));
          border-radius: 8px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        .custom-popup .mapboxgl-popup-tip {
          border-top-color: hsl(var(--card));
        }
      `}</style>
    </div>
  );
};