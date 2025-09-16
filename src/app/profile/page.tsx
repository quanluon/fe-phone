import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { ProfileClient } from "./ProfileClient";

export default async function ProfilePage() {
  try {
    // Check authentication on server-side
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    
    // Debug logging
    console.log('🔍 Profile Page Debug:', {
      hasAccessToken: !!accessToken,
      accessTokenLength: accessToken?.length || 0,
      cookieCount: cookieStore.getAll().length
    });
    
    // If no access token or empty token, redirect to login
    if (!accessToken || accessToken.trim() === '') {
      console.log('❌ Profile page redirecting to login - no access token or empty token');
      redirect('/auth?mode=login');
    }
    
    console.log('✅ Profile page proceeding with access token');
    return <ProfileClient />;
  } catch (error) {
    console.error('❌ Profile page error:', error);
    redirect('/auth?mode=login');
  }
}
