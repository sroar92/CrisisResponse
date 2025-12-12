import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs-extra';
import path from 'path';
import { io } from '../socket/route';

const dataPath = path.join(process.cwd(), 'data/responders.json');  // Store in data folder

// Ensure data folder exists
const dataDir = path.dirname(dataPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Load data
function loadData(): Array<{
  id: string;
  status: 'standby' | 'active';
  location: { lat: number; lng: number } | null;
  updatedAt: string;
}> {
  if (fs.existsSync(dataPath)) {
    return fs.readJsonSync(dataPath);
  }
  return [
    { id: 'FR-101', status: 'standby', location: null, updatedAt: new Date().toISOString() },
    { id: 'FR-102', status: 'active', location: null, updatedAt: new Date().toISOString() },
    { id: 'FR-103', status: 'standby', location: null, updatedAt: new Date().toISOString() },
    { id: 'FR-104', status: 'active', location: null, updatedAt: new Date().toISOString() },
  ];
}

// Save data
function saveData(data: any[]) {
  fs.writeJsonSync(dataPath, data, { spaces: 2 });
}

export async function GET() {
  return NextResponse.json(loadData());
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, location } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    let data = loadData();
    const index = data.findIndex(r => r.id === id);
    const update = {
      id,
      status: status as 'standby' | 'active',
      location: location || null,
      updatedAt: new Date().toISOString(),
    };

    if (index > -1) {
      data[index] = update;
    } else {
      data.push(update);
    }

    saveData(data);  // Persist to file
    // Emit to Socket.io
    if (io) {
        io.emit('responderUpdate', update);  // Fixed: use io directly
    }

    console.log('Updated responder:', update);

    return NextResponse.json({ success: true, data: update });
    } catch (error) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }
}