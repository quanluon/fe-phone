import { ProfileClient } from "./ProfileClient";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default function ProfilePage() {
  // Let middleware handle authentication check
  // ProfileClient will handle client-side authentication
  return <ProfileClient />;
}
