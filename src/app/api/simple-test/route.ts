import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Simple test - just check if we can read cookies
    const cookies = request.cookies.getAll();
    
    return NextResponse.json({
      success: true,
      cookieCount: cookies.length,
      cookies: cookies.map(c => ({
        name: c.name,
        length: c.value.length,
        hasValue: c.value.length > 0
      }))
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
