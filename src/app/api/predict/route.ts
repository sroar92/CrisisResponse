// src/app/api/predict/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface Incident {
  type: string;
  severity: number;
  population_affected: number;
  ambulances_dispatched: number;
  fire_units_dispatched: number;
  police_units_dispatched: number;
  hospital_admissions: number;
  weather_condition: string;
  response_time_minutes?: number;
}

interface PredictionInput {
  incidentType: string;
  severity: number;
  populationAffected: number;
  weatherCondition?: string;
}

interface PredictionResult {
  predictedAmbulances: number;
  predictedFireUnits: number;
  predictedPoliceUnits: number;
  predictedHospitalAdmissions: number;
  estimatedResponseTime: number;
  estimatedDuration: number;
  confidence: number;
  historicalSimilarIncidents: number;
  recommendations: string[];
}

// Mock historical data (in production, load from database)
const historicalData = {
  incidents: [
    { type: 'flood', severity: 7, population_affected: 500, ambulances_dispatched: 3, fire_units_dispatched: 2, police_units_dispatched: 4, hospital_admissions: 12, weather_condition: 'heavy_rain', response_time_minutes: 8 },
    { type: 'flood', severity: 5, population_affected: 200, ambulances_dispatched: 2, fire_units_dispatched: 1, police_units_dispatched: 2, hospital_admissions: 5, weather_condition: 'clear', response_time_minutes: 6 },
    { type: 'fire', severity: 8, population_affected: 300, ambulances_dispatched: 4, fire_units_dispatched: 5, police_units_dispatched: 3, hospital_admissions: 15, weather_condition: 'windy', response_time_minutes: 7 },
    { type: 'fire', severity: 6, population_affected: 150, ambulances_dispatched: 2, fire_units_dispatched: 3, police_units_dispatched: 2, hospital_admissions: 8, weather_condition: 'clear', response_time_minutes: 5 },
    { type: 'medical_emergency', severity: 9, population_affected: 100, ambulances_dispatched: 5, fire_units_dispatched: 1, police_units_dispatched: 2, hospital_admissions: 20, weather_condition: 'clear', response_time_minutes: 4 },
    { type: 'medical_emergency', severity: 4, population_affected: 50, ambulances_dispatched: 1, fire_units_dispatched: 0, police_units_dispatched: 1, hospital_admissions: 3, weather_condition: 'clear', response_time_minutes: 6 },
  ]
};

