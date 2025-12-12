// lib/resourceRequestStore.ts
// Client-side storage for resource requests

export interface ResourceRequest {
  id: string;
  hospitalName: string;
  resourceType: string;
  quantity: number;
  priority: string;
  status: 'pending' | 'approved' | 'denied';
  timestamp: string;
}

const STORAGE_KEY = 'resource_requests';
let listeners: Array<(data: ResourceRequest[]) => void> = [];

// Get all resource requests
export function getResourceRequests(): ResourceRequest[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Error loading resource requests:', e);
    return [];
  }
}

// Save resource requests to localStorage
function saveResourceRequests(requests: ResourceRequest[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
    notifyListeners(requests);
  } catch (e) {
    console.error('Error saving resource requests:', e);
  }
}

// Add a new resource request
export function addResourceRequest(
  request: Omit<ResourceRequest, 'id' | 'status' | 'timestamp'>
): void {
  const requests = getResourceRequests();
  
  const newRequest: ResourceRequest = {
    ...request,
    id: `REQ-${Date.now()}`,
    status: 'pending',
    timestamp: new Date().toISOString(),
  };
  
  requests.push(newRequest);
  saveResourceRequests(requests);
}

// Approve a resource request
export function approveResourceRequest(id: string): void {
  const requests = getResourceRequests();
  const index = requests.findIndex((r) => r.id === id);
  
  if (index !== -1) {
    requests[index].status = 'approved';
    
    // Update hospital data with approved resources
    const request = requests[index];
    updateHospitalResources(request);
    
    // Remove from pending requests
    requests.splice(index, 1);
    saveResourceRequests(requests);
  }
}

// Deny a resource request
export function denyResourceRequest(id: string): void {
  const requests = getResourceRequests();
  const index = requests.findIndex((r) => r.id === id);
  
  if (index !== -1) {
    requests[index].status = 'denied';
    
    // Remove from pending requests
    requests.splice(index, 1);
    saveResourceRequests(requests);
  }
}

// Update hospital resources when request is approved
function updateHospitalResources(request: ResourceRequest): void {
  // Import dynamically to avoid circular dependency
  if (typeof window === 'undefined') return;
  
  try {
    const { getHospitalData, saveHospitalData } = require('./hospitalDataStore');
    const hospitals = getHospitalData();
    
    const hospitalIndex = hospitals.findIndex(
      (h: any) => h.name === request.hospitalName || h.hospitalName === request.hospitalName
    );
    
    if (hospitalIndex !== -1) {
      const hospital = hospitals[hospitalIndex];
      
      // Map resource type to hospital field
      const resourceMap: Record<string, string> = {
        'Beds': 'availableBeds',
        'beds': 'availableBeds',
        'ICU': 'availableICU',
        'icu': 'availableICU',
        'Ventilators': 'ventilators',
        'ventilators': 'ventilators',
      };
      
      const fieldName = resourceMap[request.resourceType] || request.resourceType;
      
      if (fieldName in hospital) {
        hospital[fieldName] = (hospital[fieldName] || 0) + request.quantity;
        hospital.lastUpdated = new Date().toISOString();
        saveHospitalData(hospitals);
      }
    }
  } catch (e) {
    console.error('Error updating hospital resources:', e);
  }
}

// Subscribe to request data changes
export function onRequestDataChange(callback: (data: ResourceRequest[]) => void): () => void {
  listeners.push(callback);
  
  // Return unsubscribe function
  return () => {
    listeners = listeners.filter((l) => l !== callback);
  };
}

// Notify all listeners of data change
function notifyListeners(data: ResourceRequest[]): void {
  listeners.forEach((callback) => callback(data));
}

// Clear all requests (useful for testing)
export function clearResourceRequests(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  notifyListeners([]);
}