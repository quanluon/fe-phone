import { NextRequest, NextResponse } from 'next/server';

const BE_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const API_KEY = process.env.API_KEY;

function buildHeaders(req: NextRequest): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (API_KEY) headers['X-API-Key'] = API_KEY;
  const auth = req.headers.get('Authorization');
  if (auth) headers['Authorization'] = auth;
  return headers;
}

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, context: RouteContext): Promise<NextResponse> {
  const { id } = await context.params;
  const beResponse = await fetch(`${BE_URL}/auth/users/${id}`, {
    method: 'GET',
    headers: buildHeaders(req),
  });
  const data = await beResponse.text();
  return new NextResponse(data, {
    status: beResponse.status,
    headers: { 'Content-Type': beResponse.headers.get('Content-Type') || 'application/json' },
  });
}
