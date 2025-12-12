'use client';

import React from 'react';
import PatientTransferPanel from '@/components/PatientTransferPanel';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PatientTransfersPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Back Button */}
        <Link 
          href="/dashboard"
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold mb-2 text-blue-400">
          Patient Transfer Management
        </h1>
        <p className="text-slate-400 mb-6">
          Hospital Information System (HIS) Integration - Seamless patient transfers between facilities
        </p>

        {/* Main Transfer Panel */}
        <PatientTransferPanel />
      </div>
    </div>
  );
}
