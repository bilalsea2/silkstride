import { NextResponse } from 'next/server';

// Strava API types
interface StravaTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

interface StravaClubMember {
  firstname: string;
  lastname: string;
  profile: string; // Profile picture URL
  profile_medium: string;
  membership: string;
  admin: boolean;
  owner: boolean;
}

interface StravaClub {
  id: number;
  name: string;
  profile: string;
  profile_medium: string;
  cover_photo: string;
  cover_photo_small: string;
  member_count: number;
  city: string;
  country: string;
  description: string;
}

// Cache for access token
let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  // Check if we have a valid cached token
  if (cachedToken && cachedToken.expiresAt > Date.now() / 1000 + 60) {
    return cachedToken.token;
  }

  const clientId = process.env.STRAVA_CLIENT_ID;
  const clientSecret = process.env.STRAVA_CLIENT_SECRET;
  const refreshToken = process.env.STRAVA_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Missing Strava API credentials');
  }

  const response = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to refresh token: ${response.statusText}`);
  }

  const data: StravaTokenResponse = await response.json();
  
  cachedToken = {
    token: data.access_token,
    expiresAt: data.expires_at,
  };

  return data.access_token;
}

export async function GET() {
  try {
    const clubId = process.env.STRAVA_CLUB_ID || '1458920';
    const accessToken = await getAccessToken();

    // Fetch club info and members in parallel
    const [clubResponse, membersResponse] = await Promise.all([
      fetch(`https://www.strava.com/api/v3/clubs/${clubId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
      fetch(`https://www.strava.com/api/v3/clubs/${clubId}/members?per_page=50`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    ]);

    if (!clubResponse.ok || !membersResponse.ok) {
      throw new Error('Failed to fetch club data');
    }

    const club: StravaClub = await clubResponse.json();
    const members: StravaClubMember[] = await membersResponse.json();

    return NextResponse.json({
      club: {
        id: club.id,
        name: club.name,
        profile: club.profile,
        coverPhoto: club.cover_photo,
        memberCount: club.member_count,
        city: club.city,
        country: club.country,
        description: club.description,
      },
      members: members.map((member) => ({
        firstName: member.firstname,
        lastName: member.lastname,
        profilePicture: member.profile_medium || member.profile,
        isAdmin: member.admin,
        isOwner: member.owner,
      })),
    });
  } catch (error) {
    console.error('Strava API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch Strava data' },
      { status: 500 }
    );
  }
}