// Simple linear regression-based predictor
function predictResourceNeeds(input: PredictionInput): PredictionResult {
  const { incidentType, severity, populationAffected, weatherCondition } = input;

  // Filter historical data for similar incidents
  const similarIncidents = historicalData.incidents.filter((inc: Incident) => {
    return inc.type === incidentType;
  });

  if (similarIncidents.length === 0) {
    // Default fallback if no similar incidents
    return {
      predictedAmbulances: Math.ceil(severity * 1.5),
      predictedFireUnits: Math.ceil(severity * 1.2),
      predictedPoliceUnits: Math.ceil(severity * 1.0),
      predictedHospitalAdmissions: Math.ceil(populationAffected * 0.01),
      estimatedResponseTime: 8,
      estimatedDuration: 4,
      confidence: 0.3,
      historicalSimilarIncidents: 0,
      recommendations: [
        'No historical data for this incident type',
        'Using baseline estimates',
        'Monitor situation closely'
      ]
    };
  }

  // Calculate averages from similar incidents
  const avgAmbulances = similarIncidents.reduce((sum: number, inc: Incident) => sum + inc.ambulances_dispatched, 0) / similarIncidents.length;
  const avgFireUnits = similarIncidents.reduce((sum: number, inc: Incident) => sum + inc.fire_units_dispatched, 0) / similarIncidents.length;
  const avgPoliceUnits = similarIncidents.reduce((sum: number, inc: Incident) => sum + inc.police_units_dispatched, 0) / similarIncidents.length;
  const avgHospitalAdmissions = similarIncidents.reduce((sum: number, inc: Incident) => sum + inc.hospital_admissions, 0) / similarIncidents.length;

  // Adjust based on severity (scale factor)
  const avgSeverity = similarIncidents.reduce((sum: number, inc: Incident) => sum + inc.severity, 0) / similarIncidents.length;
  const severityFactor = severity / avgSeverity;

  // Adjust based on population
  const avgPopulation = similarIncidents.reduce((sum: number, inc: Incident) => sum + inc.population_affected, 0) / similarIncidents.length;
  const populationFactor = populationAffected / avgPopulation;

  // Combined adjustment factor
  const adjustmentFactor = (severityFactor + populationFactor) / 2;

  // Weather impact
  let weatherMultiplier = 1.0;
  if (weatherCondition === 'heavy_rain' || weatherCondition === 'windy') {
    weatherMultiplier = 1.2;
  }

  // Final predictions
  const predictedAmbulances = Math.ceil(avgAmbulances * adjustmentFactor * weatherMultiplier);
  const predictedFireUnits = Math.ceil(avgFireUnits * adjustmentFactor * weatherMultiplier);
  const predictedPoliceUnits = Math.ceil(avgPoliceUnits * adjustmentFactor * weatherMultiplier);
  const predictedHospitalAdmissions = Math.ceil(avgHospitalAdmissions * adjustmentFactor);

  // Estimate response time based on severity
  const estimatedResponseTime = Math.ceil(5 + (severity * 1.5) + (weatherMultiplier - 1) * 5);
  const estimatedDuration = Math.ceil(2 + (severity * 1.5));

  // Confidence score based on sample size
  const confidence = Math.min(0.95, similarIncidents.length / 10);

  // Generate recommendations
  const recommendations: string[] = [];
  
  if (predictedAmbulances >= 5) {
    recommendations.push('⚠️ High ambulance demand expected - consider pre-positioning units');
  }
  
  if (severity >= 4) {
    recommendations.push('🚨 Severe incident - activate emergency operations center');
  }
  
  if (weatherCondition === 'heavy_rain') {
    recommendations.push('🌧️ Weather conditions may delay response - factor in extra time');
  }
  
  if (predictedHospitalAdmissions >= 15) {
    recommendations.push('🏥 Alert hospitals to prepare for mass casualty event');
  }

  if (incidentType === 'flood') {
    recommendations.push('🌊 Consider water rescue equipment and boats');
  }

  if (incidentType === 'fire') {
    recommendations.push('🔥 Ensure fire suppression resources are adequate');
  }

  return {
    predictedAmbulances,
    predictedFireUnits,
    predictedPoliceUnits,
    predictedHospitalAdmissions,
    estimatedResponseTime,
    estimatedDuration,
    confidence,
    historicalSimilarIncidents: similarIncidents.length,
    recommendations
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { incidentType, severity, populationAffected, weatherCondition } = body;

    if (!incidentType || !severity || !populationAffected) {
      return NextResponse.json(
        { error: 'Missing required fields: incidentType, severity, populationAffected' },
        { status: 400 }
      );
    }

    const prediction = predictResourceNeeds({
      incidentType,
      severity: Number(severity),
      populationAffected: Number(populationAffected),
      weatherCondition
    });

    return NextResponse.json({
      success: true,
      prediction,
      input: body,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Prediction error:', error);
    return NextResponse.json(
      { error: 'Failed to generate prediction' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  // Return historical data statistics
  const stats = {
    totalIncidents: historicalData.incidents.length,
    incidentTypes: {
      flood: historicalData.incidents.filter((i: Incident) => i.type === 'flood').length,
      fire: historicalData.incidents.filter((i: Incident) => i.type === 'fire').length,
      medical_emergency: historicalData.incidents.filter((i: Incident) => i.type === 'medical_emergency').length
    },
    averageResponseTime: (historicalData.incidents.reduce((sum: number, i: Incident) => sum + (i.response_time_minutes || 0), 0) / historicalData.incidents.length).toFixed(1),
    totalResourcesDeployed: {
      ambulances: historicalData.incidents.reduce((sum: number, i: Incident) => sum + i.ambulances_dispatched, 0),
      fireUnits: historicalData.incidents.reduce((sum: number, i: Incident) => sum + i.fire_units_dispatched, 0),
      policeUnits: historicalData.incidents.reduce((sum: number, i: Incident) => sum + i.police_units_dispatched, 0)
    }
  };

  return NextResponse.json({
    success: true,
    stats,
    modelInfo: {
      type: 'Rule-based regression with historical averaging',
      version: '1.0',
      lastUpdated: '2025-01-15'
    }
  });
}