import React, { useEffect, useRef, useState } from 'react';
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
  const [selectedClubId, setSelectedClubId] = useState<string | null>(null);

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
        style: 'mapbox://styles/mapbox/streets-v11', // Colorful street style
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
      // Create custom marker element with proper styling
      const markerElement = document.createElement('div');
      markerElement.className = 'custom-marker';
      markerElement.style.cssText = `
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: 3px solid ${selectedClubId === club.id ? '#059669' : '#10b981'};
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.25);
        transition: all 0.2s ease;
        overflow: hidden;
        background: white;
        position: relative;
        transform-origin: center;
      `;
      
      // Use more reliable placeholder images with proper fallbacks
      const padelImages = [
        '/placeholder.svg', // Using local placeholder as primary
        'https://images.unsplash.com/photo-1544963950-a7a778c6548e?w=100&h=100&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=100&h=100&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=100&h=100&fit=crop&crop=center'
      ];
      
      const imageUrl = padelImages[index % padelImages.length];
      
      markerElement.innerHTML = `
        <img 
          src="${imageUrl}" 
          alt="Padel Court at ${club.name}"
          style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;"
          onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
        />
        <div style="
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 50%;
          display: none;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 18px;
        ">🏓</div>
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
          <div style="width: 6px; height: 6px; background: white; border-radius: 50%;"></div>
        </div>
      `;

      // Create marker with proper positioning
      const marker = new mapboxgl.Marker({
        element: markerElement,
        anchor: 'center'
      })
        .setLngLat(club.coordinates)
        .addTo(map.current!);

      // Create popup with improved content and positioning
      const popup = new mapboxgl.Popup({
        offset: [0, -35], // Position above the marker
        closeButton: false,
        className: 'custom-popup',
        anchor: 'bottom',
        maxWidth: '280px'
      }).setHTML(`
        <div style="padding: 12px; min-width: 220px;">
          <h3 style="margin: 0 0 6px 0; font-weight: 600; color: #1f2937; font-size: 15px; line-height: 1.3;">${club.name}</h3>
          <p style="margin: 0 0 6px 0; font-size: 11px; color: #6b7280; line-height: 1.4;">${club.address}</p>
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
            <span style="color: #fbbf24; font-size: 14px;">★</span>
            <span style="font-size: 12px; color: #1f2937; font-weight: 500;">${club.rating}</span>
            <span style="font-size: 11px; color: #6b7280;">• ${club.numberOfCourts} courts</span>
          </div>
          <div style="font-size: 10px; color: #10b981; font-weight: 500; text-align: center; padding-top: 4px; border-top: 1px solid #e5e7eb;">
            Click for details →
          </div>
        </div>
      `);

      // Improved hover behavior with delays
      let hoverTimeout: NodeJS.Timeout;
      let showTimeout: NodeJS.Timeout;
      
      const showPopup = () => {
        clearTimeout(hoverTimeout);
        showTimeout = setTimeout(() => {
          if (map.current) {
            popup.setLngLat(club.coordinates).addTo(map.current);
          }
        }, 150); // Small delay to prevent flickering
      };
      
      const hidePopup = () => {
        clearTimeout(showTimeout);
        hoverTimeout = setTimeout(() => {
          popup.remove();
        }, 200);
      };

      // Enhanced hover effects with subtle scaling
      const applyHoverEffect = () => {
        markerElement.style.transform = 'scale(1.1)';
        markerElement.style.zIndex = '100';
        markerElement.style.boxShadow = '0 6px 16px rgba(0,0,0,0.3)';
        markerElement.style.borderColor = '#059669';
      };
      
      const removeHoverEffect = () => {
        if (selectedClubId !== club.id) {
          markerElement.style.transform = 'scale(1)';
          markerElement.style.zIndex = '1';
          markerElement.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)';
          markerElement.style.borderColor = '#10b981';
        }
      };

      // Event listeners for hover behavior
      markerElement.addEventListener('mouseenter', () => {
        applyHoverEffect();
        showPopup();
      });
      
      markerElement.addEventListener('mouseleave', () => {
        removeHoverEffect();
        hidePopup();
      });

      // Click handling with improved feedback
      markerElement.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Update selected state
        setSelectedClubId(club.id);
        onClubSelect(club);
        
        // Update all markers to reflect selection
        updateMarkerStates(club.id);
        
        // Smooth fly to selected marker
        map.current?.flyTo({
          center: club.coordinates,
          zoom: Math.max(map.current.getZoom(), 13),
          essential: true,
          duration: 1000
        });
        
        // Hide popup after click
        hidePopup();
      });

      // Keep popup open when hovering over it
      popup.on('open', () => {
        const popupElement = popup.getElement();
        if (popupElement) {
          popupElement.addEventListener('mouseenter', () => {
            clearTimeout(hoverTimeout);
          });
          
          popupElement.addEventListener('mouseleave', () => {
            hidePopup();
          });
        }
      });

      markers.current.push(marker);
    });
  };

  const updateMarkerStates = (selectedId: string) => {
    markers.current.forEach((marker, index) => {
      const element = marker.getElement();
      const club = clubs[index];
      
      if (club.id === selectedId) {
        element.style.borderColor = '#059669';
        element.style.transform = 'scale(1.05)';
        element.style.boxShadow = '0 6px 16px rgba(0,0,0,0.3)';
      } else {
        element.style.borderColor = '#10b981';
        element.style.transform = 'scale(1)';
        element.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)';
      }
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
          border-radius: 8px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          padding: 0;
        }
        .custom-popup .mapboxgl-popup-tip {
          border-top-color: white;
        }
        .mapboxgl-ctrl {
          box-shadow: 0 0 10px 2px rgba(0,0,0,0.1);
        }
        .custom-marker {
          will-change: transform;
        }
      `}</style>
    </div>
  );
};
