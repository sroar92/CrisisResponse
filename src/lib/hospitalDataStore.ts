// lib/hospitalDataStore.ts
// Client-side storage for hospital resource data

export interface HospitalData {
  id?: string;
  name: string;
  hospitalName?: string; // alias for compatibility
  totalBeds: number;
  availableBeds: number;
  availableICU: number;
  ventilators: number;
  lastUpdated: string;
}

const STORAGE_KEY = 'hospital_data';
let listeners: Array<(data: HospitalData[]) => void> = [];

// Initialize with default data if empty
const defaultHospitals: HospitalData[] = [
  {
    id: 'HSP-001',
    name: 'Central Medical',
    totalBeds: 85,
    availableBeds: 12,
    availableICU: 5,
    ventilators: 8,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'HSP-002',
    name: "St. Mary's Hospital",
    totalBeds: 120,
    availableBeds: 8,
    availableICU: 3,
    ventilators: 5,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'HSP-003',
    name: 'Memorial Hospital',
    totalBeds: 95,
    availableBeds: 20,
    availableICU: 8,
    ventilators: 12,
    lastUpdated: new Date().toISOString(),
  },
];

// Get hospital data from localStorage
export function getHospitalData(): HospitalData[] {
  if (typeof window === 'undefined') return defaultHospitals;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Add IDs if missing
      return parsed.map((h: HospitalData, idx: number) => ({
        ...h,
        id: h.id || `HSP-${String(idx + 1).padStart(3, '0')}`,
        hospitalName: h.hospitalName || h.name, // compatibility
      }));
    }
  } catch (e) {
    console.error('Error loading hospital data:', e);
  }
  
  // Initialize with defaults
  saveHospitalData(defaultHospitals);
  return defaultHospitals;
}

// Save hospital data to localStorage
export function saveHospitalData(data: HospitalData[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    notifyListeners(data);
  } catch (e) {
    console.error('Error saving hospital data:', e);
  }
}

// Subscribe to hospital data changes
export function onHospitalDataChange(callback: (data: HospitalData[]) => void): () => void {
  listeners.push(callback);
  
  // Return unsubscribe function
  return () => {
    listeners = listeners.filter((l) => l !== callback);
  };
}

// Notify all listeners of data change
function notifyListeners(data: HospitalData[]): void {
  listeners.forEach((callback) => callback(data));
}

// Update a specific hospital
export function updateHospital(hospitalName: string, updates: Partial<HospitalData>): void {
  const hospitals = getHospitalData();
  const index = hospitals.findIndex(
    (h) => h.name.toLowerCase() === hospitalName.toLowerCase()
  );
  
  if (index !== -1) {
    hospitals[index] = {
      ...hospitals[index],
      ...updates,
      lastUpdated: new Date().toISOString(),
    };
    saveHospitalData(hospitals);
  }
}

// Clear all hospital data (useful for testing)
export function clearHospitalData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  notifyListeners([]);
}