// src/app/api/drone/route.ts
// Simplified drone upload endpoint (no database dependencies)
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  // Mock upload simulation (2s delay for "drone flight")
  await new Promise(r => setTimeout(r, 2000));
  return NextResponse.json({ 
    message: 'Mock drone upload complete! 5 images processed.',
    success: true,
    count: 5
  });
}

export async function POST(req: NextRequest) {
  try {
    // In production, you would handle actual file uploads here
    // For now, just simulate the upload process
    
    await new Promise(r => setTimeout(r, 2000)); // Simulate processing
    
    const mockProcessedFiles = [
      '/uploads/drone/proc_img1.jpg',
      '/uploads/drone/proc_img2.jpg',
      '/uploads/drone/proc_img3.jpg',
      '/uploads/drone/proc_img4.jpg',
      '/uploads/drone/proc_img5.jpg'
    ];
    
    return NextResponse.json({ 
      success: true, 
      files: mockProcessedFiles, 
      count: mockProcessedFiles.length 
    });
    
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ 
      error: (err as Error).message 
    }, { status: 500 });
  }
}