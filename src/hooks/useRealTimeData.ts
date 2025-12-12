'use client';

import { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import { DashboardData } from '../lib/types';

export const useRealTimeData = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData>({
    ambulances: [
      { id: 'AMB-001', status: 'available', location: 'Station 1', lastUpdate: '2 min ago' },
      { id: 'AMB-002', status: 'en-route', location: 'Main St & 5th Ave', lastUpdate: '30 sec ago' },
      { id: 'AMB-003', status: 'on-scene', location: 'City Park', lastUpdate: '1 min ago' },
      { id: 'AMB-004', status: 'available', location: 'Station 2', lastUpdate: '5 min ago' },
    ],
    hospitals: [
      { id: 'HSP-001', name: 'Central Medical', capacity: 85, available: 12, emergencyWait: '15 min' },
      { id: 'HSP-002', name: 'St. Mary\'s Hospital', capacity: 120, available: 8, emergencyWait: '22 min' },
      { id: 'HSP-003', name: 'Memorial Hospital', capacity: 95, available: 20, emergencyWait: '8 min' },
    ],
    firstResponders: [
      { id: 'FR-101', name: 'Unit Alpha', type: 'Fire', status: 'active', location: 'Downtown' },
      { id: 'FR-102', name: 'Unit Bravo', type: 'Police', status: 'active', location: 'North District' },
      { id: 'FR-103', name: 'Unit Charlie', type: 'Fire', status: 'standby', location: 'Station 3' },
      { id: 'FR-104', name: 'Unit Delta', type: 'Police', status: 'active', location: 'Highway 5' },
    ],
    timeline: [
      { id: 1, time: '14:32:15', event: 'Ambulance AMB-002 dispatched to Main St & 5th Ave', type: 'dispatch' },
      { id: 2, time: '14:30:08', event: '911 call received - Medical emergency reported', type: 'alert' },
      { id: 3, time: '14:28:45', event: 'Unit Alpha completed fire suppression', type: 'complete' },
      { id: 4, time: '14:25:12', event: 'Hospital capacity update - Memorial Hospital', type: 'update' },
    ],
    communications: [
      { id: 1, from: 'Dispatch', to: 'AMB-002', message: 'Proceeding to scene, ETA 4 minutes', time: '14:32:30' },
      { id: 2, from: 'Unit Alpha', to: 'Command', message: 'Fire under control, requesting medical support', time: '14:28:50' },
      { id: 3, from: 'Central Medical', to: 'Dispatch', message: 'ER bed available, standing by', time: '14:27:15' },
    ]
  });

  useEffect(() => {
    // Initialize socket connection
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
    const socketInstance = io(socketUrl, {
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    
    socketInstance.on('connect', () => {
      console.log('✅ Connected to real-time server');
      setLoading(false);
    });

    socketInstance.on('disconnect', () => {
      console.log('❌ Disconnected from real-time server');
    });

    // Listen for ambulance updates
    socketInstance.on('update:ambulances', (ambulances) => {
      setData(prev => ({ ...prev, ambulances }));
    });

    // Listen for hospital updates
    socketInstance.on('update:hospitals', (hospitals) => {
      setData(prev => ({ ...prev, hospitals }));
    });

    // Listen for first responder updates
    socketInstance.on('update:responders', (firstResponders) => {
      setData(prev => ({ ...prev, firstResponders }));
    });

    // Listen for new timeline events
    socketInstance.on('new:event', (event) => {
      setData(prev => ({
        ...prev,
        timeline: [event, ...prev.timeline].slice(0, 50) // Keep last 50 events
      }));
    });

    // Listen for new communications
    socketInstance.on('new:communication', (comm) => {
      setData(prev => ({
        ...prev,
        communications: [comm, ...prev.communications].slice(0, 50)
      }));
    });

    // Error handling
    socketInstance.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setLoading(false);
    });

    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return { data, socket, loading };
};