export interface Location {
  id: string;
  name: string;
  nameLocal?: string;
  x: number; // percentage position on the map
  y: number;
  description: string;
  date?: string;
  distance?: string;
  photoCount: number;
}

// Cities positioned based on the silkroad.png map
// The map shows ancient Silk Road - Central Asia is in the left-center area
// Coordinates are percentages of the image dimensions
export const locations: Location[] = [
  {
    id: 'tashkent',
    name: 'Tashkent',
    nameLocal: 'Тошкент',
    x: 33.5,  // Near "Chach" on the map
    y: 27,
    description: 'Capital of Uzbekistan and our home base. The city where Silk Stride was born — a modern metropolis with ancient roots at the heart of the Silk Road.',
    date: 'October 2024',
    distance: '42.195 km',
    photoCount: 0,
  },
  {
    id: 'samarkand',
    name: 'Samarkand',
    nameLocal: 'Самарқанд',
    x: 28,  // Samarkand is clearly labeled on the map
    y: 34,
    description: 'The jewel of the Silk Road. We ran through streets where Tamerlane once walked, past the magnificent Registan Square and Shah-i-Zinda necropolis.',
    date: 'March 2025',
    distance: '21.1 km',
    photoCount: 0,
  },
  {
    id: 'bukhara',
    name: 'Bukhara',
    nameLocal: 'Бухоро',
    x: 23,  // West of Samarkand, labeled "Bukhara"
    y: 36,
    description: 'Holy city of Central Asia with over 2,500 years of history. Our route wound through ancient trading domes and past the towering Kalyan Minaret.',
    date: 'May 2025',
    distance: '21.1 km',
    photoCount: 0,
  },
  {
    id: 'shymkent',
    name: 'Shymkent',
    nameLocal: 'Шымкент',
    x: 34.5,  // South Kazakhstan, north of Tashkent
    y: 22,
    description: 'Third largest city in Kazakhstan. A crossroads of cultures where the Kazakh steppe meets the foothills of the Tian Shan mountains.',
    date: 'June 2025',
    distance: '10 km',
    photoCount: 0,
  },
  {
    id: 'almaty',
    name: 'Almaty',
    nameLocal: 'Алматы',
    x: 42,  // Eastern Kazakhstan, near China border
    y: 20,
    description: 'Former capital of Kazakhstan, nestled beneath the snow-capped peaks of the Trans-Ili Alatau. A breathtaking mountain marathon experience.',
    date: 'September 2025',
    distance: '42.195 km',
    photoCount: 0,
  },
  {
    id: 'barsa-kelmes',
    name: 'Barsa Kelmes',
    nameLocal: 'Барсакелмес',
    x: 18,  // Near Aral Sea area
    y: 18,
    description: 'The name means "If you go, you will not return" — a haunting desert landscape near the Aral Sea in Karakalpakstan. Our most extreme expedition.',
    date: 'April 2025',
    distance: '50 km Ultra',
    photoCount: 0,
  },
  {
    id: 'zaamin',
    name: 'Zaamin',
    nameLocal: 'Зомин',
    x: 31,  // Jizzakh region, between Tashkent and Samarkand
    y: 30,
    description: 'Hidden gem in Jizzakh region. Zaamin National Park offers pristine mountain trails through juniper forests and alpine meadows.',
    date: 'August 2025',
    distance: '30 km Trail',
    photoCount: 0,
  },
];

export const getLocationById = (id: string): Location | undefined => {
  return locations.find(loc => loc.id === id);
};
