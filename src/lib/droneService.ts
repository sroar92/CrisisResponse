// lib/droneService.ts
// Mock drone service for simulating drone reconnaissance missions

export interface DroneImage {
  id: string;
  url: string;
  gps: {
    lat: number;
    lon: number;
  };
  altitude: number;
  timestamp: string;
  processed: boolean;
}

export interface DamageFeature {
  type: string;
  geometry: {
    type: string;
    coordinates: number[];
  };
  properties: {
    damageType: 'flood' | 'collapse' | 'debris' | 'fire';
    severity: number; // 0-10
    slope?: number;
    area?: number;
  };
}

export interface DamageAnalysis {
  type: 'FeatureCollection';
  features: DamageFeature[];
  metadata: {
    missionId: string;
    analyzedAt: string;
    totalFeatures: number;
  };
}

export interface DroneModel {
  missionId: string;
  modelUrl: string;
  generatedAt: string;
  accuracy: {
    rmse: number; // Root Mean Square Error in meters
  };
  status: 'processing' | 'ready' | 'error';
}

// Simulate drone image upload (mock)
export async function simulateDroneUpload(missionId: string = 'demo-mission'): Promise<DroneImage[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  const mockImages: DroneImage[] = Array.from({ length: 5 }, (_, i) => ({
    id: `IMG-${missionId}-${i + 1}`,
    url: `/uploads/drone/proc-img${i + 1}.jpg`,
    gps: {
      lat: 33.7490 + (Math.random() - 0.5) * 0.02,
      lon: -84.3880 + (Math.random() - 0.5) * 0.02,
    },
    altitude: 100 + Math.random() * 50,
    timestamp: new Date().toISOString(),
    processed: true,
  }));

  console.log('Mock drone upload complete:', mockImages.length, 'images');
  return mockImages;
}

// Generate 3D model from drone images (mock)
export async function generate3DModel(missionId: string = 'demo-mission'): Promise<DroneModel> {
  // Simulate processing delay (10-30 seconds in real scenario)
  await new Promise(resolve => setTimeout(resolve, 3000));

  const model: DroneModel = {
    missionId,
    modelUrl: `/models/${missionId}/base-terrain.gltf`,
    generatedAt: new Date().toISOString(),
    accuracy: {
      rmse: 1.5 + Math.random() * 2, // 1.5-3.5m accuracy
    },
    status: 'ready',
  };

  console.log('3D model generated:', model);
  return model;
}

// Analyze terrain for damage (mock)
export async function analyzeTerrain(missionId: string = 'demo-mission'): Promise<DamageAnalysis> {
  // Simulate analysis delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  const damageTypes: Array<'flood' | 'collapse' | 'debris' | 'fire'> = ['flood', 'collapse', 'debris', 'fire'];
  
  const features: DamageFeature[] = Array.from({ length: 8 + Math.floor(Math.random() * 5) }, (_, i) => {
    const baseLat = 33.7490;
    const baseLon = -84.3880;
    
    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [
          baseLon + (Math.random() - 0.5) * 0.01,
          baseLat + (Math.random() - 0.5) * 0.01,
        ],
      },
      properties: {
        damageType: damageTypes[Math.floor(Math.random() * damageTypes.length)],
        severity: Math.random() * 10,
        slope: 0.3 + Math.random() * 0.4,
        area: 10 + Math.random() * 90, // square meters
      },
    };
  });

  const analysis: DamageAnalysis = {
    type: 'FeatureCollection',
    features,
    metadata: {
      missionId,
      analyzedAt: new Date().toISOString(),
      totalFeatures: features.length,
    },
  };

  console.log('Terrain analysis complete:', analysis.metadata);
  return analysis;
}

// Full drone reconnaissance workflow
export async function runDroneReconnaissance(
  missionId: string = 'demo-mission',
  onProgress?: (status: string, progress: number) => void
): Promise<{
  images: DroneImage[];
  model: DroneModel;
  analysis: DamageAnalysis;
}> {
  try {
    // Step 1: Upload/Process Images
    if (onProgress) onProgress('uploading', 0);
    const images = await simulateDroneUpload(missionId);
    
    // Step 2: Generate 3D Model
    if (onProgress) onProgress('generating', 33);
    const model = await generate3DModel(missionId);
    
    // Step 3: Analyze Terrain
    if (onProgress) onProgress('analyzing', 66);
    const analysis = await analyzeTerrain(missionId);
    
    if (onProgress) onProgress('ready', 100);
    
    return { images, model, analysis };
  } catch (error) {
    console.error('Drone reconnaissance error:', error);
    throw error;
  }
}

// Get damage summary statistics
export function getDamageSummary(analysis: DamageAnalysis) {
  const features = analysis.features;
  
  const highSeverity = features.filter(f => f.properties.severity > 7).length;
  const mediumSeverity = features.filter(f => f.properties.severity > 4 && f.properties.severity <= 7).length;
  const lowSeverity = features.filter(f => f.properties.severity <= 4).length;
  
  const byType = features.reduce((acc, f) => {
    const type = f.properties.damageType;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return {
    total: features.length,
    highSeverity,
    mediumSeverity,
    lowSeverity,
    byType,
    averageSeverity: features.reduce((sum, f) => sum + f.properties.severity, 0) / features.length,
  };
}

// Create a simple mock 3D model file (for testing)
export function createMockGLTF(): string {
  const mockGLTF = {
    asset: {
      version: '2.0',
      generator: 'Mock Drone Service',
    },
    scene: 0,
    scenes: [
      {
        nodes: [0],
      },
    ],
    nodes: [
      {
        mesh: 0,
      },
    ],
    meshes: [
      {
        primitives: [
          {
            attributes: {
              POSITION: 0,
            },
            mode: 4, // TRIANGLES
          },
        ],
      },
    ],
    accessors: [
      {
        bufferView: 0,
        componentType: 5126, // FLOAT
        count: 3,
        type: 'VEC3',
        max: [1, 1, 1],
        min: [-1, -1, -1],
      },
    ],
    bufferViews: [
      {
        buffer: 0,
        byteLength: 36,
        target: 34962, // ARRAY_BUFFER
      },
    ],
    buffers: [
      {
        byteLength: 36,
      },
    ],
  };

  return JSON.stringify(mockGLTF, null, 2);
}