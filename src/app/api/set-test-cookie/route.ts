import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const response = NextResponse.json({ 
      message: 'Test cookie set',
      timestamp: new Date().toISOString()
    });
    
    // Set a simple test cookie
    response.cookies.set('testCookie', 'simple-test-value', {
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    
    // Set a longer test cookie
    const longValue = 'a'.repeat(1000); // 1000 characters
    response.cookies.set('longTestCookie', longValue, {
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    
    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Failed to set test cookie' }, { status: 500 });
  }
}
