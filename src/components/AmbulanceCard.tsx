import React from 'react';
import { Ambulance } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { AmbulanceType } from '../lib/types';

interface AmbulanceCardProps {
  ambulances: AmbulanceType[];
}

export default function AmbulanceCard({ ambulances }: AmbulanceCardProps) {
  return (
    <div className="bg-slate-800 rounded-lg p-5 shadow-xl border border-slate-700">
      <div className="flex items-center mb-4">
        <Ambulance className="w-6 h-6 mr-2 text-blue-400" />
        <h2 className="text-xl font-semibold">Ambulances</h2>
        <span className="ml-auto bg-blue-600 px-3 py-1 rounded-full text-sm">
          {ambulances.length}
        </span>
      </div>
      <div className="space-y-3">
        {ambulances.map(amb => (
          <div key={amb.id} className="bg-slate-700 rounded p-3 hover:bg-slate-650 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">{amb.id}</span>
              <StatusBadge status={amb.status} />
            </div>
            <div className="text-sm text-slate-300">
              <div>📍 {amb.location}</div>
              <div className="text-slate-500 text-xs mt-1">
                Updated: {amb.lastUpdate}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}