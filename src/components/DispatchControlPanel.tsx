// components/DispatchControlPanel.tsx
'use client';

import React, { useState } from 'react';
import { Radio, Truck, Ambulance, FireExtinguisher, MapPin, Clock, AlertCircle, CheckCircle, Navigation } from 'lucide-react';

interface Unit {
  id: string;
  type: 'ambulance' | 'fire' | 'police';
  callSign: string;
  status: 'available' | 'dispatched' | 'on-scene' | 'returning';
  location: string;
  assignedIncident?: string;
}

export default function DispatchControlPanel() {
  const [units, setUnits] = useState<Unit[]>([
    { id: '1', type: 'ambulance', callSign: 'AMB-101', status: 'available', location: 'Station 1' },
    { id: '2', type: 'ambulance', callSign: 'AMB-102', status: 'dispatched', location: 'En route to Main St', assignedIncident: 'INC-2024-001' },
    { id: '3', type: 'fire', callSign: 'ENG-201', status: 'available', location: 'Station 2' },
    { id: '4', type: 'fire', callSign: 'ENG-202', status: 'on-scene', location: '456 Oak Ave', assignedIncident: 'INC-2024-002' },
    { id: '5', type: 'police', callSign: 'PD-301', status: 'available', location: 'Precinct 3' },
    { id: '6', type: 'police', callSign: 'PD-302', status: 'returning', location: 'Returning to station', assignedIncident: 'INC-2024-003' },
  ]);

  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [dispatchLocation, setDispatchLocation] = useState('');

  const handleDispatch = (unitId: string) => {
    if (!dispatchLocation.trim()) {
      alert('Please enter a dispatch location');
      return;
    }

    setUnits(prev => prev.map(unit => 
      unit.id === unitId
        ? { 
            ...unit, 
            status: 'dispatched', 
            location: `En route to ${dispatchLocation}`,
            assignedIncident: `INC-2024-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
          }
        : unit
    ));

    setDispatchLocation('');
    setSelectedUnit(null);
  };

  const handleStatusChange = (unitId: string, newStatus: Unit['status']) => {
    setUnits(prev => prev.map(unit => 
      unit.id === unitId
        ? { 
            ...unit, 
            status: newStatus,
            ...(newStatus === 'available' && { assignedIncident: undefined })
          }
        : unit
    ));
  };

  const getUnitIcon = (type: string) => {
    switch (type) {
      case 'ambulance': return <Ambulance className="w-5 h-5" />;
      case 'fire': return <FireExtinguisher className="w-5 h-5" />;
      case 'police': return <Radio className="w-5 h-5" />;
      default: return <Truck className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-900/30 border-green-600 text-green-400';
      case 'dispatched': return 'bg-yellow-900/30 border-yellow-600 text-yellow-400';
      case 'on-scene': return 'bg-blue-900/30 border-blue-600 text-blue-400';
      case 'returning': return 'bg-purple-900/30 border-purple-600 text-purple-400';
      default: return 'bg-slate-700 border-slate-600 text-slate-400';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ambulance': return 'bg-red-600';
      case 'fire': return 'bg-orange-600';
      case 'police': return 'bg-blue-600';
      default: return 'bg-slate-600';
    }
  };

  const availableUnits = units.filter(u => u.status === 'available').length;
  const activeUnits = units.filter(u => u.status !== 'available').length;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Total Units</span>
            <Radio className="w-5 h-5 text-slate-400" />
          </div>
          <div className="text-3xl font-bold text-white">{units.length}</div>
        </div>

        <div className="bg-green-900/20 rounded-xl p-4 border border-green-600/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-400 text-sm">Available</span>
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-green-400">{availableUnits}</div>
        </div>

        <div className="bg-yellow-900/20 rounded-xl p-4 border border-yellow-600/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-yellow-400 text-sm">Active</span>
            <AlertCircle className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="text-3xl font-bold text-yellow-400">{activeUnits}</div>
        </div>
      </div>

      {/* Dispatch Form */}
      {selectedUnit && (
        <div className="bg-blue-900/20 border border-blue-600 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-400 mb-4">
            <Navigation className="w-5 h-5 inline mr-2" />
            Dispatch Unit: {units.find(u => u.id === selectedUnit)?.callSign}
          </h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={dispatchLocation}
              onChange={(e) => setDispatchLocation(e.target.value)}
              placeholder="Enter incident location..."
              className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={() => handleDispatch(selectedUnit)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Dispatch
            </button>
            <button
              onClick={() => setSelectedUnit(null)}
              className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Units List */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Radio className="w-5 h-5 text-blue-400" />
          Active Units
        </h2>

        <div className="space-y-3">
          {units.map((unit) => (
            <div
              key={unit.id}
              className={`rounded-lg border-2 p-4 transition-all ${getStatusColor(unit.status)}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`${getTypeColor(unit.type)} p-2 rounded-lg text-white`}>
                    {getUnitIcon(unit.type)}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{unit.callSign}</h3>
                    <p className="text-sm text-slate-400 capitalize">{unit.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(unit.status)}`}>
                    {unit.status}
                  </span>
                </div>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>{unit.location}</span>
                </div>
                {unit.assignedIncident && (
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <AlertCircle className="w-4 h-4 text-slate-400" />
                    <span>Incident: {unit.assignedIncident}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {unit.status === 'available' && (
                  <button
                    onClick={() => setSelectedUnit(unit.id)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
                  >
                    <Navigation className="w-4 h-4 inline mr-1" />
                    Dispatch
                  </button>
                )}
                {unit.status === 'dispatched' && (
                  <button
                    onClick={() => handleStatusChange(unit.id, 'on-scene')}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
                  >
                    Mark On-Scene
                  </button>
                )}
                {unit.status === 'on-scene' && (
                  <button
                    onClick={() => handleStatusChange(unit.id, 'returning')}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
                  >
                    Mark Returning
                  </button>
                )}
                {unit.status === 'returning' && (
                  <button
                    onClick={() => handleStatusChange(unit.id, 'available')}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
                  >
                    Mark Available
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
        <p className="text-sm text-blue-300">
          <Clock className="w-4 h-4 inline mr-1" />
          Real-time unit tracking and status updates. Click on available units to dispatch them to incidents.
        </p>
      </div>
    </div>
  );
}