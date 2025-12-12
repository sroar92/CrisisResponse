'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import Navigation from '../../components/Navigation';
import Link from 'next/link';
import { Users, MapPin, ArrowLeft, CheckCircle, Radio, AlertCircle } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';

interface Responder {
  id: string;
  name: string;
  type: 'Fire' | 'Police';
  status: 'active' | 'standby';
  location: string;
  coords?: { lat: number; lng: number };
}

export default function ResponderManagementPage() {
  const [responders, setResponders] = useState<Responder[]>([
    { id: 'FR-101', name: 'Unit Alpha', type: 'Fire', status: 'standby', location: 'Downtown', coords: { lat: 33.7490, lng: -84.3880 } },
    { id: 'FR-102', name: 'Unit Bravo', type: 'Police', status: 'active', location: 'North District', coords: { lat: 33.8958, lng: -84.3014 } },
    { id: 'FR-103', name: 'Unit Charlie', type: 'Fire', status: 'standby', location: 'Station 3', coords: { lat: 33.6407, lng: -84.4277 } },
    { id: 'FR-104', name: 'Unit Delta', type: 'Police', status: 'active', location: 'Highway 5', coords: { lat: 33.7550, lng: -84.4000 } },
  ]);

  const [selectedResponder, setSelectedResponder] = useState<string | null>(null);
  const [trackingLocation, setTrackingLocation] = useState<string | null>(null);

  // Load responder data from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loadedResponders = responders.map(r => {
        const status = localStorage.getItem(`responder_${r.id.toLowerCase()}_status`) as 'active' | 'standby';
        const locationStr = localStorage.getItem(`responder_${r.id.toLowerCase()}_location`);
        let coords = r.coords;
        
        if (locationStr) {
          try {
            coords = JSON.parse(locationStr);
          } catch (e) {
            console.error('Error parsing location:', e);
          }
        }
        
        return {
          ...r,
          status: status || r.status,
          coords
        };
      });
      setResponders(loadedResponders);
    }
  }, []);

  // Update responder status
  const updateStatus = (id: string, newStatus: 'active' | 'standby') => {
    setResponders(prev => prev.map(r => 
      r.id === id ? { ...r, status: newStatus } : r
    ));
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(`responder_${id.toLowerCase()}_status`, newStatus);
    }
    
    // Trigger storage event for other components
    window.dispatchEvent(new Event('storage'));
  };

  // Start tracking location for a responder
  const startLocationTracking = (id: string) => {
    setTrackingLocation(id);
    
    if ('geolocation' in navigator) {
      navigator.geolocation.watchPosition(
        (position) => {
          const newCoords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          // Update responder location
          setResponders(prev => prev.map(r => 
            r.id === id ? { ...r, coords: newCoords, location: `${newCoords.lat.toFixed(4)}, ${newCoords.lng.toFixed(4)}` } : r
          ));
          
          // Save to localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem(`responder_${id.toLowerCase()}_location`, JSON.stringify(newCoords));
          }
          
          // Trigger storage event
          window.dispatchEvent(new Event('storage'));
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Unable to track location. Please enable location services.');
          setTrackingLocation(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
    }
  };

  // Stop tracking location
  const stopLocationTracking = () => {
    setTrackingLocation(null);
  };

  const activeCount = responders.filter(r => r.status === 'active').length;
  const standbyCount = responders.filter(r => r.status === 'standby').length;

  return (
    <ProtectedRoute requiredPermissions={['canManageResponders']}>
      <div className="min-h-screen bg-slate-900">
        <Navigation />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <Link 
            href="/dashboard"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Users className="w-8 h-8 text-purple-500" />
              Responder Management
            </h1>
            <p className="text-slate-400">Manage first responder status and locations</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-6 h-6 text-blue-400" />
                <span className="text-2xl font-bold text-white">{responders.length}</span>
              </div>
              <p className="text-slate-400 text-sm">Total Units</p>
            </div>

            <div className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <Radio className="w-6 h-6 text-green-400" />
                <span className="text-2xl font-bold text-white">{activeCount}</span>
              </div>
              <p className="text-slate-400 text-sm">Active Units</p>
            </div>

            <div className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <AlertCircle className="w-6 h-6 text-yellow-400" />
                <span className="text-2xl font-bold text-white">{standbyCount}</span>
              </div>
              <p className="text-slate-400 text-sm">Standby Units</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-blue-900/30 border border-blue-600/50 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <h3 className="text-white font-semibold mb-1">Location Tracking</h3>
                <p className="text-blue-200 text-sm">
                  Click "Track Location" on any responder to enable real-time GPS tracking. 
                  Make sure to allow location access in your browser.
                </p>
              </div>
            </div>
          </div>

          {/* Responders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {responders.map(responder => (
              <div
                key={responder.id}
                className={`bg-slate-800 rounded-xl p-6 shadow-xl border transition-all ${
                  selectedResponder === responder.id
                    ? 'border-blue-500 ring-2 ring-blue-500/50'
                    : 'border-slate-700 hover:border-slate-600'
                }`}
                onClick={() => setSelectedResponder(responder.id)}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{responder.name}</h3>
                    <p className="text-sm text-slate-400">{responder.id}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    responder.type === 'Fire' ? 'bg-orange-600 text-white' : 'bg-blue-600 text-white'
                  }`}>
                    {responder.type}
                  </span>
                </div>

                {/* Status */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Current Status
                  </label>
                  <div className="flex items-center justify-between">
                    <StatusBadge status={responder.status} size="md" />
                  </div>
                </div>

                {/* Location */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Location
                  </label>
                  <div className="flex items-start gap-2 text-sm text-slate-400">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{responder.location}</span>
                  </div>
                  {responder.coords && (
                    <div className="text-xs text-slate-500 mt-1 ml-6">
                      {responder.coords.lat.toFixed(6)}, {responder.coords.lng.toFixed(6)}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  {/* Status Toggle */}
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateStatus(responder.id, 'active');
                      }}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        responder.status === 'active'
                          ? 'bg-green-600 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      Active
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateStatus(responder.id, 'standby');
                      }}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        responder.status === 'standby'
                          ? 'bg-yellow-600 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      Standby
                    </button>
                  </div>

                  {/* Location Tracking */}
                  {trackingLocation === responder.id ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        stopLocationTracking();
                      }}
                      className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Radio className="w-4 h-4 animate-pulse" />
                      Stop Tracking
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startLocationTracking(responder.id);
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <MapPin className="w-4 h-4" />
                      Track Location
                    </button>
                  )}
                </div>

                {/* Tracking Indicator */}
                {trackingLocation === responder.id && (
                  <div className="mt-3 bg-green-900/30 border border-green-600/50 rounded-lg p-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-green-300">Location tracking active</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* View on Map Link */}
          <div className="mt-8 text-center">
            <Link
              href="/map"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <MapPin className="w-5 h-5" />
              View All on Map
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}