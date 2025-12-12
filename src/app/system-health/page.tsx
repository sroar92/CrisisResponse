'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import Navigation from '../../components/Navigation';
import { useAuth } from '../../lib/AuthContext';
import Link from 'next/link';
import {
  Activity,
  Server,
  Database,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Power,
  Shield,
  ArrowLeft,
  Zap,
  HardDrive,
} from 'lucide-react';

interface SystemStatus {
  status: 'healthy' | 'degraded' | 'down';
  [key: string]: any;
}

interface HealthCheck {
  timestamp: string;
  overall: 'healthy' | 'degraded' | 'down';
  systems: Record<string, SystemStatus>;
}

interface ServerState {
  primary: 'online' | 'degraded' | 'offline';
  backup: 'standby' | 'active' | 'offline';
  autoFailover: boolean;
  lastFailover?: string;
}

export default function SystemHealthPage() {
  const { user } = useAuth();
  const [healthData, setHealthData] = useState<HealthCheck | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  
  // Simulated server state
  const [serverState, setServerState] = useState<ServerState>({
    primary: 'online',
    backup: 'standby',
    autoFailover: true,
  });

  const [events, setEvents] = useState<Array<{ time: string; event: string; type: 'info' | 'warning' | 'success' | 'error' }>>([
    { time: new Date().toLocaleTimeString(), event: 'System health monitoring initialized', type: 'info' }
  ]);

  const fetchHealthData = async () => {
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      setHealthData(data);
      setLastUpdate(new Date());
      
      // Check if we need to simulate failover
      if (data.overall === 'degraded' && serverState.autoFailover && serverState.primary === 'online') {
        simulateFailover('degraded');
      }
    } catch (error) {
      console.error('Failed to fetch health data:', error);
      // Simulate complete failure
      if (serverState.autoFailover) {
        simulateFailover('offline');
      }
    } finally {
      setLoading(false);
    }
  };

  const simulateFailover = (reason: string) => {
    const now = new Date();
    setServerState(prev => ({
      ...prev,
      primary: reason === 'offline' ? 'offline' : 'degraded',
      backup: 'active',
      lastFailover: now.toISOString(),
    }));
    
    addEvent(`Auto-failover triggered: Primary server ${reason}, switching to backup`, 'warning');
  };

  const addEvent = (event: string, type: 'info' | 'warning' | 'success' | 'error') => {
    setEvents(prev => [
      { time: new Date().toLocaleTimeString(), event, type },
      ...prev.slice(0, 19) // Keep last 20 events
    ]);
  };

  useEffect(() => {
    fetchHealthData();
    
    if (autoRefresh) {
      const interval = setInterval(fetchHealthData, 10000); // Every 10 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const handleManualRefresh = () => {
    setLoading(true);
    fetchHealthData();
    addEvent('Manual health check initiated', 'info');
  };

  const handleForceBackup = () => {
    if (window.confirm('Force switch to backup server? This will take the primary server offline.')) {
      setServerState({
        primary: 'offline',
        backup: 'active',
        autoFailover: serverState.autoFailover,
        lastFailover: new Date().toISOString(),
      });
      addEvent('MANUAL OVERRIDE: Forced switch to backup server', 'warning');
    }
  };

  const handleResetSystems = () => {
    if (window.confirm('Reset all systems to normal operation?')) {
      setServerState({
        primary: 'online',
        backup: 'standby',
        autoFailover: true,
      });
      addEvent('MANUAL OVERRIDE: Systems reset to normal operation', 'success');
      fetchHealthData();
    }
  };

  const toggleAutoFailover = () => {
    setServerState(prev => ({
      ...prev,
      autoFailover: !prev.autoFailover,
    }));
    addEvent(`Auto-failover ${!serverState.autoFailover ? 'enabled' : 'disabled'}`, 'info');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'online':
      case 'active':
        return 'text-green-400 bg-green-900/30 border-green-500';
      case 'degraded':
      case 'standby':
        return 'text-yellow-400 bg-yellow-900/30 border-yellow-500';
      case 'down':
      case 'offline':
        return 'text-red-400 bg-red-900/30 border-red-500';
      default:
        return 'text-slate-400 bg-slate-900/30 border-slate-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'online':
      case 'active':
        return <CheckCircle className="w-5 h-5" />;
      case 'degraded':
      case 'standby':
        return <AlertTriangle className="w-5 h-5" />;
      case 'down':
      case 'offline':
        return <XCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  if (user?.role !== 'admin') {
    return (
      <ProtectedRoute requiredPermissions={['canAccessDashboard']}>
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <div className="text-center">
            <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
            <p className="text-slate-400 mb-4">Only administrators can access system health monitoring</p>
            <Link href="/dashboard" className="text-blue-400 hover:text-blue-300">
              â† Return to Dashboard
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredPermissions={['canAccessDashboard']}>
      <div className="min-h-screen bg-slate-900">
        <Navigation />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                  <Activity className="w-8 h-8 text-blue-400" />
                  System Health Monitor
                </h1>
                <p className="text-slate-400">Real-time system status and emergency override controls</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                    autoRefresh
                      ? 'bg-blue-600 hover:bg-blue-500 text-white'
                      : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                  }`}
                >
                  <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
                  {autoRefresh ? 'Auto' : 'Manual'}
                </button>
                <button
                  onClick={handleManualRefresh}
                  disabled={loading}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Last updated: {lastUpdate.toLocaleString()}
            </p>
          </div>

          {/* Overall Status */}
          <div className={`rounded-xl p-6 mb-6 border-l-4 ${
            healthData?.overall === 'healthy' ? 'bg-green-900/20 border-green-500' :
            healthData?.overall === 'degraded' ? 'bg-yellow-900/20 border-yellow-500' :
            'bg-red-900/20 border-red-500'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {healthData?.overall === 'healthy' ? (
                  <CheckCircle className="w-12 h-12 text-green-400" />
                ) : healthData?.overall === 'degraded' ? (
                  <AlertTriangle className="w-12 h-12 text-yellow-400" />
                ) : (
                  <XCircle className="w-12 h-12 text-red-400" />
                )}
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    System Status: {healthData?.overall?.toUpperCase() || 'CHECKING...'}
                  </h2>
                  <p className="text-slate-400">
                    {healthData?.overall === 'healthy' ? 'All systems operational' :
                     healthData?.overall === 'degraded' ? 'Some systems experiencing issues' :
                     'Critical systems down - Backup active'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Server Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Primary Server */}
            <div className={`bg-slate-800 border rounded-xl p-6 ${
              serverState.primary === 'online' ? 'border-green-500' :
              serverState.primary === 'degraded' ? 'border-yellow-500' :
              'border-red-500'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Server className={`w-8 h-8 ${
                    serverState.primary === 'online' ? 'text-green-400' :
                    serverState.primary === 'degraded' ? 'text-yellow-400' :
                    'text-red-400'
                  }`} />
                  <div>
                    <h3 className="text-lg font-semibold text-white">Primary Server</h3>
                    <p className="text-xs text-slate-400">Main system instance</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(serverState.primary)}`}>
                  {serverState.primary.toUpperCase()}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="text-white font-medium">{serverState.primary}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Load:</span>
                  <span className="text-white font-medium">
                    {serverState.primary === 'online' ? 'Normal' : serverState.primary === 'degraded' ? 'High' : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Backup Server */}
            <div className={`bg-slate-800 border rounded-xl p-6 ${
              serverState.backup === 'active' ? 'border-green-500' :
              serverState.backup === 'standby' ? 'border-blue-500' :
              'border-slate-500'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <HardDrive className={`w-8 h-8 ${
                    serverState.backup === 'active' ? 'text-green-400' :
                    serverState.backup === 'standby' ? 'text-blue-400' :
                    'text-slate-400'
                  }`} />
                  <div>
                    <h3 className="text-lg font-semibold text-white">Backup Server</h3>
                    <p className="text-xs text-slate-400">Failover instance</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(serverState.backup)}`}>
                  {serverState.backup.toUpperCase()}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="text-white font-medium">{serverState.backup}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Ready:</span>
                  <span className="text-white font-medium">Yes</span>
                </div>
              </div>
            </div>
          </div>

          {/* System Components */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-400" />
              System Components
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {healthData?.systems && Object.entries(healthData.systems).map(([key, system]) => (
                <div key={key} className={`border rounded-lg p-4 ${getStatusColor(system.status)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-white capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    {getStatusIcon(system.status)}
                  </div>
                  <div className="text-xs space-y-1">
                    {system.count !== undefined && (
                      <div className="text-slate-300">Count: {system.count}</div>
                    )}
                    {system.patientCount !== undefined && (
                      <div className="text-slate-300">Patients: {system.patientCount}</div>
                    )}
                    {system.transferCount !== undefined && (
                      <div className="text-slate-300">Transfers: {system.transferCount}</div>
                    )}
                    {system.pendingCount !== undefined && (
                      <div className="text-slate-300">Pending: {system.pendingCount}</div>
                    )}
                    {system.responderCount !== undefined && (
                      <div className="text-slate-300">Responders: {system.responderCount}</div>
                    )}
                    {system.error && (
                      <div className="text-red-300">Error: {system.error}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Override Controls */}
          <div className="bg-red-900/20 border-l-4 border-red-600 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-red-100 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Emergency Override Controls
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={serverState.autoFailover}
                    onChange={toggleAutoFailover}
                    className="w-5 h-5 text-blue-600 rounded"
                  />
                  <div>
                    <span className="text-white font-medium">Auto-Failover</span>
                    <p className="text-xs text-slate-400">Automatic backup activation</p>
                  </div>
                </label>
              </div>
              
              <button
                onClick={handleForceBackup}
                disabled={serverState.backup === 'active'}
                className="bg-orange-600 hover:bg-orange-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg p-4 transition-colors text-left"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Power className="w-5 h-5" />
                  <span className="font-medium">Force Backup Mode</span>
                </div>
                <p className="text-xs opacity-80">Switch to backup server</p>
              </button>

              <button
                onClick={handleResetSystems}
                className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg p-4 transition-colors text-left"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-5 h-5" />
                  <span className="font-medium">Reset All Systems</span>
                </div>
                <p className="text-xs opacity-80">Return to normal operation</p>
              </button>
            </div>
            {serverState.lastFailover && (
              <p className="text-yellow-300 text-sm mt-4">
                Last failover: {new Date(serverState.lastFailover).toLocaleString()}
              </p>
            )}
          </div>

          {/* Event Log */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              System Event Log
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {events.map((event, index) => (
                <div key={index} className={`border-l-2 pl-3 py-2 ${
                  event.type === 'success' ? 'border-green-500' :
                  event.type === 'warning' ? 'border-yellow-500' :
                  event.type === 'error' ? 'border-red-500' :
                  'border-blue-500'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-white text-sm">{event.event}</p>
                      <p className="text-xs text-slate-400 mt-1">{event.time}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      event.type === 'success' ? 'bg-green-900/50 text-green-400' :
                      event.type === 'warning' ? 'bg-yellow-900/50 text-yellow-400' :
                      event.type === 'error' ? 'bg-red-900/50 text-red-400' :
                      'bg-blue-900/50 text-blue-400'
                    }`}>
                      {event.type.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );}