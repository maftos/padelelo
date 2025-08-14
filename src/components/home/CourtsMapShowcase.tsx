import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Mapbox public token (reusing from PadelMap)
const MAPBOX_TOKEN = 'pk.eyJ1IjoibWFmbWFhZm1hYWFmIiwiYSI6ImNtY29wN3V2ZTBjOHMybXIyYTF6MzlqYm4ifQ.8ijZH3a-tm0juZeb_PW7ig';

// Sample court locations across Mauritius
const sampleCourts = [
  { id: '1', name: 'Elite Padel Courts', coordinates: [57.4834, -20.2344] }, // Ebène
  { id: '2', name: 'Port Louis Sports', coordinates: [57.5017, -20.1619] }, // Port Louis
  { id: '3', name: 'Grand Baie Club', coordinates: [57.5835, -20.0267] }, // Grand Baie
  { id: '4', name: 'Flic en Flac Courts', coordinates: [57.3665, -20.2750] }, // Flic en Flac
  { id: '5', name: 'Tamarin Sports Center', coordinates: [57.3707, -20.3250] }, // Tamarin
  { id: '6', name: 'Quatre Bornes Club', coordinates: [57.4797, -20.2654] }, // Quatre Bornes
  { id: '7', name: 'Belle Mare Resort', coordinates: [57.7477, -20.2019] }, // Belle Mare
  { id: '8', name: 'Mahebourg Courts', coordinates: [57.7000, -20.4081] }, // Mahebourg
];

export const CourtsMapShowcase = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Set access token
    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11', // Light style for better contrast
      center: [57.5522, -20.3484], // Center of Mauritius
      zoom: 9.5,
      interactive: false, // Disable interactions for showcase
      attributionControl: false, // Remove attribution for cleaner look
    });

    // Add markers when map loads
    map.current.on('load', () => {
      // Add markers for each court
      sampleCourts.forEach((court) => {
        // Create marker element
        const markerElement = document.createElement('div');
        markerElement.className = 'showcase-marker';
        markerElement.style.width = '24px';
        markerElement.style.height = '24px';
        markerElement.style.borderRadius = '50%';
        markerElement.style.backgroundColor = 'hsl(var(--primary))';
        markerElement.style.border = '2px solid white';
        markerElement.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
        markerElement.style.display = 'flex';
        markerElement.style.alignItems = 'center';
        markerElement.style.justifyContent = 'center';
        markerElement.style.color = 'white';
        markerElement.style.fontSize = '10px';
        markerElement.style.fontWeight = 'bold';
        markerElement.textContent = '🏓';

        // Add hover effect
        markerElement.style.transition = 'transform 0.2s ease';
        markerElement.addEventListener('mouseenter', () => {
          markerElement.style.transform = 'scale(1.2)';
        });
        markerElement.addEventListener('mouseleave', () => {
          markerElement.style.transform = 'scale(1)';
        });

        // Create marker
        new mapboxgl.Marker(markerElement)
          .setLngLat(court.coordinates as [number, number])
          .addTo(map.current!);
      });

      // Fit bounds to show all courts
      const bounds = new mapboxgl.LngLatBounds();
      sampleCourts.forEach((court) => {
        bounds.extend(court.coordinates as [number, number]);
      });
      map.current?.fitBounds(bounds, { 
        padding: 40,
        animate: false 
      });
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden">
      <div 
        ref={mapContainer} 
        className="absolute inset-0"
        style={{ minHeight: '280px' }}
      />
      
      {/* Overlay with court count */}
      <div className="absolute top-3 left-3">
        <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium shadow-lg">
          8+ Courts
        </div>
      </div>
      
      {/* Bottom overlay with action hint */}
      <div className="absolute bottom-3 right-3">
        <div className="bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 border shadow-lg">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <span className="text-muted-foreground">Click to explore</span>
          </div>
        </div>
      </div>
    </div>
  );
};