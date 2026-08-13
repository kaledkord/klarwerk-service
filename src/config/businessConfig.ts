/**
 * Centralized business configuration — single source of truth for all NAP data,
 * business hours, service area, social profiles, and platform URLs.
 *
 * Every component imports from here. Never hardcode NAP values elsewhere.
 */

export interface BusinessHours {
  day: string;
  open: string | null;
  close: string | null;
}

export interface ServiceAreaLocation {
  name: string;
  zipCodes: string[];
}

export interface PlatformProfile {
  name: string;
  url: string;
  icon: 'google' | 'facebook' | 'instagram' | 'tiktok';
}

export const businessConfig = {
  // ── NAP ──────────────────────────────────────────────────────────────────
  name: 'KlarWerk Service',
  // Einzelunternehmen – kein GmbH-Zusatz.
  legalName: 'KlarWerk Service',
  slogan: 'Gebäudereinigung & Gebäudeservice',
  description:
    'Professionelle Gebäudereinigung und Gebäudeservice für Schleswig-Holstein, Hamburg und Nordrhein-Westfalen. Zuverlässig, flexibel und persönlich betreut.',

  address: {
    street: 'Am Blöcken 4',
    city: 'Bordesholm',
    state: 'Schleswig-Holstein',
    zip: '24582',
    country: 'DE',
    countryName: 'Deutschland',
    fullAddress: 'Am Blöcken 4, 24582 Bordesholm, Schleswig-Holstein, Deutschland',
  },

  phone: {
    display: '+49 176 31287131',
    raw: '+4917631287131',
  },

  email: 'info@klarwerk-service.com',

  url: 'https://klarwerk-service.com',

  // ── Geo coordinates ───────────────────────────────────────────────────────
  geo: {
    latitude: 54.1763,
    longitude: 10.0425,
  },

  // ── Business hours ────────────────────────────────────────────────────────
  hours: [
    { day: 'Monday', open: '07:00', close: '19:00' },
    { day: 'Tuesday', open: '07:00', close: '19:00' },
    { day: 'Wednesday', open: '07:00', close: '19:00' },
    { day: 'Thursday', open: '07:00', close: '19:00' },
    { day: 'Friday', open: '07:00', close: '19:00' },
    { day: 'Saturday', open: '09:00', close: '14:00' },
    { day: 'Sunday', open: null, close: null },
  ] as BusinessHours[],

  // ── Services offered ───────────────────────────────────────────────────────
  services: [
    'Gebäudereinigung',
    'Unterhaltsreinigung',
    'Büroreinigung',
    'Glasreinigung',
    'Praxisreinigung',
    'Hausmeisterservice',
    'Gartenpflege',
    'Grundreinigung',
    'Bauendreinigung',
    'Winterdienst',
    'Entrümpelung',
    'Möbelreinigung',
  ],

  // ── Service area ───────────────────────────────────────────────────────────
  // Priorität: (1) Schleswig-Holstein rund um den Firmensitz Bordesholm/Kiel,
  // (2) Hamburg, (3) Nordrhein-Westfalen.
  serviceArea: {
    primaryCity: 'Kiel',
    regions: ['Schleswig-Holstein', 'Hamburg', 'Nordrhein-Westfalen'],
    locations: [
      { name: 'Bordesholm', zipCodes: ['24582'] },
      { name: 'Kiel', zipCodes: ['24103', '24105', '24111', '24118', '24143', '24146'] },
      { name: 'Neumünster', zipCodes: ['24534', '24536', '24537', '24539'] },
      { name: 'Rendsburg', zipCodes: ['24768', '24782', '24783'] },
      { name: 'Nortorf', zipCodes: ['24589'] },
      { name: 'Preetz', zipCodes: ['24211', '24214', '24217'] },
      { name: 'Plön & Eckernförde', zipCodes: ['24306', '24321', '24340', '24357'] },
      { name: 'Bad Segeberg', zipCodes: ['23795', '23801', '23823'] },
      { name: 'Eutin', zipCodes: ['23701', '23714', '23715'] },
      { name: 'Lübeck', zipCodes: ['23552', '23554', '23556', '23558', '23560', '23562'] },
      { name: 'Hamburg', zipCodes: ['20095', '20097', '20099', '20354', '20457', '20535', '22049', '22297'] },
      { name: 'Nordrhein-Westfalen', zipCodes: ['50667', '50668', '50670', '50672', '50674', '50677', '50678', '50679'] },
    ] as ServiceAreaLocation[],
  },

  // ── Social / platform profile URLs ─────────────────────────────────────────
  platforms: {
    googleBusiness: 'https://maps.google.com/?q=KlarWerk+Service+Am+Blöcken+4+24582+Bordesholm',
    facebook: 'https://www.facebook.com/klarwerkservice',
    instagram: 'https://www.instagram.com/klarwerk.service/',
    tiktok: 'https://www.tiktok.com/@klarwerk.service',
  } as Record<string, string>,

  // ── Review/rating aggregate ─────────────────────────────────────────────────
  reviews: {
    ratingValue: '5.0',
    reviewCount: 30,
  },

  // ── Images ──────────────────────────────────────────────────────────────────
  images: {
    logo: 'https://klarwerk-service.com/Kein_Titel_(580_x_140_px)_20260715_025604_0000.svg',
    // Selbst gehostetes Standard-OG-/Sharing-Bild (kein externer Unsplash-Hotlink).
    primary: 'https://klarwerk-service.com/og-default.png',
  },

  // ── Pricing ──────────────────────────────────────────────────────────────────
  priceRange: '€€',
} as const;

export type BusinessConfig = typeof businessConfig;

// ── Helper: all platform profiles as array ────────────────────────────────────
export const platformProfiles: PlatformProfile[] = [
  { name: 'Google Maps', url: businessConfig.platforms.googleBusiness, icon: 'google' },
  { name: 'Facebook', url: businessConfig.platforms.facebook, icon: 'facebook' },
  { name: 'Instagram', url: businessConfig.platforms.instagram, icon: 'instagram' },
  { name: 'TikTok', url: businessConfig.platforms.tiktok, icon: 'tiktok' },
];

// ── Helper: sameAs array for JSON-LD ───────────────────────────────────────────
export const sameAsUrls: string[] = [
  businessConfig.platforms.googleBusiness,
  businessConfig.platforms.facebook,
  businessConfig.platforms.instagram,
  businessConfig.platforms.tiktok,
];
