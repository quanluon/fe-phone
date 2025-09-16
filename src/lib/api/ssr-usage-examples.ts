// Comprehensive examples of using the SSR-compatible API system

import { NextRequest } from 'next/server';
import { createSSRAuthApi, createSSRApi, autoSSRApi } from './ssr';
import { getAccessTokenFromRequest, getAccessTokenFromCookies } from '@/lib/utils/ssr';

// Example 1: Using in Next.js API Routes (App Router)
export async function GET(request: NextRequest) {
  try {
    // Get access token from request
    const accessToken = getAccessTokenFromRequest(request);
    
    if (!accessToken) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Create SSR API client with token
    const authApi = createSSRAuthApi(accessToken);
    
    // Make authenticated API call
    const response = await authApi.getProfile();
    
    return Response.json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error('API Error:', error);
    return Response.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// Example 2: Using in getServerSideProps (Pages Router)
export async function getServerSideProps(context: { req: NextRequest }) {
  try {
    // Get access token from request
    const accessToken = getAccessTokenFromRequest(context.req);
    
    if (!accessToken) {
      return {
        redirect: {
          destination: '/auth?mode=login',
          permanent: false,
        },
      };
    }
    
    // Create SSR API client
    const authApi = createSSRAuthApi(accessToken);
    
    // Fetch user profile
    const profileResponse = await authApi.getProfile();
    
    return {
      props: {
        user: profileResponse.data.data,
        isAuthenticated: true,
      },
    };
  } catch (error) {
    console.error('SSR Error:', error);
    return {
      props: {
        user: null,
        isAuthenticated: false,
      },
    };
  }
}

// Example 3: Using in App Router Server Components
export async function ProfileServerComponent() {
  try {
    // Get access token from cookies
    const accessToken = await getAccessTokenFromCookies();
    
    if (!accessToken) {
      // Redirect to login (this would typically be handled by middleware)
      return (
        <div>
          <p>Please log in to view your profile.</p>
        </div>
      );
    }
    
    // Create SSR API client
    const authApi = createSSRAuthApi(accessToken);
    
    // Fetch user profile
    const profileResponse = await authApi.getProfile();
    const user = profileResponse.data.data;
    
    return (
      <div>
        <h1>Welcome, {user.firstName}!</h1>
        <p>Email: {user.email}</p>
      </div>
    );
  } catch (error) {
    console.error('Server Component Error:', error);
    return (
      <div>
        <p>Error loading profile. Please try again.</p>
      </div>
    );
  }
}

// Example 4: Using the auto-detecting API (simplest approach)
export async function SimpleSSRExample() {
  try {
    // This automatically detects the environment and gets tokens appropriately
    const response = await autoSSRApi.get('/auth/profile');
    
    return (
      <div>
        <h1>Profile loaded successfully!</h1>
        <pre>{JSON.stringify(response.data, null, 2)}</pre>
      </div>
    );
  } catch (error) {
    console.error('Auto SSR Error:', error);
    return (
      <div>
        <p>Failed to load profile.</p>
      </div>
    );
  }
}

// Example 5: Using in middleware for authentication
export function authMiddleware(request: NextRequest) {
  const accessToken = getAccessTokenFromRequest(request);
  
  // Check if user is authenticated
  if (!accessToken) {
    // Redirect to login for protected routes
    if (request.nextUrl.pathname.startsWith('/profile')) {
      return Response.redirect(new URL('/auth?mode=login', request.url));
    }
  }
  
  // Continue to the requested page
  return Response.next();
}

// Example 6: Custom API call with SSR support
export async function customSSRApiCall(endpoint: string, accessToken?: string) {
  try {
    // Create SSR API client
    const api = createSSRApi(accessToken);
    
    // Make the API call
    const response = await api.get(endpoint);
    
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Custom SSR API Error:', error);
    return {
      success: false,
      error: 'Failed to fetch data',
    };
  }
}

// Example 7: Using in a server action
export async function updateProfileAction(formData: FormData) {
  try {
    // Get access token from cookies
    const accessToken = await getAccessTokenFromCookies();
    
    if (!accessToken) {
      return { success: false, error: 'Unauthorized' };
    }
    
    // Create SSR API client
    const authApi = createSSRAuthApi(accessToken);
    
    // Extract data from form
    const profileData = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      phone: formData.get('phone') as string,
    };
    
    // Update profile
    const response = await authApi.updateProfile(profileData);
    
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Server Action Error:', error);
    return {
      success: false,
      error: 'Failed to update profile',
    };
  }
}

// Example 8: Error handling and retry logic
export async function robustSSRApiCall(endpoint: string, accessToken?: string, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const api = createSSRApi(accessToken);
      const response = await api.get(endpoint);
      
      return {
        success: true,
        data: response.data,
        attempt,
      };
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);
      
      if (attempt === retries) {
        return {
          success: false,
          error: 'All retry attempts failed',
          lastError: error,
        };
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
}
