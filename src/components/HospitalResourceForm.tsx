// components/HospitalResourceForm.tsx
'use client';

import React, { useState } from 'react';
import { saveHospitalData, getHospitalData, HospitalData } from '../lib/hospitalDataStore';
import { Building2, CheckCircle } from 'lucide-react';

export default function HospitalResourceForm() {
  const [formData, setFormData] = useState({
    hospitalName: '',
    totalBeds: '',
    availableBeds: '',
    availableICU: '',
    ventilators: '',
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const hospitals = getHospitalData();
    const existingIndex = hospitals.findIndex(
      (h) => h.name.toLowerCase() === formData.hospitalName.trim().toLowerCase()
    );

    const newHospital: HospitalData = {
      name: formData.hospitalName.trim(),
      totalBeds: Number(formData.totalBeds),
      availableBeds: Number(formData.availableBeds),
      availableICU: Number(formData.availableICU),
      ventilators: Number(formData.ventilators),
      lastUpdated: new Date().toISOString(),
    };

    if (existingIndex !== -1) {
      // Update existing hospital
      hospitals[existingIndex] = {
        ...hospitals[existingIndex],
        ...newHospital,
      };
    } else {
      // Add new hospital with generated ID
      const newId = `HSP-${String(hospitals.length + 1).padStart(3, '0')}`;
      hospitals.push({
        ...newHospital,
        id: newId,
      });
    }

    saveHospitalData(hospitals);

    // Clear form
    setFormData({
      hospitalName: '',
      totalBeds: '',
      availableBeds: '',
      availableICU: '',
      ventilators: '',
    });

    // Show success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-emerald-600 p-2 rounded-lg">
          <Building2 className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-white">Add or Update Hospital</h2>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="mb-6 bg-green-900/30 border border-green-600 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-400">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Hospital data saved successfully!</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="hospitalName" className="block text-sm text-slate-300 mb-1">
            Hospital Name *
          </label>
          <input
            id="hospitalName"
            type="text"
            name="hospitalName"
            placeholder="e.g., Central Medical Center"
            value={formData.hospitalName}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label htmlFor="totalBeds" className="block text-sm text-slate-300 mb-1">
            Total Beds *
          </label>
          <input
            id="totalBeds"
            type="number"
            name="totalBeds"
            placeholder="e.g., 100"
            value={formData.totalBeds}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            required
            min="0"
          />
        </div>

        <div>
          <label htmlFor="availableBeds" className="block text-sm text-slate-300 mb-1">
            Available Beds *
          </label>
          <input
            id="availableBeds"
            type="number"
            name="availableBeds"
            placeholder="e.g., 25"
            value={formData.availableBeds}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            required
            min="0"
          />
        </div>

        <div>
          <label htmlFor="availableICU" className="block text-sm text-slate-300 mb-1">
            ICU Beds Available *
          </label>
          <input
            id="availableICU"
            type="number"
            name="availableICU"
            placeholder="e.g., 10"
            value={formData.availableICU}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            required
            min="0"
          />
        </div>

        <div>
          <label htmlFor="ventilators" className="block text-sm text-slate-300 mb-1">
            Ventilators Available *
          </label>
          <input
            id="ventilators"
            type="number"
            name="ventilators"
            placeholder="e.g., 15"
            value={formData.ventilators}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            required
            min="0"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-500 py-2 rounded-lg font-semibold text-white transition-colors"
        >
          Save Hospital Data
        </button>
      </form>
    </div>
  );
}