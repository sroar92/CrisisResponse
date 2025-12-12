'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon (must be outside component)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Coords {
  lat: number;
  lng: number;
}

interface Responder {
  id: string;
  name: string;
  type: string;
  status: string;
  location: string;
  coords?: Coords;
  route?: any;
}

interface DamageFeature {
  id: number;
  geometry: {
    type: string;
    coordinates: [number, number];
  };
  properties: {
    damageType: string;
    severity: number;
    slope?: number;
    area?: number;
    confidence?: number;
  };
}

interface DamageAnalysis {
  features: DamageFeature[];
}

interface ResponderMapProps {
  responders: Responder[];
  damageAnalysis?: DamageAnalysis | null;
  showDamageOverlays?: boolean;
}

export default function ResponderMap({ 
  responders, 
  damageAnalysis, 
  showDamageOverlays = false 
}: ResponderMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const overlaysRef = useRef<L.Circle[]>([]);

  // Initialize map
  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    // Create map if it doesn't exist
    if (!mapRef.current) {
      const map = L.map(mapContainerRef.current).setView([33.7490, -84.3880], 11);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Create custom pane for damage overlays with lower z-index
      // Default Leaflet panes:
      // - mapPane: 0
      // - tilePane: 200
      // - overlayPane: 400 (default for overlays)
      // - shadowPane: 500
      // - markerPane: 600
      // - tooltipPane: 650
      // - popupPane: 700 (popups appear here)
      
      // Create damage overlay pane below popups but above tiles
      const damagePane = map.createPane('damageOverlayPane');
      damagePane.style.zIndex = '450'; // Between overlayPane (400) and shadowPane (500), below popupPane (700)

      mapRef.current = map;
    }

    return () => {
      // Cleanup on unmount
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update responder markers
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    responders.forEach(responder => {
      if (responder.coords && mapRef.current) {
        const icon = L.divIcon({
          html: `
            <div style="
              background: ${responder.type === 'Fire' ? '#ea580c' : '#2563eb'};
              color: white;
              padding: 4px 8px;
              border-radius: 4px;
              font-weight: bold;
              font-size: 12px;
              white-space: nowrap;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              border: 2px solid white;
            ">
              ${responder.name}
            </div>
          `,
          className: 'custom-marker',
          iconSize: [0, 0],
          iconAnchor: [0, 0]
        });

        const marker = L.marker([responder.coords.lat, responder.coords.lng], { icon })
          .bindPopup(`
            <div style="font-family: sans-serif;">
              <strong style="font-size: 14px;">${responder.name}</strong><br/>
              <span style="color: #666;">Type: ${responder.type}</span><br/>
              <span style="color: #666;">Status: ${responder.status}</span><br/>
              <span style="color: #666;">Location: ${responder.location}</span>
            </div>
          `)
          .addTo(mapRef.current);

        markersRef.current.push(marker);
      }
    });
  }, [responders]);

  // Update damage overlays
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing overlays
    overlaysRef.current.forEach(overlay => overlay.remove());
    overlaysRef.current = [];

    // Add damage overlays if enabled and data exists
    if (showDamageOverlays && damageAnalysis?.features) {
      damageAnalysis.features.forEach(feature => {
        if (mapRef.current && feature.geometry.type === 'Point') {
          const [lng, lat] = feature.geometry.coordinates;
          const { damageType, severity, area, confidence } = feature.properties;

          // Color based on damage type
          let color = '#ef4444'; // red default
          if (damageType === 'flood') color = '#3b82f6'; // blue
          if (damageType === 'collapse') color = '#f97316'; // orange
          if (damageType === 'debris') color = '#eab308'; // yellow
          if (damageType === 'fire') color = '#dc2626'; // dark red

          // Size based on severity and area
          const baseRadius = 50; // meters
          const severityMultiplier = severity / 10; // 0-1 scale
          const areaMultiplier = area ? Math.sqrt(area) / 20 : 1;
          const radius = baseRadius * severityMultiplier * areaMultiplier;

          // Opacity based on confidence
          const opacity = confidence ? 0.3 + (confidence * 0.4) : 0.5;

          // Create circle overlay
          const circle = L.circle([lat, lng], {
            color: color,
            fillColor: color,
            fillOpacity: opacity,
            radius: radius,
            weight: 2,
            pane: 'damageOverlayPane' // Use custom pane with z-index 450 (below popups at 700)
          })
            .bindPopup(`
              <div style="font-family: sans-serif;">
                <strong style="font-size: 14px; color: ${color};">⚠️ ${damageType.toUpperCase()}</strong><br/>
                <span style="color: #666;">Severity: ${severity.toFixed(1)}/10</span><br/>
                ${area ? `<span style="color: #666;">Area: ${area}m²</span><br/>` : ''}
                ${confidence ? `<span style="color: #666;">Confidence: ${(confidence * 100).toFixed(0)}%</span>` : ''}
              </div>
            `)
            .addTo(mapRef.current);

          overlaysRef.current.push(circle);
        }
      });

      // Optionally fit bounds to show all overlays
      if (overlaysRef.current.length > 0 && mapRef.current) {
        const group = L.featureGroup(overlaysRef.current);
        mapRef.current.fitBounds(group.getBounds().pad(0.1));
      }
    }
  }, [damageAnalysis, showDamageOverlays]);

  return <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />;
}