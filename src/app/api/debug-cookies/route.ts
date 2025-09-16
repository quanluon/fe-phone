import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // Get cookies from request
    const requestCookies = request.cookies.getAll();
    
    // Get cookies from next/headers
    const cookieStore = await cookies();
    const headerCookies = cookieStore.getAll();
    
    const debugInfo = {
      timestamp: new Date().toISOString(),
      requestUrl: request.url,
      requestCookies: requestCookies.map(c => ({
        name: c.name,
        value: c.value.length > 100 ? c.value.substring(0, 100) + '...' : c.value,
        length: c.value.length
      })),
      headerCookies: headerCookies.map(c => ({
        name: c.name,
        value: c.value.length > 100 ? c.value.substring(0, 100) + '...' : c.value,
        length: c.value.length
      })),
      accessTokenFromRequest: request.cookies.get('accessToken')?.value ? 'Present' : 'Missing',
      accessTokenFromHeaders: cookieStore.get('accessToken')?.value ? 'Present' : 'Missing',
      refreshTokenFromRequest: request.cookies.get('refreshToken')?.value ? 'Present' : 'Missing',
      refreshTokenFromHeaders: cookieStore.get('refreshToken')?.value ? 'Present' : 'Missing',
    };
    
    return NextResponse.json(debugInfo, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to debug cookies', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
