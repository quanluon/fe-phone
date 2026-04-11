import { NextRequest, NextResponse } from 'next/server';

const BE_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
// Server-side only — never exposed to the browser
const API_KEY = process.env.API_KEY;

type RouteContext = { params: Promise<{ path: string[] }> };

function buildHeaders(req: NextRequest): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (API_KEY) headers['X-API-Key'] = API_KEY;
  const auth = req.headers.get('Authorization');
  if (auth) headers['Authorization'] = auth;
  return headers;
}

async function proxyRequest(req: NextRequest, context: RouteContext): Promise<NextResponse> {
  const { path } = await context.params;
  const search = req.nextUrl.search;
  const targetUrl = `${BE_URL}/admin/${path.join('/')}${search}`;

  const hasBody = req.method !== 'GET' && req.method !== 'HEAD';
  let body: string | undefined;
  if (hasBody) {
    try { body = await req.text(); } catch { /* no body */ }
  }

  const beResponse = await fetch(targetUrl, {
    method: req.method,
    headers: buildHeaders(req),
    body: hasBody && body ? body : undefined,
  });

  const data = await beResponse.text();
  return new NextResponse(data, {
    status: beResponse.status,
    headers: { 'Content-Type': beResponse.headers.get('Content-Type') || 'application/json' },
  });
}

export const GET    = (req: NextRequest, ctx: RouteContext) => proxyRequest(req, ctx);
export const POST   = (req: NextRequest, ctx: RouteContext) => proxyRequest(req, ctx);
export const PUT    = (req: NextRequest, ctx: RouteContext) => proxyRequest(req, ctx);
export const PATCH  = (req: NextRequest, ctx: RouteContext) => proxyRequest(req, ctx);
export const DELETE = (req: NextRequest, ctx: RouteContext) => proxyRequest(req, ctx);
