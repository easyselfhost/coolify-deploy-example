import { NextResponse } from 'next/server';

export async function GET() {
  // Create response with success message
  const response = NextResponse.json({ success: true });
  
  // Delete the auth cookie
  response.cookies.set({
    name: 'auth-token',
    value: '',
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0, // This will expire the cookie immediately
    sameSite: 'strict'
  });
  
  return response;
} 