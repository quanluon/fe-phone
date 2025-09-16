import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('accessToken')?.value;
    const refreshToken = request.cookies.get('refreshToken')?.value;
    
    return NextResponse.json({
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      accessTokenLength: accessToken?.length || 0,
      refreshTokenLength: refreshToken?.length || 0,
      accessTokenPreview: accessToken ? accessToken.substring(0, 50) + '...' : null,
      refreshTokenPreview: refreshToken ? refreshToken.substring(0, 50) + '...' : null,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to check auth' }, { status: 500 });
  }
}
