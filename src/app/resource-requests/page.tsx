'use client';

import React, { useState, useMemo } from 'react';
import { Package, Send, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getHospitalData } from '../../lib/hospitalDataStore';
import { addResourceRequest } from '../../lib/resourceRequestStore';

export default function ResourceRequestsPage() {
  const hospitals = getHospitalData();

  // Dynamically detect valid resource types from hospital data
  const resourceOptions = useMemo(() => {
    if (hospitals.length === 0) {
      return ['Beds', 'ICU', 'Ventilators', 'Oxygen Cylinders', 'PPE Kits', 'Medical Staff'];
    }

    const disallowed = ['id', 'name', 'hospitalName', 'timestamp', 'lastUpdated', 'totalBeds'];
    const keys = new Set<string>();

    hospitals.forEach((hosp) => {
      Object.keys(hosp).forEach((key) => {
        if (!disallowed.includes(key)) {
          keys.add(key);
        }
      });
    });

    // Format the field names properly
    return Array.from(keys)
      .map((k) =>
        k
          .replace(/^available/i, '') // remove "available" prefix
          .replace(/([A-Z])/g, ' $1') // space out camelCase
          .replace(/\s+/g, ' ')
          .trim()
          .replace(/^./, (s) => s.toUpperCase()) // capitalize
      )
      .filter((name) => !['Last Updated', 'Total Beds'].includes(name));
  }, [hospitals]);

  const [formData, setFormData] = useState({
    hospitalName: '',
    resourceType: '',
    quantity: '',
    priority: 'Normal',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addResourceRequest({
      hospitalName: formData.hospitalName,
      resourceType: formData.resourceType,
      quantity: Number(formData.quantity),
      priority: formData.priority,
    });

    alert(`✅ Resource request submitted successfully!`);

    setFormData({
      hospitalName: '',
      resourceType: '',
      quantity: '',
      priority: 'Normal',
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <Link 
          href="/dashboard"
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="flex items-center mb-6">
            <Package className="w-7 h-7 text-emerald-400 mr-3" />
            <h1 className="text-2xl font-bold text-emerald-400">
              Request Additional Resources
            </h1>
          </div>

          <p className="text-slate-400 mb-6">
            Submit a new request for critical resources such as ventilators, oxygen, or staff.
            Requests will be reviewed by coordinators for approval and allocation.
          </p>

          {/* Request Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Hospital Selector */}
            <div>
              <label htmlFor="hospitalName" className="block text-slate-300 mb-2 font-medium">
                Hospital Name *
              </label>
              <select
                id="hospitalName"
                name="hospitalName"
                value={formData.hospitalName}
                onChange={handleChange}
                required
                className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Select Hospital</option>
                {hospitals.map((h) => (
                  <option key={h.id || h.name} value={h.name || h.hospitalName}>
                    {h.name || h.hospitalName}
                  </option>
                ))}
              </select>
            </div>

            {/* Resource Type Dropdown */}
            <div>
              <label htmlFor="resourceType" className="block text-slate-300 mb-2 font-medium">
                Resource Type *
              </label>
              <select
                id="resourceType"
                name="resourceType"
                value={formData.resourceType}
                onChange={handleChange}
                required
                className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Select Resource Type</option>
                {resourceOptions.length === 0 ? (
                  <option disabled>No resources available</option>
                ) : (
                  resourceOptions.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Quantity */}
            <div>
              <label htmlFor="quantity" className="block text-slate-300 mb-2 font-medium">
                Quantity Needed *
              </label>
              <input
                id="quantity"
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="e.g., 5"
                className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
                min="1"
              />
            </div>

            {/* Priority */}
            <div>
              <label htmlFor="priority" className="block text-slate-300 mb-2 font-medium">
                Priority Level *
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Normal">Normal</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
            >
              <Send className="w-5 h-5" /> Submit Request
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}