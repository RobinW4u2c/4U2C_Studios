// ============================================================
//  ZENTRALE INHALTS-KONFIGURATION
//  ALLES was du als Kunde ändern willst, liegt HIER.
//  Texte, Bilder, Videos, Kontaktdaten, Projekte.
// ============================================================

// --- BRAND / KONTAKT -----------------------------------------
export const SITE = {
  brand: '4U2C STUDIOS',
  owner: 'Robin Werdich',
  role: 'Fotograf & Videograf',
  tagline: 'Cinematic Stories. Frame by Frame.',
  // E-Mail Empfänger für das Kontaktformular (mailto-Fallback) – HIER ändern
  email: 'hello@4u2c-studios.de',
  phone: '+49 000 0000000',
  location: 'Ravensburg · Baden-Württemberg',
  socials: [
    { label: 'Instagram', href: 'https://instagram.com/' },     // HIER Link einsetzen
    { label: 'Vimeo', href: 'https://vimeo.com/' },              // HIER Link einsetzen
    { label: 'YouTube', href: 'https://youtube.com/' },          // HIER Link einsetzen
  ],
};

// --- NAVIGATION ----------------------------------------------
export const NAV = [
  { label: 'Work', href: '#work' },
  { label: 'Showreel', href: '#showcase' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

// --- HERO GALERIE (schwebende Fotos in der 3D-Welt) ----------
// Lege deine Bilder in /public/images ab und referenziere sie hier.
// Platzhalter-Pfade: ersetze durch echte Dateien.
export const HERO_PHOTOS: { src: string; position: [number, number, number]; scale: number }[] = [
  { src: '/images/shot-01.jpg', position: [-4.5, 1.2, -2], scale: 2.4 },
  { src: '/images/shot-02.jpg', position: [4.2, -0.8, -3.5], scale: 2.8 },
  { src: '/images/shot-03.jpg', position: [-2.5, -1.6, -6], scale: 2.2 },
  { src: '/images/shot-04.jpg', position: [3.0, 2.0, -7], scale: 2.0 },
  { src: '/images/shot-05.jpg', position: [0.0, 0.5, -10], scale: 3.2 },
  { src: '/images/shot-06.jpg', position: [-5.5, -2.0, -12], scale: 2.6 },
  { src: '/images/shot-07.jpg', position: [5.0, 1.5, -14], scale: 2.4 },
];

// --- FLOATING GALLERY (Section: Work) ------------------------
export const GALLERY: { src: string; title: string; category: string }[] = [
  { src: '/images/gallery-01.jpg', title: 'Northern Silence', category: 'Landscape' },
  { src: '/images/gallery-02.jpg', title: 'Concrete Dreams', category: 'Architecture' },
  { src: '/images/gallery-03.jpg', title: 'Golden Hour', category: 'Portrait' },
  { src: '/images/gallery-04.jpg', title: 'Velocity', category: 'Automotive' },
  { src: '/images/gallery-05.jpg', title: 'After Rain', category: 'Street' },
  { src: '/images/gallery-06.jpg', title: 'Wild Coast', category: 'Travel' },
];

// --- BEFORE / AFTER (RAW vs Final Edit) ----------------------
export const BEFORE_AFTER = {
  title: 'RAW → FINAL',
  subtitle: 'Color Grading & Post Production',
  before: '/images/ba-raw.jpg',    // unbearbeitetes RAW
  after: '/images/ba-final.jpg',   // finaler Grade
};

// --- VIDEO SHOWCASE ------------------------------------------
// Lege Videos in /public/videos ab. poster = Vorschaubild.
export const VIDEOS: {
  id: string;
  title: string;
  client: string;
  year: string;
  src: string;
  poster: string;
}[] = [
  {
    id: 'v1',
    title: 'Alpine Motion',
    client: 'Private Commission',
    year: '2025',
    src: '/videos/reel-01.mp4',
    poster: '/images/poster-01.jpg',
  },
  {
    id: 'v2',
    title: 'Urban Pulse',
    client: 'Brand Film',
    year: '2025',
    src: '/videos/reel-02.mp4',
    poster: '/images/poster-02.jpg',
  },
  {
    id: 'v3',
    title: 'Quiet Light',
    client: 'Documentary',
    year: '2024',
    src: '/videos/reel-03.mp4',
    poster: '/images/poster-03.jpg',
  },
];

// --- ABOUT ROBIN ---------------------------------------------
export const ABOUT = {
  portrait: '/images/robin-portrait.jpg', // Porträt von Robin
  heading: 'Behind the Lens',
  paragraphs: [
    'Ich bin Robin Werdich – Fotograf und Videograf mit einer Leidenschaft für cinematische Bildsprache. Unter 4U2C Studios entstehen visuelle Geschichten, die mehr zeigen als einen Moment.',
    'Mein Fokus liegt auf Licht, Komposition und Emotion. Ob Landschaft, Porträt oder Brand-Film – jedes Projekt bekommt eine eigene visuelle Handschrift.',
    'Von der ersten Idee über den Dreh bis zum finalen Color Grade begleite ich den gesamten Prozess. Produktionsreif, präzise und kompromisslos in der Qualität.',
  ],
  stats: [
    { value: '120+', label: 'Projekte' },
    { value: '8 Jahre', label: 'Erfahrung' },
    { value: '40+', label: 'Kunden' },
  ],
};

// --- KONTAKTFORMULAR OPTIONEN --------------------------------
export const PROJECT_TYPES = ['Fotografie', 'Videografie', 'Brand Film', 'Hochzeit', 'Event', 'Sonstiges'];
export const BUDGET_RANGES = ['< 2.000 €', '2.000 – 5.000 €', '5.000 – 10.000 €', '10.000 € +'];
