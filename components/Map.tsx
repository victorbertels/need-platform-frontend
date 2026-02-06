'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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
}

interface MapProps {
  needs: Need[];
  userLocation: { lat: number; lng: number } | null;
  calculateDistance: (lat1: number, lng1: number, lat2: number, lng2: number) => number;
}

const categoryColors: Record<string, string> = {
  delivery: '#06B6D4',
  cleaning: '#7C3AED',
  plumbing: '#3B82F6',
  handyperson: '#EC4899',
  gardening: '#10B981',
  furniture: '#F59E0B',
  marketing: '#8B5CF6',
  other: '#6366F1',
};

export default function Map({ needs, userLocation, calculateDistance }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    if (!map.current) {
      map.current = L.map(mapContainer.current).setView(
        [userLocation?.lat || 50.5039, userLocation?.lng || 4.4699],
        11
      );

      // Dark mode tile layer
      L.tileLayer(
        'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
        {
          attribution:
            '&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a>',
          maxZoom: 20,
        }
      ).addTo(map.current);
    }

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add user location marker
    if (userLocation) {
      L.circleMarker([userLocation.lat, userLocation.lng], {
        radius: 8,
        fillColor: '#7C3AED',
        color: '#A78BFA',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8,
      })
        .bindPopup('<div class="text-sm font-semibold">📍 Your Location</div>')
        .addTo(map.current);
    }

    // Add task markers
    needs.forEach((need) => {
      if (!need.latitude || !need.longitude) return;

      const color = categoryColors[need.category.toLowerCase()] || categoryColors.other;
      const distance = userLocation
        ? calculateDistance(
            userLocation.lat,
            userLocation.lng,
            need.latitude,
            need.longitude
          )
        : 0;

      const marker = L.circleMarker([need.latitude, need.longitude], {
        radius: 10,
        fillColor: color,
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8,
      });

      // Custom popup content
      const popupContent = `
        <div style="background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 12px; color: white; max-width: 250px; font-family: 'Geist', sans-serif;">
          <div style="font-size: 14px; font-weight: bold; margin-bottom: 6px; color: #c7d2fe;">${need.title}</div>
          <div style="font-size: 12px; color: #cbd5e1; margin-bottom: 8px;">${need.description.substring(0, 80)}...</div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <div style="font-size: 12px; color: #9ca3af;">
              <span style="color: #06b6d4; font-weight: bold;">€${need.budget}</span> • <span style="color: #cbd5e1;">${need.category}</span>
            </div>
            ${
              distance > 0
                ? `<div style="font-size: 12px; color: #a78bfa; font-weight: bold;">${distance.toFixed(1)} km</div>`
                : ''
            }
          </div>
          <button style="width: 100%; padding: 8px; background: linear-gradient(to right, #7c3aed, #ec4899); color: white; border: none; border-radius: 8px; font-size: 12px; font-weight: bold; cursor: pointer;">
            View Details
          </button>
        </div>
      `;

      marker
        .bindPopup(popupContent, {
          maxWidth: 300,
          className: 'custom-popup',
        })
        .addTo(map.current!);

      markersRef.current.push(marker);
    });

    // Fit bounds to show all markers
    if (markersRef.current.length > 0 && map.current) {
      const group = new L.FeatureGroup(markersRef.current);
      map.current.fitBounds(group.getBounds().pad(0.1), { maxZoom: 15 });
    }

    return () => {
      // Cleanup on unmount
    };
  }, [needs, userLocation, calculateDistance]);

  return (
    <div
      ref={mapContainer}
      style={{
        width: '100%',
        height: '100%',
        borderRadius: '0px',
      }}
      className="map-container"
    />
  );
}
