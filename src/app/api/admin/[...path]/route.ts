import logger from '@/lib/utils/logger';
import { NextRequest, NextResponse } from 'next/server';

const BE_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
// Server-side proxy for admin routes

type RouteContext = { params: Promise<{ path: string[] }> };

function buildHeaders(req: NextRequest): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const auth = req.headers.get('Authorization');
  if (auth) headers['Authorization'] = auth;

  // Forward x-api-key if present, otherwise inject the hardcoded one
  const apiKey = req.headers.get('x-api-key') || process.env.API_KEY || "";

  headers['x-api-key'] = apiKey;

  return headers;
}

async function proxyRequest(req: NextRequest, context: RouteContext): Promise<NextResponse> {
  const { path } = await context.params;
  const search = req.nextUrl.search;
  const targetUrl = `${BE_URL}/admin/${path.join('/')}${search}`;

  logger.info({ targetUrl }, 'targetUrl');

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

export const GET = (req: NextRequest, ctx: RouteContext) => proxyRequest(req, ctx);
export const POST = (req: NextRequest, ctx: RouteContext) => proxyRequest(req, ctx);
export const PUT = (req: NextRequest, ctx: RouteContext) => proxyRequest(req, ctx);
export const PATCH = (req: NextRequest, ctx: RouteContext) => proxyRequest(req, ctx);
export const DELETE = (req: NextRequest, ctx: RouteContext) => proxyRequest(req, ctx);
