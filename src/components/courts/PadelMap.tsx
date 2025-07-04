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
        style: 'mapbox://styles/mapbox/light-v11', // Simple 2D light style
        center: [57.5522, -20.3484], // Center of Mauritius
        zoom: 10,
        minZoom: 9, // Prevent zooming out too far from Mauritius
        maxZoom: 16, // Allow detailed zoom for club locations
        pitch: 0, // Keep it flat (2D)
        bearing: 0
      });

      console.log('Map instance created successfully');

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: false, // Disable pitch control for 2D experience
        }),
        'top-right'
      );

      // Add scale control
      map.current.addControl(new mapboxgl.ScaleControl(), 'bottom-left');

      // Restrict map bounds to Mauritius area
      const mauritiusBounds = new mapboxgl.LngLatBounds(
        [57.0, -20.8], // Southwest coordinates
        [58.0, -19.8]  // Northeast coordinates
      );
      map.current.setMaxBounds(mauritiusBounds);

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

    clubs.forEach((club, index) => {
      // Create custom marker element with proper padel court images
      const markerElement = document.createElement('div');
      markerElement.className = 'custom-marker';
      markerElement.style.cssText = `
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: 3px solid #10b981;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        transition: all 0.2s ease;
        overflow: hidden;
        background: white;
        position: relative;
      `;
      
      // Use different padel court images for variety
      const padelImages = [
        'https://images.unsplash.com/photo-1544963950-a7a778c6548e?w=100&h=100&fit=crop&crop=center', // Tennis/Padel court
        'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=100&h=100&fit=crop&crop=center', // Sports court
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop&crop=center', // Tennis court aerial
        'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=100&h=100&fit=crop&crop=center', // Sport facility
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop&crop=center', // Sports complex
        'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=100&h=100&fit=crop&crop=center'  // Tennis court
      ];
      
      const imageUrl = padelImages[index % padelImages.length];
      
      markerElement.innerHTML = `
        <img 
          src="${imageUrl}" 
          alt="Padel Court at ${club.name}"
          style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;"
          onerror="this.src='https://images.unsplash.com/photo-1544963950-a7a778c6548e?w=100&h=100&fit=crop&crop=center'"
        />
        <div style="
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 16px;
          height: 16px;
          background: #10b981;
          border: 2px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <svg width="8" height="8" viewBox="0 0 24 24" fill="white">
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </div>
      `;

      // Improved hover effects
      markerElement.addEventListener('mouseenter', () => {
        markerElement.style.transform = 'scale(1.2)';
        markerElement.style.zIndex = '1000';
        markerElement.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4)';
      });
      
      markerElement.addEventListener('mouseleave', () => {
        markerElement.style.transform = 'scale(1)';
        markerElement.style.zIndex = '1';
        markerElement.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
      });

      // Create marker with proper positioning
      const marker = new mapboxgl.Marker({
        element: markerElement,
        anchor: 'center' // Center the marker on the coordinates
      })
        .setLngLat(club.coordinates)
        .addTo(map.current!);

      // Create popup with improved positioning and content
      const popup = new mapboxgl.Popup({
        offset: 25, // Offset from the marker
        closeButton: false,
        className: 'custom-popup',
        anchor: 'bottom', // Anchor at bottom so popup appears above marker
        maxWidth: '300px'
      }).setHTML(`
        <div style="padding: 16px; min-width: 250px;">
          <h3 style="margin: 0 0 8px 0; font-weight: 600; color: #1f2937; font-size: 16px; line-height: 1.3;">${club.name}</h3>
          <p style="margin: 0 0 8px 0; font-size: 12px; color: #6b7280; line-height: 1.4;">${club.address}</p>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <span style="color: #fbbf24; font-size: 16px;">★</span>
            <span style="font-size: 13px; color: #1f2937; font-weight: 500;">${club.rating}</span>
            <span style="font-size: 12px; color: #6b7280;">• ${club.numberOfCourts} courts</span>
          </div>
          <div style="font-size: 11px; color: #10b981; font-weight: 500; text-align: center; padding-top: 4px; border-top: 1px solid #e5e7eb;">
            Click marker for details →
          </div>
        </div>
      `);

      // Improved click handling
      markerElement.addEventListener('click', (e) => {
        e.stopPropagation();
        onClubSelect(club);
        
        // Smooth fly to selected marker
        map.current?.flyTo({
          center: club.coordinates,
          zoom: Math.max(map.current.getZoom(), 13),
          essential: true,
          duration: 1000
        });
      });

      // Better popup behavior - show on hover, hide on mouse leave
      let hoverTimeout: NodeJS.Timeout;
      
      markerElement.addEventListener('mouseenter', () => {
        clearTimeout(hoverTimeout);
        marker.setPopup(popup);
        popup.addTo(map.current!);
      });

      markerElement.addEventListener('mouseleave', () => {
        hoverTimeout = setTimeout(() => {
          popup.remove();
        }, 200); // Small delay to allow moving to popup
      });

      // Keep popup open when hovering over it
      popup.on('open', () => {
        const popupElement = popup.getElement();
        if (popupElement) {
          popupElement.addEventListener('mouseenter', () => {
            clearTimeout(hoverTimeout);
          });
          
          popupElement.addEventListener('mouseleave', () => {
            popup.remove();
          });
        }
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
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          padding: 0;
        }
        .custom-popup .mapboxgl-popup-tip {
          border-top-color: white;
        }
        .mapboxgl-ctrl {
          box-shadow: 0 0 10px 2px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
};
