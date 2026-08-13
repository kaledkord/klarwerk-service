export interface Manufacturer {
  name: string;
  alt: string;
  category: 'machines' | 'glass' | 'hygiene' | 'tools';
  areas: string[];
  domain: string;
  logoUrl: string;
}

export const manufacturerCategories: { id: Manufacturer['category']; label: string }[] = [
  { id: 'machines', label: 'Reinigungsmaschinen & Bodenpflege' },
  { id: 'glass', label: 'Glas- & Fensterreinigung' },
  { id: 'hygiene', label: 'Reinigungsmittel & Hygiene' },
  { id: 'tools', label: 'Werkzeuge & Ausrüstung' },
];

const local = (file: string) => `/logos/${file}`;
const clearbit = (domain: string) => `https://logo.clearbit.com/${domain}`;

export const manufacturers: Manufacturer[] = [
  {
    name: 'Kärcher',
    alt: 'Kärcher Logo – Scheuersaugmaschinen, Industriesauger, Hochdrucktechnik und professionelle Bodenreinigung',
    category: 'machines',
    areas: ['Scheuersaugmaschinen', 'Industriesauger', 'Hochdrucktechnik', 'Professionelle Bodenreinigung'],
    domain: 'kaercher.com',
    logoUrl: local('kaercher.svg'),
  },
  {
    name: 'Nilfisk',
    alt: 'Nilfisk Logo – Gewerbesauger, Scheuersaugmaschinen und Industriereinigung',
    category: 'machines',
    areas: ['Gewerbesauger', 'Scheuersaugmaschinen', 'Industriereinigung'],
    domain: 'nilfisk.com',
    logoUrl: local('nilfisk.svg'),
  },
{
    name: 'Hako',
    alt: 'Hako Logo – Kehrmaschinen, Bodenreinigungsmaschinen und Kommunaltechnik',
    category: 'machines',
    areas: ['Kehrmaschinen', 'Bodenreinigungsmaschinen', 'Kommunaltechnik'],
    domain: 'hako.com',
    logoUrl: local('hako.svg'),
  },
  {
    name: 'Tennant',
    alt: 'Tennant Logo – industrielle Bodenreinigung, Maschinenreinigung und Großflächenreinigung',
    category: 'machines',
    areas: ['Industrielle Bodenreinigung', 'Maschinenreinigung', 'Großflächenreinigung'],
    domain: 'tennantco.com',
    logoUrl: local('tennant.svg'),
  },
  {
    name: 'Unger',
    alt: 'Unger Logo – Fensterreinigungssysteme, Teleskopstangen und professionelle Glasreinigung',
    category: 'glass',
    areas: ['Fensterreinigungssysteme', 'Teleskopstangen', 'Professionelle Glasreinigung'],
    domain: 'ungerglobal.com',
    logoUrl: local('unger-logo-900x600.jpg'),
  },
{
    name: 'Ettore',
    alt: 'Ettore Logo – Fensterreinigung und Glaswerkzeuge',
    category: 'glass',
    areas: ['Fensterreinigung', 'Glaswerkzeuge'],
    domain: 'ettore.com',
    logoUrl: local('1-ettore.png'),
  },
  {
    name: 'Frosch Professional',
    alt: 'Frosch Professional Logo – nachhaltige Reinigungslösungen, Unterhaltsreinigung und Sanitärbereiche',
    category: 'hygiene',
    areas: ['Nachhaltige Reinigungslösungen', 'Unterhaltsreinigung', 'Sanitärbereiche'],
    domain: 'werner-mertz-professional.de',
    logoUrl: local('frosch.svg'),
  },
  {
    name: 'Dr. Schnell',
    alt: 'Dr. Schnell Logo – professionelle Gebäudereinigung, Hygieneprodukte und Spezialreiniger',
    category: 'hygiene',
    areas: ['Professionelle Gebäudereinigung', 'Hygieneprodukte', 'Spezialreiniger'],
    domain: 'dr-schnell.de',
    logoUrl: local('Logo_DR-SCHNELL.webp'),
  },
  {
    name: 'Kiehl',
    alt: 'Kiehl Logo – Bodenpflege, Reinigungsmittel und Objektpflege',
    category: 'hygiene',
    areas: ['Bodenpflege', 'Reinigungsmittel', 'Objektpflege'],
    domain: 'kiehl.de',
    logoUrl: local('Producator_Hygiero.ro-KIEHL.png'),
  },
  {
    name: 'Ecolab',
    alt: 'Ecolab Logo – Hygiene, professionelle Reinigungssysteme und Großkundenlösungen',
    category: 'hygiene',
    areas: ['Hygiene', 'Professionelle Reinigungssysteme', 'Großkundenlösungen'],
    domain: 'ecolab.com',
    logoUrl: local('ecolab.svg'),
  },
  {
    name: 'Diversey',
    alt: 'Diversey Logo – Hygienekonzepte, Reinigungssysteme und professionelle Lösungen',
    category: 'hygiene',
    areas: ['Hygienekonzepte', 'Reinigungssysteme', 'Professionelle Lösungen'],
    domain: 'diversey.com',
    logoUrl: local('diversey.png'),
  },
  {
    name: 'Makita',
    alt: 'Makita Logo – professionelle Elektrowerkzeuge, Hausmeisterservice und Außenpflege',
    category: 'tools',
    areas: ['Professionelle Elektrowerkzeuge', 'Hausmeisterservice', 'Außenpflege'],
    domain: 'makita.de',
    logoUrl: local('makita.svg'),
  },
  {
    name: 'Festool',
    alt: 'Festool Logo – professionelle Werkzeuge für Renovierungs- und Sonderarbeiten',
    category: 'tools',
    areas: ['Professionelle Werkzeuge', 'Renovierungs- und Sonderarbeiten'],
    domain: 'festool.de',
    logoUrl: local('festool.svg'),
  },
  {
    name: 'Kärcher Professional',
    alt: 'Kärcher Professional Logo – Maschinenpark und gewerbliche Reinigungstechnik',
    category: 'tools',
    areas: ['Maschinenpark', 'Gewerbliche Reinigungstechnik'],
    domain: 'kaercher.com',
    logoUrl: local('kaercher.svg'),
  },
];
