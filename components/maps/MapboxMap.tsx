// TODO: Review addEventListener calls for proper cleanup in useEffect return functions
'use client';

import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { PropertyUnit } from '@/lib/types';

interface MapboxMapProps {
  units?: PropertyUnit[];
  center?: [number, number];
  zoom?: number;
  onUnitClick?: (unit: PropertyUnit) => void;
  onMapClick?: (lngLat: { lng: number; lat: number }) => void;
  isAddMode?: boolean;
  height?: string;
}

export interface MapboxMapRef {
  flyTo: (center: [number, number], zoom?: number) => void;
  getMap: () => mapboxgl.Map | null;
}

/**
 * Mapbox GL component for displaying property units on an interactive map
 *
 * This component is designed to be dynamically imported to reduce initial bundle size.
 *
 * @example
 * ```tsx
 * import dynamic from 'next/dynamic';
 *
 * const DynamicMapboxMap = dynamic(
 *   () => import('@/components/maps/MapboxMap'),
 *   { ssr: false }
 * );
 *
 * <DynamicMapboxMap units={units} onUnitClick={handleClick} />
 * ```
 */
const MapboxMap = forwardRef<MapboxMapRef, MapboxMapProps>(
  (
    {
      units = [],
      center,
      zoom = 15,
      onUnitClick,
      onMapClick,
      isAddMode = false,
      height = '600px',
    },
    ref
  ) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const markers = useRef<mapboxgl.Marker[]>([]);

    // Expose map controls to parent via ref
    useImperativeHandle(ref, () => ({
      flyTo: (newCenter: [number, number], newZoom = 17) => {
        if (map.current) {
          map.current.flyTo({ center: newCenter, zoom: newZoom });
        }
      },
      getMap: () => map.current,
    }));

    // Initialize map
    useEffect(() => {
      if (!mapContainer.current || map.current) return;

      // Set default center to first unit with coordinates or default location
      const firstUnitWithCoords = units.find((u) => u.latitude && u.longitude);
      const mapCenter: [number, number] = center ||
        (firstUnitWithCoords
          ? [firstUnitWithCoords.longitude!, firstUnitWithCoords.latitude!]
          : [-74.006, 40.7128]); // Default to NYC

      // Get token from environment variable
      mapboxgl.accessToken =
        process.env.NEXT_PUBLIC_MAPBOX_TOKEN ||
        'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: mapCenter,
        zoom: zoom,
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Handle map clicks
      let clickHandler: ((e: mapboxgl.MapMouseEvent) => void) | null = null;
      if (onMapClick) {
        clickHandler = (e: mapboxgl.MapMouseEvent) => {
          if (isAddMode) {
            onMapClick({ lng: e.lngLat.lng, lat: e.lngLat.lat });
          }
        };
        map.current.on('click', clickHandler);
      }

      // Cleanup on unmount
      return () => {
        if (map.current) {
          // Remove click handler if it was added
          if (clickHandler) {
            map.current.off('click', clickHandler);
          }
          map.current.remove();
          map.current = null;
        }
      };
    }, []);

    // Update markers when units change
    useEffect(() => {
      if (!map.current) return;

      // Clear existing markers
      markers.current.forEach((marker) => marker.remove());
      markers.current = [];

      // Add markers for units with coordinates
      units.forEach((unit) => {
        if (unit.latitude && unit.longitude) {
          const el = document.createElement('div');
          el.className = 'custom-marker';
          el.style.width = '30px';
          el.style.height = '30px';
          el.style.borderRadius = '50%';
          el.style.cursor = 'pointer';
          el.style.display = 'flex';
          el.style.alignItems = 'center';
          el.style.justifyContent = 'center';

          // Color based on occupancy status
          const statusColors: Record<string, string> = {
            occupied: '#10b981',
            vacant: '#f59e0b',
            rented: '#3b82f6',
            for_sale: '#ef4444',
          };
          el.style.backgroundColor =
            statusColors[unit.occupancyStatus || 'occupied'] || '#6b7280';
          el.style.border = '3px solid white';
          el.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.9)';

          const marker = new mapboxgl.Marker(el)
            .setLngLat([unit.longitude, unit.latitude])
            .setPopup(
              new mapboxgl.Popup({ offset: 25 }).setHTML(`
                <div style="padding: 8px;">
                  <h3 style="font-weight: 600; margin-bottom: 4px;">Unit ${unit.unitNumber}</h3>
                  ${unit.building ? `<p style="font-size: 12px; color: #6b7280;">Building: ${unit.building}</p>` : ''}
                  ${unit.streetAddress ? `<p style="font-size: 12px; color: #6b7280;">${unit.streetAddress}</p>` : ''}
                  <p style="font-size: 12px; margin-top: 4px;">
                    <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${statusColors[unit.occupancyStatus || 'occupied']}; margin-right: 4px;"></span>
                    ${unit.occupancyStatus?.replace('_', ' ') || 'occupied'}
                  </p>
                </div>
              `)
            )
            .addTo(map.current!);

          if (onUnitClick) {
            el.addEventListener('click', () => {
              onUnitClick(unit);
            });
          }

          markers.current.push(marker);
        }
      });
    }, [units, onUnitClick, isAddMode]);

    return <div ref={mapContainer} className="w-full" style={{ height }} />;
  }
);

MapboxMap.displayName = 'MapboxMap';

export default MapboxMap;
