import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

export async function POST(request: Request) {
  // Get credentials from environment variables
  const authUsername = process.env.AUTH_USERNAME;
  const authPassword = process.env.AUTH_PASSWORD;
  
  // Skip authentication if credentials are not set
  if (!authUsername || !authPassword) {
    return NextResponse.json({ success: true, message: 'Authentication disabled' });
  }
  
  try {
    const { username, password } = await request.json();
    
    // Validate credentials
    if (username !== authUsername || password !== authPassword) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Create JWT token
    const secret = new TextEncoder().encode(
      process.env.AUTH_SECRET || 'fallback-secret-do-not-use-in-production'
    );
    
    const token = await new SignJWT({ username })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1d') // Token expires in 1 day
      .sign(secret);
    
    // Create response with success message
    const response = NextResponse.json({ success: true });
    
    // Set cookie on the response
    response.cookies.set({
      name: 'auth-token',
      value: token,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day in seconds
      sameSite: 'strict'
    });
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Authentication failed' },
      { status: 500 }
    );
  }
} 