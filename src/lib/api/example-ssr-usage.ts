// Example usage of SSR API client in Next.js pages and API routes

import { NextRequest } from 'next/server';
import { createSSRAuthApi, createSSRApi } from './ssr';
import { getAccessTokenFromRequest, getAuthStateFromRequest } from '@/lib/utils/ssr';

// Example 1: Using in a Next.js API route
export async function GET(request: NextRequest) {
  try {
    // Get access token from request
    const accessToken = getAccessTokenFromRequest(request);
    
    // Create SSR API client with token
    const authApi = createSSRAuthApi(accessToken || undefined);
    
    // Make authenticated API call
    const response = await authApi.getProfile();
    
    return Response.json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    return Response.json(
      { success: false, error: 'Failed to fetch profile' },
      { status: 401 }
    );
  }
}

// Example 2: Using in getServerSideProps
export async function getServerSideProps(context: { req: NextRequest }) {
  try {
    // Get auth state from request
    const authState = getAuthStateFromRequest(context.req);
    
    if (!authState.isAuthenticated) {
      return {
        redirect: {
          destination: '/auth?mode=login',
          permanent: false,
        },
      };
    }
    
    // Create SSR API client
    const authApi = createSSRAuthApi(authState.accessToken || undefined);
    
    // Fetch user profile
    const profileResponse = await authApi.getProfile();
    
    return {
      props: {
        user: profileResponse.data.data,
        isAuthenticated: true,
      },
    };
  } catch (error) {
    return {
      props: {
        user: null,
        isAuthenticated: false,
      },
    };
  }
}

// Example 3: Using in middleware for authentication
export function authMiddleware(request: NextRequest) {
  const authState = getAuthStateFromRequest(request);
  
  // Check if user is authenticated
  if (!authState.isAuthenticated) {
    // Redirect to login for protected routes
    if (request.nextUrl.pathname.startsWith('/profile')) {
      return Response.redirect(new URL('/auth?mode=login', request.url));
    }
  }
  
  // Continue to the requested page
  return Response.next();
}

// Example 4: Using in a server component (App Router)
export async function ServerComponent() {
  // Note: In App Router, you would typically use cookies() from next/headers
  // instead of NextRequest for server components
  
  try {
    // For App Router, you would do something like:
    // const cookieStore = cookies();
    // const accessToken = cookieStore.get('accessToken')?.value;
    
    // const authApi = createSSRAuthApi(accessToken);
    // const profile = await authApi.getProfile();
    
    return (
      <div>
        {/* Render authenticated content */}
      </div>
    );
  } catch (error) {
    return (
      <div>
        {/* Render error state */}
      </div>
    );
  }
}
