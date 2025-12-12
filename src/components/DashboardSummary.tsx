// components/DashboardSummary.tsx
import { getHospitalData } from '../lib/hospitalDataStore';
import { Building2, Bed, AlertCircle } from 'lucide-react';

export function HospitalSummaryWidget() {
  const hospitals = getHospitalData();
  
  const totalAvailableBeds = hospitals.reduce((sum, h) => sum + h.availableBeds, 0);
  const totalICU = hospitals.reduce((sum, h) => sum + h.availableICU, 0);
  const criticalHospitals = hospitals.filter(h => 
    (h.availableBeds / h.totalBeds) < 0.1
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Bed className="w-5 h-5 text-blue-400" />
          <span className="text-slate-400 text-sm">Available Beds</span>
        </div>
        <div className="text-3xl font-bold text-white">{totalAvailableBeds}</div>
      </div>

      <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <span className="text-slate-400 text-sm">Critical Capacity</span>
        </div>
        <div className="text-3xl font-bold text-white">{criticalHospitals}</div>
      </div>

      <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Building2 className="w-5 h-5 text-green-400" />
          <span className="text-slate-400 text-sm">Total Hospitals</span>
        </div>
        <div className="text-3xl font-bold text-white">{hospitals.length}</div>
      </div>
    </div>
  );
}