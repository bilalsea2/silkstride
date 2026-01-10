export interface Member {
  id: string;
  name: string;
  role?: string;
  marathons: string[];
  stravaUrl: string;
  joinedYear: number;
}

export const members: Member[] = [
  {
    id: 'azizbek-zaripov',
    name: 'Azizbek Zaripov',
    marathons: ['Tashkent', 'Bukhara', 'Zaamin'],
    stravaUrl: 'https://www.strava.com/athletes/161019714',
    joinedYear: 2023,
  },
  {
    id: 'bilol-bakhrillaev',
    name: 'Bilol Bakhrillaev',
    role: 'Captain',
    marathons: ['Tashkent', 'Bukhara', 'Almaty', 'Zaamin'],
    stravaUrl: 'https://www.strava.com/athletes/144799956',
    joinedYear: 2023,
  },
  {
    id: 'husan-isomiddinov',
    name: 'Husan Isomiddinov',
    role: 'Founder',
    marathons: ['Bukhara', 'Shymkent', 'Zaamin', 'Barsa Kelmes', 'Almaty'],
    stravaUrl: 'https://www.strava.com/athletes/145191640',
    joinedYear: 2023,
  },
  {
    id: 'abrorbek-nematov',
    name: 'Abrorbek Nematov',
    marathons: ['Tashkent', 'Zaamin', 'Almaty'],
    stravaUrl: 'https://www.strava.com/athletes/163050444',
    joinedYear: 2024,
  },
  {
    id: 'ozodbek-eshboboev',
    name: 'Ozodbek Eshboboev',
    marathons: ['Tashkent', 'Almaty', 'Barsa Kelmes', 'Zaamin'],
    stravaUrl: 'https://www.strava.com/athletes/167806748',
    joinedYear: 2024,
  },
  {
    id: 'eldor-khamraev',
    name: 'Eldor Khamraev',
    marathons: ['Bukhara', 'Zaamin'],
    stravaUrl: 'https://www.strava.com/athletes/161906424',
    joinedYear: 2024,
  },
];

export const getMemberById = (id: string): Member | undefined => {
  return members.find(m => m.id === id);
};
