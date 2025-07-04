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
        style: 'mapbox://styles/mapbox/navigation-night-v1',
        center: [57.5522, -20.3484],
        zoom: 10,
        minZoom: 9,
        maxZoom: 16,
        pitch: 0,
        bearing: 0
      });

      console.log('Map instance created successfully');

      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: false,
        }),
        'top-right'
      );

      map.current.addControl(new mapboxgl.ScaleControl(), 'bottom-left');

      const mauritiusBounds = new mapboxgl.LngLatBounds(
        [57.0, -20.8],
        [58.1, -19.8]
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
      // Create marker element using the same approach as working project
      const markerElement = document.createElement('div');
      markerElement.className = 'custom-marker';
      
      // Apply styles directly to properties (more reliable than innerHTML)
      markerElement.style.width = '40px';
      markerElement.style.height = '40px';
      markerElement.style.borderRadius = '50%';
      markerElement.style.border = `3px solid ${selectedClubId === club.id ? '#059669' : '#10b981'}`;
      markerElement.style.cursor = 'pointer';
      markerElement.style.display = 'flex';
      markerElement.style.alignItems = 'center';
      markerElement.style.justifyContent = 'center';
      markerElement.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)';
      markerElement.style.transition = 'border-color 0.2s ease, box-shadow 0.2s ease';
      markerElement.style.overflow = 'hidden';
      markerElement.style.background = 'white';
      markerElement.style.position = 'relative';
      
      // Use reliable placeholder images
      const padelImages = [
        '/placeholder.svg',
        'https://images.unsplash.com/photo-1544963950-a7a778c6548e?w=100&h=100&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=100&h=100&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=100&h=100&fit=crop&crop=center'
      ];
      
      const imageUrl = padelImages[index % padelImages.length];
      
      // Create image element
      const imgElement = document.createElement('img');
      imgElement.src = imageUrl;
      imgElement.alt = `Padel Court at ${club.name}`;
      imgElement.style.width = '100%';
      imgElement.style.height = '100%';
      imgElement.style.objectFit = 'cover';
      imgElement.style.borderRadius = '50%';
      
      // Create fallback element
      const fallbackElement = document.createElement('div');
      fallbackElement.style.width = '100%';
      fallbackElement.style.height = '100%';
      fallbackElement.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      fallbackElement.style.borderRadius = '50%';
      fallbackElement.style.display = 'none';
      fallbackElement.style.alignItems = 'center';
      fallbackElement.style.justifyContent = 'center';
      fallbackElement.style.color = 'white';
      fallbackElement.style.fontWeight = 'bold';
      fallbackElement.style.fontSize = '14px';
      fallbackElement.textContent = '🏓';
      
      // Handle image load error
      imgElement.onerror = () => {
        imgElement.style.display = 'none';
        fallbackElement.style.display = 'flex';
      };
      
      markerElement.appendChild(imgElement);
      markerElement.appendChild(fallbackElement);

      // Create marker using simple approach (like working project)
      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat(club.coordinates)
        .addTo(map.current!);

      // Create popup
      const popup = new mapboxgl.Popup({
        offset: [0, -25],
        closeButton: false,
        className: 'custom-popup',
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

      // Hover behavior
      let hoverTimeout: NodeJS.Timeout;
      let showTimeout: NodeJS.Timeout;
      
      const showPopup = () => {
        clearTimeout(hoverTimeout);
        showTimeout = setTimeout(() => {
          if (map.current) {
            popup.setLngLat(club.coordinates).addTo(map.current);
          }
        }, 150);
      };
      
      const hidePopup = () => {
        clearTimeout(showTimeout);
        hoverTimeout = setTimeout(() => {
          popup.remove();
        }, 200);
      };

      // Hover effects using only color and shadow changes
      const applyHoverEffect = () => {
        markerElement.style.borderColor = '#059669';
        markerElement.style.boxShadow = '0 6px 16px rgba(0,0,0,0.35)';
      };
      
      const removeHoverEffect = () => {
        if (selectedClubId !== club.id) {
          markerElement.style.borderColor = '#10b981';
          markerElement.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)';
        }
      };

      // Event listeners
      markerElement.addEventListener('mouseenter', () => {
        applyHoverEffect();
        showPopup();
      });
      
      markerElement.addEventListener('mouseleave', () => {
        removeHoverEffect();
        hidePopup();
      });

      markerElement.addEventListener('click', (e) => {
        e.stopPropagation();
        
        setSelectedClubId(club.id);
        onClubSelect(club);
        
        updateMarkerStates(club.id);
        
        map.current?.flyTo({
          center: club.coordinates,
          zoom: Math.max(map.current.getZoom(), 13),
          essential: true,
          duration: 1000
        });
        
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
        element.style.boxShadow = '0 6px 16px rgba(0,0,0,0.35)';
      } else {
        element.style.borderColor = '#10b981';
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
      `}</style>
    </div>
  );
};
