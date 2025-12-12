// app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { deleteSession, logActivity, validateSession } from '../../../../../lib/auth';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('session_token')?.value;
    
    if (token) {
      // Get user before deleting session for logging
      const user = validateSession(token);
      
      // Delete session
      deleteSession(token);
      
      // Log logout
      if (user) {
        logActivity(
          user.id,
          'LOGOUT',
          'User logged out',
          request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
        );
      }
    }
    
    // Clear session cookie
    const response = NextResponse.json(
      { success: true, message: 'Logged out successfully' },
      { status: 200 }
    );
    
    response.cookies.delete('session_token');
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}