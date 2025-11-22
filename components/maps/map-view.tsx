/**
 * Map View Component (Stub)
 * TODO: Implement actual map integration (e.g., Mapbox, Google Maps, etc.)
 */

import React from 'react';

interface MapViewProps {
  center?: [number, number];
  zoom?: number;
  [key: string]: any;
}

const MapView: React.FC<MapViewProps> = (props) => {
  return (
    <div className="p-4 border border-gray-300 rounded-lg bg-blue-50">
      <p className="text-gray-600">Map view placeholder</p>
    </div>
  );
};

export default MapView;
