'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import Navigation from '../../components/Navigation';
import dynamic from 'next/dynamic';
import { MapPin, Users, Activity, Search, Camera, Box, Loader2, Layers } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import LiveResponderTracker from '../../components/LiveResponderTracker';

// Dynamically import map and modal components
const ResponderMap = dynamic(() => import('../../components/ResponderMap'), { ssr: false });
const Modal3D = dynamic(() => import('../../components/Modal3D'), { ssr: false });
const GalleryModal = dynamic(() => import('../../components/GalleryModal'), { ssr: false });


export default function MapPage() {
  const [firstResponders, setFirstResponders] = useState([
    { id: 'FR-101', name: 'Unit Alpha', type: 'Fire', status: 'standby', location: 'Downtown', coords: { lat: 33.7490, lng: -84.3880 } },
    { id: 'FR-102', name: 'Unit Bravo', type: 'Police', status: 'active', location: 'North District', coords: { lat: 33.8958, lng: -84.3014 } },
    { id: 'FR-103', name: 'Unit Charlie', type: 'Fire', status: 'standby', location: 'Station 3', coords: { lat: 33.6407, lng: -84.4277 } },
    { id: 'FR-104', name: 'Unit Delta', type: 'Police', status: 'active', location: 'Highway 5', coords: { lat: 33.7550, lng: -84.4000 } },
  
    // LIVE EN-ROUTE AMBULANCE (auto-moving!)
    
    {
      id: 'AMB-7',
      name: 'Ambulance 7',
      type: 'EMS',
      status: 'active',
      location: 'En Route → Central Hospital',
      coords: { lat: 33.7550, lng: -84.4000 },
      isLiveUnit: true,
      customIcon: '🚑',            
      backgroundColor: '#ef4444',  
      pulse: true
    },
  
  ]);

  const [filterType, setFilterType] = useState<'all' | 'Fire' | 'Police'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'standby'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Drone 3D Visualization States
  const [droneStatus, setDroneStatus] = useState<'idle' | 'uploading' | 'generating' | 'analyzing' | 'ready'>('idle');
  const [damageAnalysis, setDamageAnalysis] = useState<any>(null);
  const [modelUrl, setModelUrl] = useState<string>('');
  const [show3DModal, setShow3DModal] = useState(false);
  
  // NEW: Damage overlay toggle
  const [showDamageOverlays, setShowDamageOverlays] = useState(false);
  
  // NEW: Image gallery state
  const [showImageGallery, setShowImageGallery] = useState(false);

  // Load responder statuses from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loadedResponders = firstResponders.map(r => ({
        ...r,
        status: (localStorage.getItem(`responder_${r.id.toLowerCase()}_status`) as 'active' | 'standby') || r.status
      }));
      setFirstResponders(loadedResponders);
    }
  }, []);

  // Auto-update on storage change
  useEffect(() => {
    const handleUpdate = () => {
      setFirstResponders(prev => prev.map(r => ({
        ...r,
        status: (localStorage.getItem(`responder_${r.id.toLowerCase()}_status`) as 'active' | 'standby') || r.status
      })));
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleUpdate);
      window.addEventListener('focus', handleUpdate);

      return () => {
        window.removeEventListener('storage', handleUpdate);
        window.removeEventListener('focus', handleUpdate);
      };
    }
  }, []);

  // AUTO-MOVE AMBULANCE 7 ON PAGE LOAD (uncomment the line below for instant demo mode)
  // Or keep it commented and use the button in Step 3
  useEffect(() => {
    startAmbulance7Journey();
  }, []);

    // Add this useEffect + function — replaces the old one completely
    const startAmbulance7Journey = () => {
      // Reset to starting point first (in case you click the button multiple times)
      setFirstResponders(prev => prev.map(u => 
        u.id === 'AMB-7' 
          ? { ...u, coords: { lat: 33.7550, lng: -84.4000 }, location: 'En Route → Central Hospital', status: 'active' }
          : u
      ));

      const path = [
        { lat: 33.7550, lng: -84.4000 }, // Start
        { lat: 33.7620, lng: -84.3950 },
        { lat: 33.7690, lng: -84.3900 },
        { lat: 33.7490, lng: -84.3880 }, // Central Hospital
      ];

      let step = 0;
      const totalSteps = path.length - 1;
      const interval = setInterval(() => {
        step++;
    
    if (step >= totalSteps) {
      // Final position
      setFirstResponders(prev => prev.map(u => 
        u.id === 'AMB-7' 
          ? { ...u, coords: path[totalSteps], location: 'Arrived at Central Hospital', status: 'arrived' }
          : u
      ));
      clearInterval(interval);
      return;
    }

    // Smoothly move to next point
    setFirstResponders(prev => prev.map(u => 
      u.id === 'AMB-7' 
        ? { ...u, coords: { lat: path[step].lat, lng: path[step].lng } }
        : u
    ));
  }, 7500); // ← 7.5 seconds per segment = ~30 second total journey (perfect demo pace)
};

  // Filter responders
  const filteredResponders = firstResponders.filter(r => {
    const typeMatch = filterType === 'all' || r.type === filterType;
    const statusMatch = filterStatus === 'all' || r.status === filterStatus;
    const searchMatch = searchQuery === '' || 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location.toLowerCase().includes(searchQuery.toLowerCase());
    return typeMatch && statusMatch && searchMatch;
  });

  const activeCount = firstResponders.filter(r => r.status === 'active').length;
  const standbyCount = firstResponders.filter(r => r.status === 'standby').length;

  // Drone simulation function
  const simulateDroneAnalysis = async () => {
    const missionId = 'demo-mission';
    
    // Step 1: Upload drone images
    setDroneStatus('uploading');
    await new Promise(r => setTimeout(r, 2000));
    
    // Step 2: Generate 3D model
    setDroneStatus('generating');
    await new Promise(r => setTimeout(r, 3000));
    const generatedModelUrl = `/models/${missionId}/base-terrain.gltf`;
    setModelUrl(generatedModelUrl);
    
    // Step 3: Analyze damage
    setDroneStatus('analyzing');
    await new Promise(r => setTimeout(r, 2000));
    
    // Mock damage analysis data with GeoJSON coordinates
    const mockAnalysis = {
      type: 'FeatureCollection',
      features: [
        { 
          id: 0,
          geometry: { type: 'Point', coordinates: [-84.3880, 33.7490] },
          properties: { damageType: 'flood', severity: 8.5, slope: 0.45, area: 523, confidence: 0.87 }
        },
        { 
          id: 1,
          geometry: { type: 'Point', coordinates: [-84.3920, 33.7520] },
          properties: { damageType: 'collapse', severity: 9.2, slope: 0.62, area: 780, confidence: 0.92 }
        },
        { 
          id: 2,
          geometry: { type: 'Point', coordinates: [-84.3850, 33.7510] },
          properties: { damageType: 'debris', severity: 7.8, slope: 0.38, area: 345, confidence: 0.81 }
        },
        { 
          id: 3,
          geometry: { type: 'Point', coordinates: [-84.3900, 33.7480] },
          properties: { damageType: 'flood', severity: 8.9, slope: 0.51, area: 612, confidence: 0.89 }
        },
        { 
          id: 4,
          geometry: { type: 'Point', coordinates: [-84.3870, 33.7530] },
          properties: { damageType: 'fire', severity: 9.5, slope: 0.68, area: 890, confidence: 0.94 }
        },
      ]
    };
    setDamageAnalysis(mockAnalysis);
    
    // Step 4: Ready
    setDroneStatus('ready');
    
    // Auto-enable overlays when analysis is ready
    setShowDamageOverlays(true);
    
    // Auto-open 3D modal
    setTimeout(() => setShow3DModal(true), 500);
  };

  // Get status message for drone panel
  const getDroneStatusMessage = () => {
    switch(droneStatus) {
      case 'idle': return 'Ready to scan';
      case 'uploading': return 'Uploading drone imagery...';
      case 'generating': return 'Generating 3D terrain model...';
      case 'analyzing': return 'Analyzing damage zones...';
      case 'ready': return '3D model ready!';
      default: return 'Unknown status';
    }
  };

  return (
    <ProtectedRoute requiredPermissions={['canViewMap']}>
      <div className="min-h-screen bg-slate-900">
        <Navigation />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <MapPin className="w-8 h-8 text-blue-500" />
              Live Map View with 3D Terrain
            </h1>
            <p className="text-slate-400">Real-time first responder locations and drone-generated 3D damage assessment</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <Users className="w-8 h-8 text-white" />
                <Activity className="w-5 h-5 text-blue-200" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{firstResponders.length}</div>
              <p className="text-blue-100 text-sm">Total Responders</p>
            </div>

            <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <Users className="w-8 h-8 text-white" />
                <div className="bg-green-500 w-3 h-3 rounded-full animate-pulse"></div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{activeCount}</div>
              <p className="text-green-100 text-sm">Active Units</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <Users className="w-8 h-8 text-white" />
                <div className="bg-yellow-500 w-3 h-3 rounded-full"></div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{standbyCount}</div>
              <p className="text-yellow-100 text-sm">Standby Units</p>
            </div>
          </div>

          {/* Drone 3D Control Panel */}
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 shadow-lg mb-6 border border-purple-500 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-purple-500 p-3 rounded-lg">
                  {droneStatus === 'ready' ? (
                    <Box className="w-6 h-6 text-white" />
                  ) : droneStatus !== 'idle' ? (
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  ) : (
                    <Camera className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Drone 3D Terrain Analysis</h3>
                  <p className="text-purple-100 text-sm">{getDroneStatusMessage()}</p>
                </div>
              </div>
              <div className="flex gap-3">
                {droneStatus === 'idle' && (
                  <button
                    onClick={simulateDroneAnalysis}
                    className="px-6 py-3 bg-white text-purple-700 rounded-lg font-semibold hover:bg-purple-50 transition-colors flex items-center gap-2"
                  >
                    <Camera className="w-5 h-5" />
                    Start Drone Scan
                  </button>
                )}
                {droneStatus === 'ready' && (
                  <>
                    <button
                      onClick={() => setShow3DModal(true)}
                      className="px-6 py-3 bg-white text-purple-700 rounded-lg font-semibold hover:bg-purple-50 transition-colors flex items-center gap-2"
                    >
                      <Box className="w-5 h-5" />
                      View 3D Model
                    </button>
                    <button
                      onClick={() => setShowImageGallery(true)}
                      className="px-6 py-3 bg-white text-purple-700 rounded-lg font-semibold hover:bg-purple-50 transition-colors flex items-center gap-2"
                    >
                      <Camera className="w-5 h-5" />
                      View Images
                    </button>
                    <button
                      onClick={() => setShowDamageOverlays(!showDamageOverlays)}
                      className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                        showDamageOverlays 
                          ? 'bg-white text-purple-700 hover:bg-purple-50' 
                          : 'bg-purple-800 text-white hover:bg-purple-900'
                      }`}
                    >
                      <Layers className="w-5 h-5" />
                      {showDamageOverlays ? 'Hide' : 'Show'} Overlays
                    </button>
                    <button
                      onClick={() => {
                        setDroneStatus('idle');
                        setDamageAnalysis(null);
                        setModelUrl('');
                        setShowDamageOverlays(false);
                      }}
                      className="px-4 py-3 bg-purple-800 text-white rounded-lg font-medium hover:bg-purple-900 transition-colors"
                    >
                      Reset
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Progress bar during processing */}
            {droneStatus !== 'idle' && droneStatus !== 'ready' && (
              <div className="mt-4">
                <div className="w-full bg-purple-800 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-white h-full transition-all duration-500 rounded-full"
                    style={{ 
                      width: droneStatus === 'uploading' ? '33%' : 
                             droneStatus === 'generating' ? '66%' : 
                             droneStatus === 'analyzing' ? '90%' : '100%'
                    }}
                  />
                </div>
              </div>
            )}

            {/* Damage zones summary when ready */}
            {droneStatus === 'ready' && damageAnalysis && (
              <div className="mt-4 flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2 text-purple-100">
                  <div className="w-3 h-3 bg-blue-400 rounded"></div>
                  <span>Flood: {damageAnalysis.features.filter((f: any) => f.properties.damageType === 'flood').length}</span>
                </div>
                <div className="flex items-center gap-2 text-purple-100">
                  <div className="w-3 h-3 bg-orange-400 rounded"></div>
                  <span>Collapse: {damageAnalysis.features.filter((f: any) => f.properties.damageType === 'collapse').length}</span>
                </div>
                <div className="flex items-center gap-2 text-purple-100">
                  <div className="w-3 h-3 bg-yellow-400 rounded"></div>
                  <span>Debris: {damageAnalysis.features.filter((f: any) => f.properties.damageType === 'debris').length}</span>
                </div>
                <div className="flex items-center gap-2 text-purple-100">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span>Fire: {damageAnalysis.features.filter((f: any) => f.properties.damageType === 'fire').length}</span>
                </div>
              </div>
            )}
          </div>
                {/* ONE-CLICK DEMO BUTTON – only visible in development */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="mb-6">
                    <button
                      onClick={startAmbulance7Journey}
                      className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-2xl flex items-center gap-3"
                    >
                      🚨 START LIVE INCIDENT DEMO (Ambulance 7 En Route)
                    </button>
                  </div>
                )}

          {/* Map and Responders Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Map Section */}
            <div className="lg:col-span-2 bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 relative z-0">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  Responder Locations
                  {showDamageOverlays && <span className="text-sm text-purple-400">(with damage overlays)</span>}
                </h2>
                {droneStatus === 'ready' && (
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Layers className="w-4 h-4" />
                    <span>{damageAnalysis?.features?.length || 0} damage zones detected</span>
                  </div>
                )}
              </div>
              <div className="h-[500px] rounded-lg overflow-hidden">
              <div className="h-[500px] rounded-lg overflow-hidden relative"> {/* ← Add "relative" here */}
                <ResponderMap 
                  responders={filteredResponders}
                  damageAnalysis={damageAnalysis}
                  showDamageOverlays={showDamageOverlays}
                />
                
                {/* LIVE EN-ROUTE TRACKER FLOATING CARD */}
                <LiveResponderTracker />
              </div>
              </div>
            </div>

            {/* Responders List */}
            <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 relative z-0">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                Responder Details
              </h2>

              {/* Filters */}
              <div className="space-y-3 mb-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search responders..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Type Filter */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilterType('all')}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filterType === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilterType('Fire')}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filterType === 'Fire' ? 'bg-orange-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    Fire
                  </button>
                  <button
                    onClick={() => setFilterType('Police')}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filterType === 'Police' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    Police
                  </button>
                </div>

                {/* Status Filter */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilterStatus('all')}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filterStatus === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilterStatus('active')}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filterStatus === 'active' ? 'bg-green-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => setFilterStatus('standby')}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filterStatus === 'standby' ? 'bg-yellow-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    Standby
                  </button>
                </div>
              </div>

              {/* Responders List */}
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {filteredResponders.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No responders match your filters</p>
                  </div>
                ) : (
                  filteredResponders.map(responder => (
                    <div key={responder.id} className="bg-slate-700 rounded-lg p-4 hover:bg-slate-650 transition">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-semibold text-white">{responder.name}</div>
                          <div className="text-xs text-slate-400">{responder.id}</div>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          responder.type === 'Fire' ? 'bg-orange-600 text-white' : 'bg-blue-600 text-white'
                        }`}>
                          {responder.type}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-300 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {responder.location}
                        </span>
                        <StatusBadge status={responder.status} size="sm" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Modal */}
      {show3DModal && modelUrl && (
        <Modal3D 
          modelUrl={modelUrl}
          damageAnalysis={damageAnalysis}
          onClose={() => setShow3DModal(false)}
        />
      )}

      {/* Image Gallery Modal */}
      {showImageGallery && (
        <GalleryModal 
          onClose={() => setShowImageGallery(false)}
        />
      )}
    </ProtectedRoute>
  );
}
