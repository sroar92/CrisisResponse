// app/api/auth/session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '../../../../../lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('session_token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'No session token' },
        { status: 401 }
      );
    }
    
    const user = validateSession(token);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired session' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          name: user.name,
          email: user.email,
          organization: user.organization,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Session validation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}