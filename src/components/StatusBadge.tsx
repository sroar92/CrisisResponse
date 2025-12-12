import React from 'react';
import { CheckCircle, Activity, AlertCircle, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'available': 
      case 'standby': 
        return 'bg-green-500';
      case 'en-route': 
      case 'active': 
      case 'busy':
        return 'bg-yellow-500';
      case 'on-scene': 
        return 'bg-red-500';
      case 'offline':
      case 'unavailable':
        return 'bg-gray-500';
      default: 
        return 'bg-blue-500';
    }
  };

  const getStatusIcon = (status: string) => {
    const iconSize = size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
    
    switch(status.toLowerCase()) {
      case 'available': 
      case 'standby': 
        return <CheckCircle className={iconSize} />;
      case 'en-route': 
      case 'active': 
      case 'busy':
        return <Activity className={iconSize} />;
      case 'on-scene': 
        return <AlertCircle className={iconSize} />;
      default: 
        return <XCircle className={iconSize} />;
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm'
  };

  return (
    <div className={`flex items-center gap-1 ${getStatusColor(status)} ${sizeClasses[size]} rounded`}>
      {getStatusIcon(status)}
      <span className="capitalize font-medium">{status}</span>
    </div>
  );
}