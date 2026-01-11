'use client';

import { useState, useEffect } from 'react';

interface ClubMember {
  firstName: string;
  lastName: string;
  profilePicture: string;
  isAdmin: boolean;
  isOwner: boolean;
}

interface ClubInfo {
  id: number;
  name: string;
  profile: string;
  coverPhoto: string;
  memberCount: number;
  city: string;
  country: string;
  description: string;
}

interface StravaClubData {
  club: ClubInfo | null;
  members: ClubMember[];
  loading: boolean;
  error: string | null;
}

export function useStravaClub(): StravaClubData {
  const [data, setData] = useState<StravaClubData>({
    club: null,
    members: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    async function fetchClubData() {
      try {
        const response = await fetch('/api/strava');
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch club data');
        }

        const result = await response.json();
        setData({
          club: result.club,
          members: result.members,
          loading: false,
          error: null,
        });
      } catch (err) {
        setData((prev) => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : 'Unknown error',
        }));
      }
    }

    fetchClubData();
  }, []);

  return data;
}

