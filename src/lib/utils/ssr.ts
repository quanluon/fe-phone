"use server";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";

/**
 * Extract access token from Next.js request for SSR
 */
export const getAccessTokenFromRequest = async (
  request: NextRequest
): Promise<string | null> => {
  // Try to get from Authorization header first
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  // Fallback to cookies
  const cookieStore = request.cookies;
  return cookieStore.get("accessToken")?.value || null;
};

/**
 * Extract refresh token from Next.js request for SSR
 */
export const getRefreshTokenFromRequest = async (
  request: NextRequest
): Promise<string | null> => {
  const cookieStore = request.cookies;
  return cookieStore.get("refreshToken")?.value || null;
};

/**
 * Get access token from Next.js cookies (for App Router server components)
 */
export const getAccessTokenFromCookies = async (): Promise<string | null> => {
  try {
    const cookieStore = await cookies();
    return cookieStore.get("accessToken")?.value || null;
  } catch {
    return null;
  }
};

/**
 * Get refresh token from Next.js cookies (for App Router server components)
 */
export const getRefreshTokenFromCookies = async (): Promise<string | null> => {
  try {
    const cookieStore = await cookies();
    return cookieStore.get("refreshToken")?.value || null;
  } catch {
    return null;
  }
};

/**
 * Create headers object with authorization for SSR API calls
 */
export const createAuthHeaders = async (
  accessToken?: string
): Promise<Record<string, string>> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  return headers;
};

/**
 * Get user authentication state from request for SSR
 */
export const getAuthStateFromRequest = async (request: NextRequest) => {
  const accessToken = await getAccessTokenFromRequest(request);
  const refreshToken = await getRefreshTokenFromRequest(request);

  return {
    isAuthenticated: !!accessToken,
    accessToken,
    refreshToken,
  };
};
