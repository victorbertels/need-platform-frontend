'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { FiMap, FiGrid, FiFilter } from 'react-icons/fi';

// Dynamically import Leaflet to avoid SSR issues
const Map = dynamic(() => import('./Map'), { ssr: false });

interface Need {
  id: string;
  title: string;
  description: string;
  category: string;
  budget?: number;
  location?: string;
  latitude?: number;
  longitude?: number;
  status: string;
  image_url?: string;
  rating?: number;
}

interface MapViewProps {
  needs: Need[];
  isMapView: boolean;
  onToggleView: () => void;
  selectedCategory?: string;
}

export default function MapView({
  needs,
  isMapView,
  onToggleView,
  selectedCategory,
}: MapViewProps) {
  const [distanceFilter, setDistanceFilter] = useState<number | null>(null);
  const [filteredNeeds, setFilteredNeeds] = useState<Need[]>(needs);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Get user location
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // Default to Belgium center if geolocation fails
          setUserLocation({ lat: 50.5039, lng: 4.4699 });
        }
      );
    }
  }, []);

  // Filter needs based on distance
  useEffect(() => {
    let filtered = needs.filter((n) => n.status === 'pending');

    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(
        (n) => n.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (distanceFilter && userLocation) {
      filtered = filtered.filter((need) => {
        if (!need.latitude || !need.longitude) return true;
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          need.latitude,
          need.longitude
        );
        return distance <= distanceFilter;
      });
    }

    setFilteredNeeds(filtered);
  }, [needs, selectedCategory, distanceFilter, userLocation]);

  const calculateDistance = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  if (!isMapView) {
    return null;
  }

  return (
    <div className="w-full h-screen bg-slate-900 relative">
      {/* Controls */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-4">
        {/* View Toggle */}
        <button
          onClick={onToggleView}
          className="glass px-4 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-slate-700/50 transition"
        >
          <FiGrid /> Grid View
        </button>

        {/* Distance Filter */}
        <div className="glass p-4 rounded-xl backdrop-blur-lg">
          <div className="flex items-center gap-2 mb-3 text-sm font-semibold">
            <FiFilter /> Distance
          </div>
          <div className="space-y-2 text-sm">
            {[
              { label: 'All', value: null },
              { label: '5 km', value: 5 },
              { label: '10 km', value: 10 },
              { label: '25 km', value: 25 },
            ].map((opt) => (
              <button
                key={opt.value ?? 'all'}
                onClick={() => setDistanceFilter(opt.value)}
                className={`block w-full text-left px-3 py-2 rounded-lg transition ${
                  distanceFilter === opt.value
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold'
                    : 'hover:bg-slate-700/50 text-slate-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Task Count */}
        <div className="glass px-4 py-3 rounded-xl text-sm font-semibold text-slate-300">
          {filteredNeeds.length} task{filteredNeeds.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Map */}
      <Map needs={filteredNeeds} userLocation={userLocation} calculateDistance={calculateDistance} />
    </div>
  );
}
