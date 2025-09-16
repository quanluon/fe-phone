import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get('accessToken')?.value;
    
    return NextResponse.json({
      pathname,
      hasAccessToken: !!accessToken,
      accessTokenLength: accessToken?.length || 0,
      allCookies: request.cookies.getAll().map(c => ({
        name: c.name,
        length: c.value.length,
        preview: c.value.substring(0, 20) + '...'
      }))
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to test middleware' }, { status: 500 });
  }
}
