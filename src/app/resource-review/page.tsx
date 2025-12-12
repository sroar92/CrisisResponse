'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, Clock } from 'lucide-react';
import {
  getResourceRequests,
  approveResourceRequest,
  denyResourceRequest,
  onRequestDataChange,
  type ResourceRequest,
} from '../../lib/resourceRequestStore';

export default function ResourceReviewPage() {
  const [requests, setRequests] = useState<ResourceRequest[]>([]);

  useEffect(() => {
    setRequests(getResourceRequests());
    const unsubscribe = onRequestDataChange((updated) => setRequests(updated));
    return () => unsubscribe();
  }, []);

  const handleApprove = (id: string) => {
    approveResourceRequest(id);
    alert('✅ Resource request approved and added to hospital inventory!');
  };

  const handleDeny = (id: string) => {
    denyResourceRequest(id);
    alert('❌ Resource request denied.');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'critical':
        return 'bg-red-600 text-white';
      case 'high':
        return 'bg-orange-600 text-white';
      default:
        return 'bg-blue-600 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link 
          href="/dashboard"
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700 space-y-5">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-purple-400">Resource Requests Review</h1>
            <p className="text-slate-400">
              Review and approve or deny pending resource requests from hospitals.
            </p>
          </div>

          {requests.length === 0 ? (
            <div className="bg-slate-700 rounded-xl p-12 text-center border border-slate-600">
              <Clock className="w-16 h-16 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-400 text-lg font-medium mb-2">No Pending Requests</p>
              <p className="text-slate-500 text-sm">
                All resource requests have been processed.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((r) => (
                <div
                  key={r.id}
                  className="bg-slate-700 border border-slate-600 p-5 rounded-xl hover:bg-slate-650 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-semibold text-white">
                          {r.hospitalName}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(r.priority)}`}>
                          {r.priority.toUpperCase()}
                        </span>
                      </div>

                      <div className="space-y-2 text-slate-300">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500">Resource:</span>
                          <span className="font-semibold text-emerald-400">
                            {r.resourceType}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500">Quantity:</span>
                          <span className="font-semibold text-white">
                            {r.quantity}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500">Requested:</span>
                          <span className="text-slate-400 text-sm">
                            {new Date(r.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleApprove(r.id)}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleDeny(r.id)}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        Deny
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Summary */}
          {requests.length > 0 && (
            <div className="bg-slate-700 border border-slate-600 p-4 rounded-xl">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Total Pending Requests:</span>
                <span className="text-white font-bold text-lg">{requests.length}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}