// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, createSession, logActivity } from '../../../../lib/auth';
import { seedSampleUsers } from '../../../../lib/db';

// Ensure sample users exist
try {
  seedSampleUsers();
} catch (error) {
  console.error('Error seeding users:', error);
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }
    
    // Authenticate user
    const user = authenticateUser(username, password);
    
    if (!user) {
      // Log failed attempt
      logActivity(
        null,
        'LOGIN_FAILED',
        `Failed login attempt for username: ${username}`,
        request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
      );
      
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }
    
    // Create session
    const token = createSession(user.id);
    
    // Log successful login
    logActivity(
      user.id,
      'LOGIN_SUCCESS',
      `User logged in successfully`,
      request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    );
    
    // Set session cookie
    const response = NextResponse.json(
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
    
    response.cookies.set('session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}