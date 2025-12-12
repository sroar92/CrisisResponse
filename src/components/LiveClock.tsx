'use client';

import { useState, useEffect } from 'react';

export default function LiveClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-right">
      <div className="text-2xl font-mono">{time.toLocaleTimeString()}</div>
      <div className="text-slate-400">{time.toLocaleDateString()}</div>
    </div>
  );
}