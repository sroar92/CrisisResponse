// lib/alertStore.ts
// Client-side storage for multilingual alerts

export interface Alert {
  id: number;
  type: string;
  severity: 'extreme' | 'severe' | 'moderate' | 'minor';
  message: string;
  area: string;
  issued: string;
  expires: string;
  agency: string;
  instructions?: string;
  affectedPopulation?: number;
}

const STORAGE_KEY = 'emergency_alerts';
const DISMISSED_KEY = 'dismissed_alerts';
let listeners: Array<(alerts: Alert[]) => void> = [];

// Get all active alerts
export function getAlerts(): Alert[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const alerts = JSON.parse(stored);
      // Filter out expired alerts
      const now = new Date().getTime();
      return alerts.filter((alert: Alert) => new Date(alert.expires).getTime() > now);
    }
  } catch (e) {
    console.error('Error loading alerts:', e);
  }
  
  return [];
}

// Get dismissed alert IDs
function getDismissedAlertIds(): number[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(DISMISSED_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Error loading dismissed alerts:', e);
    return [];
  }
}

// Save dismissed alert IDs
function saveDismissedAlertIds(ids: number[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(DISMISSED_KEY, JSON.stringify(ids));
  } catch (e) {
    console.error('Error saving dismissed alerts:', e);
  }
}

// Get active (non-dismissed) alerts
export function getActiveAlerts(): Alert[] {
  const allAlerts = getAlerts();
  const dismissedIds = getDismissedAlertIds();
  return allAlerts.filter(alert => !dismissedIds.includes(alert.id));
}

// Save alerts
function saveAlerts(alerts: Alert[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
    notifyListeners(alerts);
  } catch (e) {
    console.error('Error saving alerts:', e);
  }
}

// Add a new alert
export function addAlert(alert: Omit<Alert, 'id'>): Alert {
  const alerts = getAlerts();
  
  // Generate unique ID using timestamp + random string
  const newAlert: Alert = {
    ...alert,
    id: Date.now() + Math.floor(Math.random() * 10000),
  };
  
  alerts.unshift(newAlert);
  saveAlerts(alerts);
  
  return newAlert;
}

// Dismiss an alert (doesn't delete, just marks as dismissed)
export function dismissAlert(alertId: number): void {
  const dismissedIds = getDismissedAlertIds();
  
  if (!dismissedIds.includes(alertId)) {
    dismissedIds.push(alertId);
    saveDismissedAlertIds(dismissedIds);
    
    // Notify listeners with updated active alerts
    notifyListeners(getAlerts());
  }
}

// Clear all dismissed alerts (show them again)
export function clearDismissedAlerts(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(DISMISSED_KEY);
  notifyListeners(getAlerts());
}

// Delete an alert permanently
export function deleteAlert(alertId: number): void {
  const alerts = getAlerts();
  const filtered = alerts.filter(a => a.id !== alertId);
  saveAlerts(filtered);
}

// Subscribe to alert changes
export function onAlertsChange(callback: (alerts: Alert[]) => void): () => void {
  listeners.push(callback);
  
  return () => {
    listeners = listeners.filter(l => l !== callback);
  };
}

// Notify all listeners
function notifyListeners(alerts: Alert[]): void {
  listeners.forEach(callback => callback(alerts));
}

// Clear all alerts
export function clearAllAlerts(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(DISMISSED_KEY);
  notifyListeners([]);
}

// Initialize with sample alerts if empty (for demo)
export function initializeSampleAlerts(): void {
  const existing = getAlerts();
  if (existing.length === 0) {
    addAlert({
      type: 'flood',
      severity: 'severe',
      message: 'Flash flood warning in effect. Avoid low-lying areas immediately.',
      area: 'Downtown and surrounding areas',
      issued: new Date().toISOString(),
      expires: new Date(Date.now() + 7200000).toISOString(), // 2 hours
      agency: 'National Weather Service',
      instructions: 'Seek higher ground immediately. Do not attempt to drive through flooded areas.',
      affectedPopulation: 25000
    });
  }
}