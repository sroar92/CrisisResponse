// Core types for Crisis Management Dashboard

export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low';
export type IncidentStatus = 'active' | 'responding' | 'resolved';
export type ResponderStatus = 'active' | 'standby' | 'unavailable';
export type ResponderType = 'Fire' | 'Police' | 'Medical' | 'EMS';
export type AlertType = 'earthquake' | 'flood' | 'fire' | 'hurricane' | 'tornado' | 'amber' | 'silver' | 'other';
export type AlertSeverity = 'extreme' | 'severe' | 'moderate' | 'minor';
export type ResourceStatus = 'available' | 'en-route' | 'on-scene' | 'standby' | 'active';

// Coordinates interface
export interface Coordinates {
  lat: number;
  lng: number;
}

// Ambulance Type (from your actual code)
export interface AmbulanceType {
  id: string;
  status: 'available' | 'en-route' | 'on-scene';
  location: string;
  lastUpdate: string;
  coords?: Coordinates;
  vehicleId?: string;
  medicalEquipment?: string[];
  paramedics?: number;
  patientCapacity?: number;
}

// Hospital Type (from your actual code)
export interface HospitalType {
  id: string;
  name: string;
  capacity: number;
  available: number;
  emergencyWait: string;
  coords?: Coordinates;
  specialties?: string[];
  distance?: string;
  status?: 'operational' | 'limited' | 'full';
}

// First Responder Type (from your actual code)
export interface FirstResponderType {
  id: string;
  name: string;
  type: 'Fire' | 'Police';
  status: 'active' | 'standby';
  location: string;
  coords?: { lat: number; lng: number };
  assignedIncident?: string;
  eta?: string;
  lastUpdate?: string;
}

// Timeline Event Type (from your actual code)
export interface TimelineEventType {
  id: number;
  time: string;
  event: string;
  type: 'alert' | 'dispatch' | 'complete' | 'update';
}

// Communication Type (from your actual code)
export interface CommunicationType {
  id: number;
  from: string;
  to: string;
  message: string;
  time: string;
  timestamp?: number;
  priority?: 'high' | 'normal' | 'low';
  read?: boolean;
}

// Dashboard Data Type (from your actual code)
export interface DashboardData {
  ambulances: AmbulanceType[];
  hospitals: HospitalType[];
  firstResponders: FirstResponderType[];
  timeline: TimelineEventType[];
  communications: CommunicationType[];
}

// Incident interface
export interface Incident {
  id: string;
  title: string;
  type: string;
  severity: SeverityLevel;
  status: IncidentStatus;
  location: string;
  coords: Coordinates;
  time: string;
  description?: string;
  assignedUnits?: string[];
  reportedBy?: string;
  estimatedResolution?: string;
}

// Resource data for charts
export interface ResourceChartData {
  name: string;
  value: number;
  status: ResourceStatus;
  available?: number;
  deployed?: number;
  total?: number;
}

// Government Alert (from AlertSystem component)
export interface GovernmentAlert {
  id: number;
  timestamp: string;
  message: string;
  priority: 'normal' | 'urgent';
  agency: string;
  type?: AlertType;
  severity?: AlertSeverity;
  area?: string;
  expires?: string;
  issued?: string;
  source?: string;
  instructions?: string;
  coords?: Coordinates;
  affectedPopulation?: number;
}

// Real-time update for websocket
export interface RealtimeUpdate {
  type: 'incident' | 'responder' | 'hospital' | 'alert' | 'ambulance' | 'communication';
  action: 'create' | 'update' | 'delete';
  data: Incident | FirstResponderType | HospitalType | GovernmentAlert | AmbulanceType | CommunicationType;
  timestamp: number;
}

// Dashboard metrics
export interface DashboardMetrics {
  activeIncidents: number;
  resolvedIncidents: number;
  activeResponders: number;
  availableBeds: number;
  criticalAlerts: number;
  averageResponseTime: string;
}

// Filter options for incidents
export interface IncidentFilters {
  severity?: SeverityLevel[];
  status?: IncidentStatus[];
  type?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  location?: string;
}

// User/Operator information
export interface Operator {
  id: string;
  name: string;
  role: 'dispatcher' | 'supervisor' | 'admin';
  station: string;
  status: 'online' | 'offline' | 'busy';
  lastActivity?: string;
}

// Notification
export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  actionUrl?: string;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// GeoLocation interface (used in responder pages)
export interface GeoLocation {
  lat: number | null;
  lng: number | null;
}

// Responder API Update
export interface ResponderUpdate {
  id: string;
  status: 'standby' | 'active';
  location: { lat: number; lng: number } | null;
  updatedAt: string;
}