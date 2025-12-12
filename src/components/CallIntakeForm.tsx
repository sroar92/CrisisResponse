// components/CallIntakeForm.tsx
'use client';

import React, { useState } from 'react';
import { Phone, MapPin, AlertCircle, User, MessageSquare, Flame, Shield, Heart, Siren } from 'lucide-react';

export default function CallIntakeForm() {
  const [formData, setFormData] = useState({
    callerPhone: '',
    callerName: '',
    location: '',
    emergencyType: 'medical' as 'medical' | 'fire' | 'police' | 'rescue' | 'hazmat' | 'other',
    description: '',
    severity: 'medium' as 'critical' | 'high' | 'medium' | 'low',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setSuccess(true);
      setIsSubmitting(false);
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setFormData({
          callerPhone: '',
          callerName: '',
          location: '',
          emergencyType: 'medical',
          description: '',
          severity: 'medium',
        });
        setSuccess(false);
      }, 2000);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const emergencyTypes = [
    { value: 'medical', label: 'Medical Emergency', icon: Heart, color: 'text-red-400' },
    { value: 'fire', label: 'Fire', icon: Flame, color: 'text-orange-400' },
    { value: 'police', label: 'Police', icon: Shield, color: 'text-blue-400' },
    { value: 'rescue', label: 'Rescue', icon: AlertCircle, color: 'text-yellow-400' },
    { value: 'hazmat', label: 'Hazmat', icon: AlertCircle, color: 'text-purple-400' },
    { value: 'other', label: 'Other', icon: Siren, color: 'text-slate-400' },
  ];

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <Phone className="w-6 h-6 text-red-400" />
          911 Emergency Call Intake
        </h2>
        <p className="text-slate-400 text-sm">Record incoming emergency call details</p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 bg-green-900/30 border border-green-600 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-green-400" />
          <div>
            <h3 className="text-green-400 font-semibold">Call Received Successfully</h3>
            <p className="text-green-300 text-sm">Incident created and units notified</p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Caller Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white border-b border-slate-700 pb-2">
            Caller Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
                Caller Phone *
              </label>
              <input
                type="tel"
                name="callerPhone"
                value={formData.callerPhone}
                onChange={handleChange}
                placeholder="(555) 123-4567"
                required
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Caller Name
              </label>
              <input
                type="text"
                name="callerName"
                value={formData.callerName}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Emergency Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white border-b border-slate-700 pb-2">
            Emergency Details
          </h3>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Location *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="123 Main St, City, State"
              required
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Emergency Type *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {emergencyTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, emergencyType: type.value as any }))}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.emergencyType === type.value
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mx-auto mb-1 ${
                      formData.emergencyType === type.value ? 'text-white' : type.color
                    }`} />
                    <span className="text-xs font-medium">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Severity *
            </label>
            <select
              name="severity"
              value={formData.severity}
              onChange={handleChange}
              required
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="critical">Critical - Life Threatening</option>
              <option value="high">High - Serious</option>
              <option value="medium">Medium - Urgent</option>
              <option value="low">Low - Non-Emergency</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <MessageSquare className="w-4 h-4 inline mr-1" />
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the emergency situation in detail..."
              required
              rows={4}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing Call...
            </>
          ) : (
            <>
              <Phone className="w-5 h-5" />
              Dispatch Emergency Response
            </>
          )}
        </button>
      </form>

      {/* Info Box */}
      <div className="mt-6 bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
        <p className="text-sm text-blue-300">
          <AlertCircle className="w-4 h-4 inline mr-1" />
          All calls are logged and tracked. Emergency units will be automatically notified based on location and type.
        </p>
      </div>
    </div>
  );
}