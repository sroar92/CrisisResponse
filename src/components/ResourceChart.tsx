'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ResourceChartData } from '../lib/types';

interface ResourceChartProps {
  data: Array<{ name: string; value: number; status: string }>;
}

export default function ResourceChart({ data }: ResourceChartProps) {
  const COLORS: Record<string, string> = {
    available: '#10b981',
    'en-route': '#f59e0b',
    'on-scene': '#ef4444',
    standby: '#6366f1',
    active: '#f59e0b'
  };

  // Helper function with type safety
  const getColor = (status: string): string => {
    return COLORS[status] || '#6b7280'; // Fallback to gray
  };

  return (
    <div className="bg-slate-800 rounded-lg p-5 shadow-xl border border-slate-700">
      <h3 className="text-lg font-semibold mb-4">Resource Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(entry) => `${entry.name}: ${entry.value}`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.status)} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}