import { NextRequest, NextResponse } from 'next/server';

const BE_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
// Server-side only — never exposed to the browser
const API_KEY = process.env.API_KEY;

function buildHeaders(req: NextRequest): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (API_KEY) headers['X-API-Key'] = API_KEY;
  const auth = req.headers.get('Authorization');
  if (auth) headers['Authorization'] = auth;
  return headers;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const search = req.nextUrl.search;
  const beResponse = await fetch(`${BE_URL}/auth/users${search}`, {
    method: 'GET',
    headers: buildHeaders(req),
  });
  const data = await beResponse.text();
  return new NextResponse(data, {
    status: beResponse.status,
    headers: { 'Content-Type': beResponse.headers.get('Content-Type') || 'application/json' },
  });
}
