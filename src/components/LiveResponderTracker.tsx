// src/components/LiveResponderTracker.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Siren, Navigation, Clock } from 'lucide-react';

export default function LiveResponderTracker() {
  const [eta, setEta] = useState(7);
  const [status, setStatus] = useState<'En Route' | 'On Scene' | 'Arrived'>('En Route');

  // Simulate movement + countdown
  useEffect(() => {
    if (eta <= 0) {
      setStatus('On Scene');
      setTimeout(() => setStatus('Arrived'), 4000);
      return;
    }

    const timer = setInterval(() => {
      setEta(prev => Math.max(0, prev - 1));
    }, 9000); // ~1 minute real time = 9 seconds sim

    return () => clearInterval(timer);
  }, [eta]);

  return (
    <div className="absolute top-4 right-4 z-50 bg-slate-800/95 backdrop-blur-lg rounded-xl p-5 shadow-2xl border border-red-500/50 flex items-center gap-4 min-w-80 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="relative">
        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center animate-pulse">
          <Siren className="w-9 h-9 text-white" />
        </div>
        <div className="absolute -inset-1 bg-red-600 rounded-full animate-ping opacity-60"></div>
      </div>

      <div className="text-white">
        <div className="flex items-center gap-2 mb-1">
          <Navigation className="w-5 h-5 text-blue-400" />
          <span className="font-bold text-lg">Ambulance 7</span>
          <span className="text-xs bg-red-600/40 px-2 py-1 rounded-full animate-pulse">Priority 1</span>
        </div>
        <p className="text-sm text-slate-300">
          Chest pain • 123 Main St → Central Hospital
        </p>
        <div className="flex items-center gap-4 mt-3 text-sm">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${status === 'En Route' ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`}></div>
            <span className="font-medium text-emerald-400">{status}</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <Clock className="w-4 h-4" />
            <span>ETA: <span className="font-bold text-white text-lg">{eta === 0 ? '—' : `${eta} min`}</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}
