import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('accessToken')?.value;
    const refreshToken = request.cookies.get('refreshToken')?.value;
    
    // Check cookie size limits
    const maxCookieSize = 4096; // Standard browser limit
    const accessTokenSize = accessToken?.length || 0;
    const refreshTokenSize = refreshToken?.length || 0;
    
    const isAccessTokenTooBig = accessTokenSize > maxCookieSize;
    const isRefreshTokenTooBig = refreshTokenSize > maxCookieSize;
    
    return NextResponse.json({
      accessToken: {
        exists: !!accessToken,
        size: accessTokenSize,
        isTooBig: isAccessTokenTooBig,
        preview: accessToken ? accessToken.substring(0, 50) + '...' : null
      },
      refreshToken: {
        exists: !!refreshToken,
        size: refreshTokenSize,
        isTooBig: isRefreshTokenTooBig,
        preview: refreshToken ? refreshToken.substring(0, 50) + '...' : null
      },
      limits: {
        maxCookieSize,
        totalSize: accessTokenSize + refreshTokenSize
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to test cookie size' }, { status: 500 });
  }
}
