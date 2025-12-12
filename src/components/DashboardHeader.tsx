'use client';

import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import Link from 'next/link';

export default function DashboardHeader({ alertCount = 0 }: { alertCount?: number }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mb-6 flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold mb-1">Crisis Management Dashboard</h1>
        <p className="text-slate-400">Real-time coordination and monitoring</p>
      </div>
      <div className="flex items-center gap-4">
        {/* Alert Bell */}
        <Link href="/alerts" className="relative">
          <Bell className="w-6 h-6 text-slate-400 hover:text-white transition" />
          {alertCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {alertCount}
            </span>
          )}
        </Link>

        {/* Clock */}
        <div className="text-right">
          <div className="text-2xl font-mono">{currentTime.toLocaleTimeString()}</div>
          <div className="text-slate-400">{currentTime.toLocaleDateString()}</div>
        </div>
      </div>
    </div>
  );
}