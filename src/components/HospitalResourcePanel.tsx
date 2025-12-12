// components/HospitalResourcePanel.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Building2, Bed, Activity, HeartPulse, Clock } from 'lucide-react';
import { getHospitalData, onHospitalDataChange, HospitalData } from '../lib/hospitalDataStore';

interface HospitalResourcePanelProps {
  data?: HospitalData[];
  compact?: boolean;
}

export default function HospitalResourcePanel({ data, compact = false }: HospitalResourcePanelProps) {
  const [hospitals, setHospitals] = useState<HospitalData[]>(data || getHospitalData());

  useEffect(() => {
    // If data prop is provided, use it (controlled component)
    if (data) {
      setHospitals(data);
      return;
    }

    // Otherwise, load from store and subscribe to changes
    setHospitals(getHospitalData());

    const unsubscribe = onHospitalDataChange((updatedData) => {
      setHospitals(updatedData);
    });

    return () => unsubscribe();
  }, [data]);

  const getCapacityColor = (available: number, total: number): string => {
    const percentage = (available / total) * 100;
    if (percentage <= 10) return 'text-red-400';
    if (percentage <= 30) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getCapacityBar = (available: number, total: number) => {
    const percentage = Math.min((available / total) * 100, 100);
    const colorClass = percentage <= 10 ? 'bg-red-500' : 
                       percentage <= 30 ? 'bg-yellow-500' : 'bg-green-500';
    
    return (
      <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
        <div 
          className={`h-full ${colorClass} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  };

  if (hospitals.length === 0) {
    return (
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 text-center">
        <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <p className="text-slate-400">No hospital data available</p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="space-y-3">
        {hospitals.map((hospital) => (
          <div
            key={hospital.id || hospital.name}
            className="bg-slate-800 rounded-lg border border-slate-700 p-4 hover:border-slate-600 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-white">{hospital.name}</h4>
              <span className={`text-lg font-bold ${getCapacityColor(hospital.availableBeds, hospital.totalBeds)}`}>
                {hospital.availableBeds}
              </span>
            </div>
            {getCapacityBar(hospital.availableBeds, hospital.totalBeds)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {hospitals.map((hospital) => {
        const bedPercentage = Math.round((hospital.availableBeds / hospital.totalBeds) * 100);
        
        return (
          <div
            key={hospital.id || hospital.name}
            className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-slate-600 transition-all"
          >
            {/* Hospital Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-3 rounded-lg">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{hospital.name}</h3>
                  <p className="text-sm text-slate-400">
                    Total Capacity: {hospital.totalBeds} beds
                  </p>
                </div>
              </div>
              
              {/* Status Indicator */}
              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                bedPercentage <= 10 ? 'bg-red-600 text-white' :
                bedPercentage <= 30 ? 'bg-yellow-600 text-white' :
                'bg-green-600 text-white'
              }`}>
                {bedPercentage <= 10 ? 'Critical' : bedPercentage <= 30 ? 'Limited' : 'Available'}
              </div>
            </div>

            {/* Resource Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* General Beds */}
              <div className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Bed className="w-5 h-5 text-blue-400" />
                  <span className="text-sm text-slate-400">General Beds</span>
                </div>
                <div className={`text-2xl font-bold ${getCapacityColor(hospital.availableBeds, hospital.totalBeds)}`}>
                  {hospital.availableBeds}
                </div>
                <div className="text-xs text-slate-500">of {hospital.totalBeds} total</div>
                <div className="mt-2">
                  {getCapacityBar(hospital.availableBeds, hospital.totalBeds)}
                </div>
              </div>

              {/* ICU Beds */}
              <div className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <HeartPulse className="w-5 h-5 text-red-400" />
                  <span className="text-sm text-slate-400">ICU Beds</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {hospital.availableICU}
                </div>
                <div className="text-xs text-slate-500">available</div>
              </div>

              {/* Ventilators */}
              <div className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-5 h-5 text-purple-400" />
                  <span className="text-sm text-slate-400">Ventilators</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {hospital.ventilators}
                </div>
                <div className="text-xs text-slate-500">available</div>
              </div>

              {/* Last Updated */}
              <div className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-slate-400" />
                  <span className="text-sm text-slate-400">Last Update</span>
                </div>
                <div className="text-sm text-white">
                  {new Date(hospital.lastUpdated).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
                <div className="text-xs text-slate-500">
                  {new Date(hospital.lastUpdated).toLocaleDateString([], { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}