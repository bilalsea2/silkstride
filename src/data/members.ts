export interface Member {
  id: string;
  name: string;
  role?: string;
  marathons: string[];
  stravaUrl: string;
  joinedYear: number;
  profilePicture?: string; // Optional - can be fetched from Strava or set manually
}

export const members: Member[] = [
  {
    id: 'azizbek-zaripov',
    name: 'Azizbek Zaripov',
    marathons: ['Tashkent', 'Bukhara', 'Zaamin'],
    stravaUrl: 'https://www.strava.com/athletes/161019714',
    joinedYear: 2023,
    // Add profile picture path here, e.g.: profilePicture: '/photos/members/azizbek.jpg',
  },
  {
    id: 'bilol-bakhrillaev',
    name: 'Bilol Bakhrillaev',
    role: 'Captain',
    marathons: ['Tashkent', 'Bukhara', 'Almaty', 'Zaamin'],
    stravaUrl: 'https://www.strava.com/athletes/144799956',
    joinedYear: 2023,
    // Add profile picture path here
  },
  {
    id: 'husan-isomiddinov',
    name: 'Husan Isomiddinov',
    role: 'Founder',
    marathons: ['Bukhara', 'Shymkent', 'Zaamin', 'Barsa Kelmes', 'Almaty'],
    stravaUrl: 'https://www.strava.com/athletes/145191640',
    joinedYear: 2023,
    // Add profile picture path here
  },
  {
    id: 'abrorbek-nematov',
    name: 'Abrorbek Nematov',
    marathons: ['Tashkent', 'Zaamin', 'Almaty'],
    stravaUrl: 'https://www.strava.com/athletes/163050444',
    joinedYear: 2024,
    // Add profile picture path here
  },
  {
    id: 'ozodbek-eshboboev',
    name: 'Ozodbek Eshboboev',
    marathons: ['Tashkent', 'Almaty', 'Barsa Kelmes', 'Zaamin'],
    stravaUrl: 'https://www.strava.com/athletes/167806748',
    joinedYear: 2024,
    // Add profile picture path here
  },
  {
    id: 'eldor-khamraev',
    name: 'Eldor Khamraev',
    marathons: ['Bukhara', 'Zaamin'],
    stravaUrl: 'https://www.strava.com/athletes/161906424',
    joinedYear: 2024,
    // Add profile picture path here
  },
];

export const getMemberById = (id: string): Member | undefined => {
  return members.find(m => m.id === id);
};
