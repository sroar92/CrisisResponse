'use client';

import React, { useEffect, useState } from 'react';
import { Building2, TrendingUp } from 'lucide-react';
import { getHospitalData } from '../lib/hospitalDataStore';

interface ResourceAllocationProps {
  predictions?: any;
}

const ResourceAllocation: React.FC<ResourceAllocationProps> = ({ predictions }) => {
  const [hospitals, setHospitals] = useState(getHospitalData());
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    // Calculate smart recommendations based on predictions and current capacity
    const predictedDemand = predictions?.nextMonthIncidents || 20;
    
    const scored = hospitals.map(h => {
      const capacityScore = (h.availableBeds || 0) / (h.totalBeds || 1);
      const icuScore = (h.availableICU || 0) / 10; // Normalize to 0-1
      const overallScore = (capacityScore * 0.6 + icuScore * 0.4) * 100;
      
      return {
        ...h,
        score: Math.round(overallScore),
        recommendation: overallScore > 70 ? 'Optimal' : overallScore > 40 ? 'Adequate' : 'At Risk'
      };
    }).sort((a, b) => b.score - a.score);

    setRecommendations(scored.slice(0, 5));
  }, [hospitals, predictions]);

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
        <Building2 className="w-5 h-5 text-emerald-400" />
        Smart Resource Allocation
      </h2>

      <div className="space-y-3">
        {recommendations.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <Building2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No hospital data available</p>
            <p className="text-sm">Add hospitals to see recommendations</p>
          </div>
        ) : (
          recommendations.map((hospital, index) => (
            <div 
              key={hospital.id}
              className="bg-slate-700/50 rounded-lg p-4 hover:bg-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-slate-600">#{index + 1}</span>
                  <span className="font-semibold text-white">{hospital.hospitalName || hospital.name}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  hospital.recommendation === 'Optimal' ? 'bg-emerald-600' :
                  hospital.recommendation === 'Adequate' ? 'bg-yellow-600' :
                  'bg-red-600'
                } text-white`}>
                  {hospital.recommendation}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-slate-400">Beds Available</p>
                  <p className="text-white font-semibold">{hospital.availableBeds || 0}</p>
                </div>
                <div>
                  <p className="text-slate-400">ICU Available</p>
                  <p className="text-white font-semibold">{hospital.availableICU || 0}</p>
                </div>
                <div>
                  <p className="text-slate-400">Capacity Score</p>
                  <p className="text-white font-semibold">{hospital.score}%</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 p-4 bg-blue-900/20 border border-blue-700/30 rounded-lg">
        <p className="text-sm text-blue-300">
          <TrendingUp className="w-4 h-4 inline mr-1" />
          Based on predicted demand: <span className="font-bold">{predictions?.nextMonthIncidents || '--'}</span> incidents next month
        </p>
      </div>

      <p className="text-xs text-slate-500 mt-3">
        🎯 Rankings based on available capacity and ICU beds
      </p>
    </div>
  );
};

export default ResourceAllocation;