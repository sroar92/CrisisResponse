// components/DroneControl.tsx
'use client';

import { useState } from 'react';
import { Camera, Image as ImageIcon, Box, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import Modal3D from './Modal3D';
import GalleryModal from './GalleryModal';
import { runDroneReconnaissance, getDamageSummary, type DamageAnalysis, type DroneModel } from '../lib/droneService';

export type DroneStatus = 'idle' | 'uploading' | 'generating' | 'analyzing' | 'ready' | 'error';

interface DroneControlProps {
  onStatusChange?: (status: DroneStatus) => void;
  onAnalysisComplete?: (analysis: DamageAnalysis) => void;
}

export default function DroneControl({ onStatusChange, onAnalysisComplete }: DroneControlProps) {
  const [droneStatus, setDroneStatus] = useState<DroneStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [modelUrl, setModelUrl] = useState<string>('');
  const [damageAnalysis, setDamageAnalysis] = useState<DamageAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [show3DModal, setShow3DModal] = useState(false);
  const [showImageGallery, setShowImageGallery] = useState(false);

  const handleDroneRecon = async () => {
    if (droneStatus !== 'idle') return;
    
    setError(null);
    setProgress(0);

    try {
      const result = await runDroneReconnaissance('demo-mission', (status, prog) => {
        setDroneStatus(status as DroneStatus);
        setProgress(prog);
        if (onStatusChange) onStatusChange(status as DroneStatus);
      });

      setModelUrl(result.model.modelUrl);
      setDamageAnalysis(result.analysis);
      
      if (onAnalysisComplete) {
        onAnalysisComplete(result.analysis);
      }

      // Auto-open 3D modal
      setTimeout(() => setShow3DModal(true), 500);
      
    } catch (err) {
      console.error('Drone recon error:', err);
      setError('Failed to complete drone reconnaissance. Please try again.');
      setDroneStatus('error');
      if (onStatusChange) onStatusChange('error');
    }
  };

  const getStatusIcon = () => {
    switch (droneStatus) {
      case 'idle':
        return <Camera className="w-5 h-5" />;
      case 'uploading':
      case 'generating':
      case 'analyzing':
        return <Loader2 className="w-5 h-5 animate-spin" />;
      case 'ready':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
    }
  };

  const getStatusText = () => {
    switch (droneStatus) {
      case 'idle':
        return 'Ready for reconnaissance';
      case 'uploading':
        return 'Processing drone images...';
      case 'generating':
        return 'Generating 3D terrain model...';
      case 'analyzing':
        return 'Analyzing damage patterns...';
      case 'ready':
        return 'Analysis complete';
      case 'error':
        return 'Error occurred';
    }
  };

  const getStatusColor = () => {
    switch (droneStatus) {
      case 'idle':
        return 'bg-slate-700';
      case 'uploading':
      case 'generating':
      case 'analyzing':
        return 'bg-blue-600';
      case 'ready':
        return 'bg-green-600';
      case 'error':
        return 'bg-red-600';
    }
  };

  const summary = damageAnalysis ? getDamageSummary(damageAnalysis) : null;

  return (
    <>
      <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Drone Reconnaissance</h3>
            <p className="text-sm text-slate-400">Aerial damage assessment</p>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            {getStatusIcon()}
            <span className="text-sm text-slate-300">{getStatusText()}</span>
          </div>
          
          {/* Progress Bar */}
          {(droneStatus !== 'idle' && droneStatus !== 'error') && (
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${getStatusColor()}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-900/30 border border-red-600 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-200">{error}</p>
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleDroneRecon}
          disabled={droneStatus !== 'idle' && droneStatus !== 'error'}
          className={`w-full py-3 rounded-lg font-semibold transition-all ${
            droneStatus === 'idle' || droneStatus === 'error'
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
              : 'bg-slate-600 cursor-not-allowed text-slate-400'
          }`}
        >
          {droneStatus === 'idle' ? (
            <>🚁 Start Drone Reconnaissance</>
          ) : droneStatus === 'error' ? (
            <>🔄 Retry Reconnaissance</>
          ) : (
            <>{droneStatus.toUpperCase()}...</>
          )}
        </button>

        {/* Results Section */}
        {droneStatus === 'ready' && summary && (
          <div className="mt-4 space-y-3">
            {/* Summary Stats */}
            <div className="bg-slate-700/50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-white mb-3">Damage Assessment</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-slate-400">Total Areas</p>
                  <p className="text-lg font-bold text-white">{summary.total}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Avg Severity</p>
                  <p className="text-lg font-bold text-white">{summary.averageSeverity.toFixed(1)}/10</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">High Priority</p>
                  <p className="text-lg font-bold text-red-400">{summary.highSeverity}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Medium Priority</p>
                  <p className="text-lg font-bold text-orange-400">{summary.mediumSeverity}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setShow3DModal(true)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Box className="w-4 h-4" />
                View 3D Model
              </button>
              <button
                onClick={() => setShowImageGallery(true)}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <ImageIcon className="w-4 h-4" />
                View Images
              </button>
            </div>

            {/* Damage Type Breakdown */}
            <div className="bg-slate-700/50 rounded-lg p-3">
              <h4 className="text-xs font-semibold text-slate-300 mb-2">Damage Types</h4>
              <div className="space-y-1">
                {Object.entries(summary.byType).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 capitalize">{type}</span>
                    <span className="text-white font-semibold">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {show3DModal && modelUrl && (
        <Modal3D
          modelUrl={modelUrl}
          damageAnalysis={damageAnalysis}
          onClose={() => setShow3DModal(false)}
        />
      )}

      {showImageGallery && (
        <GalleryModal onClose={() => setShowImageGallery(false)} />
      )}
    </>
  );
}