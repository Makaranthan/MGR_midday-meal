
import { Commodity, View, Stock } from './types';

export const NORMS = {
  PRIMARY: {
    rice: 100,
    dhal: 15,
    oil: 3,
    salt: 1.9,
    gram: 20, // User-controlled day
    chickpea: 20, // User-controlled day
    egg: 1,
  },
  UPPER_PRIMARY: {
    rice: 150,
    dhal: 15,
    oil: 3,
    salt: 1.9,
    gram: 20, // User-controlled day
    chickpea: 20, // User-controlled day
    egg: 1,
  },
};

export const COMMODITIES: Commodity[] = ['rice', 'dhal', 'oil', 'salt', 'gram', 'chickpea', 'egg'];

export const COMMODITY_NAMES: Record<Commodity, { name: string, unit: string }> = {
  rice: { name: 'அரிசி', unit: 'கி.கி' },
  dhal: { name: 'பருப்பு', unit: 'கி.கி' },
  oil: { name: 'எண்ணெய்', unit: 'லிட்டர்' },
  salt: { name: 'உப்பு', unit: 'கி.கி' },
  gram: { name: 'பயறு', unit: 'கி.கி' },
  chickpea: { name: 'கொண்டைக்கடலை', unit: 'கி.கி' },
  egg: { name: 'முட்டை', unit: 'எண்ணிக்கை' },
};

export const VIEWS: Record<View, string> = {
  [View.MONTH_SELECTION]: 'மாத தேர்வு',
  [View.DAILY_ENTRY]: 'தினசரி பதிவு',
  [View.STOCK_REGISTER]: 'உணவுப் பொருள் இருப்புப் பதிவேடு',
  [View.MONTHLY_SUMMARY]: 'மாதாந்திர சுருக்கம்',
  [View.YEARLY_SUMMARY]: 'ஆண்டு அறிக்கை',
};

export const MONTHS_TAMIL = [
  'ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்',
  'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்'
];

export const DAYS_TAMIL = [
    'ஞாயிறு', 'திங்கள்', 'செவ்வாய்', 'புதன்', 'வியாழன்', 'வெள்ளி', 'சனி'
];