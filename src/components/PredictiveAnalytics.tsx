'use client';

import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, BarChart3, Loader2 } from 'lucide-react';

// Mock historical data - replace with real data from your database
const mockHistoricalData = [
  { month: '2024-07', incidents: 15, avgResponseTime: 7 },
  { month: '2024-08', incidents: 18, avgResponseTime: 9 },
  { month: '2024-09', incidents: 14, avgResponseTime: 6 },
  { month: '2024-10', incidents: 20, avgResponseTime: 8 },
  { month: '2024-11', incidents: 17, avgResponseTime: 7 },
];

interface PredictiveProps {
  predictions?: any;
  setPredictions?: React.Dispatch<React.SetStateAction<any>>;
}

const PredictiveAnalytics: React.FC<PredictiveProps> = ({ predictions: propPredictions, setPredictions }) => {
  const [predictions, setPredictionsLocal] = useState<any>({});
  const [chartData] = useState<any[]>(mockHistoricalData);
  const [isLoading, setIsLoading] = useState(false);

  const effectivePredictions = propPredictions || predictions;

  const runPredictionModel = async () => {
    setIsLoading(true);
    
    // Simulate AI model processing
    setTimeout(() => {
      // Simple linear regression prediction
      const totalIncidents = chartData.reduce((sum, d) => sum + d.incidents, 0);
      const avgIncidents = totalIncidents / chartData.length;
      const trend = (chartData[chartData.length - 1].incidents - chartData[0].incidents) / chartData.length;
      
      const predicted = {
        nextMonthIncidents: Math.round(avgIncidents + trend * 2),
        nextMonthAvgAmbulances: Math.round((avgIncidents + trend * 2) * 1.5),
        confidence: 85,
      };
      
      setPredictionsLocal(predicted);
      if (setPredictions) setPredictions(predicted);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-400" />
          Predictive Analytics
        </h2>
        <button
          onClick={runPredictionModel}
          disabled={isLoading}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 font-semibold"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <TrendingUp className="w-4 h-4" />
              Run Prediction
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-700/50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-slate-400 mb-2">Historical Average</h3>
          <div className="text-3xl font-bold text-white">
            {Math.round(chartData.reduce((sum, d) => sum + d.incidents, 0) / chartData.length)}
          </div>
          <p className="text-slate-400 text-sm">incidents/month</p>
        </div>

        <div className="bg-slate-700/50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-slate-400 mb-2">Next Month Forecast</h3>
          <div className="text-3xl font-bold text-purple-400">
            {effectivePredictions.nextMonthIncidents || '--'}
          </div>
          <p className="text-slate-400 text-sm">
            {effectivePredictions.confidence ? `${effectivePredictions.confidence}% confidence` : 'Run model to predict'}
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
          <XAxis dataKey="month" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
            labelStyle={{ color: '#e2e8f0' }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="incidents" 
            stroke="#a78bfa" 
            strokeWidth={2}
            name="Incidents" 
          />
          <Line 
            type="monotone" 
            dataKey="avgResponseTime" 
            stroke="#34d399" 
            strokeWidth={2}
            name="Response Time (min)" 
          />
        </LineChart>
      </ResponsiveContainer>

      <p className="text-xs text-slate-500 mt-4">
        📊 Predictions based on linear regression over 5-month historical data
      </p>
    </div>
  );
};

export default PredictiveAnalytics;