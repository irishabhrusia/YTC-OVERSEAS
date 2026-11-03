/**
 * navLinks.js
 * Central configuration for the site navigation.
 * Edit labels, hrefs, dropdown items, flags, icons, and descriptions here —
 * no need to touch Header.jsx.
 */

export const STUDY_ROUTE = '/study-abroad';
export const CONTACT_ROUTE = '/contact';

// ─────────────────────────────────────────────────────────────────
// Study Destinations — countries with flags & taglines
// variant: 'countries'  →  Header renders the rich flag-card panel
// ─────────────────────────────────────────────────────────────────
const studyCountries = [
  {
    label: 'USA',
    flag: '🇺🇸',
    flagImg: '/flags/usa.svg',
    tagline: '200+ partner universities',
    href: `${STUDY_ROUTE}/usa`,
  },
  {
    label: 'UK',
    flag: '🇬🇧',
    flagImg: '/flags/uk.svg',
    tagline: 'World-class education hub',
    href: `${STUDY_ROUTE}/uk`,
  },
  {
    label: 'Canada',
    flag: '🇨🇦',
    flagImg: '/flags/canada.svg',
    tagline: 'Post-study work visa',
    href: `${STUDY_ROUTE}/canada`,
  },
  {
    label: 'Australia',
    flag: '🇦🇺',
    flagImg: '/flags/australia.svg',
    tagline: 'Top QS-ranked colleges',
    href: `${STUDY_ROUTE}/australia`,
  },
  {
    label: 'Germany',
    flag: '🇩🇪',
    flagImg: '/flags/germany.svg',
    tagline: 'Free & affordable tuition',
    href: `${STUDY_ROUTE}/germany`,
  },
  {
    label: 'Ireland',
    flag: '🇮🇪',
    flagImg: '/flags/ireland.svg',
    tagline: 'EU gateway for students',
    href: `${STUDY_ROUTE}/ireland`,
  },
  {
    label: 'New Zealand',
    flag: '🇳🇿',
    flagImg: '/flags/new-zealand.svg',
    tagline: 'Safe & welcoming nation',
    href: `${STUDY_ROUTE}/new-zealand`,
  },
  {
    label: 'UAE',
    flag: '🇦🇪',
    flagImg: '/flags/uae.svg',
    tagline: 'Middle East study hub',
    href: `${STUDY_ROUTE}/uae`,
  },
];

// ─────────────────────────────────────────────────────────────────
// Services — groups with icon names (resolved in Header.jsx)
// variant: 'services'  →  Header renders the icon-list panel
// ─────────────────────────────────────────────────────────────────
export const serviceGroups = [
  {
    heading: 'Study Abroad Services',
    // accent colour applied to the heading pill & icon bg
    accent: 'blue',
    items: [
      {
        label: 'University Selection & Application',
        icon: 'GraduationCap',
        href: '/services/university-selection',
      },
      {
        label: 'Visa Guidance & Documentation',
        icon: 'FileText',
        href: '/services/visa-guidance',
      },
      {
        label: 'IELTS / Test Preparation',
        icon: 'BookOpen',
        href: '/services/ielts-preparation',
      },
      {
        label: 'Accommodation Assistance',
        icon: 'Home',
        href: '/services/accommodation-assistance',
      },
    ],
  },
  {
    heading: 'Recruitment Services',
    accent: 'violet',
    items: [
      {
        label: 'Overseas Recruitment Solutions',
        icon: 'Globe',
        href: '/services/overseas-recruitment',
      },
      {
        label: 'Talent Sourcing & Screening',
        icon: 'Users',
        href: '/services/talent-sourcing',
      },
      {
        label: 'Employer Partnerships',
        icon: 'Building2',
        href: '/services/employer-partnerships',
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────
// Main nav links  (client-approved order)
// type: 'link'     – plain anchor
//       'dropdown' – renders a dropdown panel
// variant (dropdown only):
//   'countries' – rich flag-card grid
//   'services'  – grouped icon list
// ─────────────────────────────────────────────────────────────────
const navLinks = [
  {
    id: 'home',
    label: 'Home',
    href: '/',
    type: 'link',
  },
  {
    id: 'about',
    label: 'About Us',
    href: '/about',
    type: 'link',
  },
  {
    id: 'study-destinations',
    label: 'Study Destinations',
    href: STUDY_ROUTE,
    type: 'dropdown',
    variant: 'countries',
    countries: studyCountries,
    searchHref: '/partner-universities',
  },
  {
    id: 'services',
    label: 'Services',
    href: '/services',
    type: 'link',
  },
  {
    id: 'overseas-recruitment',
    label: 'Overseas Recruitment',
    href: '/overseas-recruitment',
    type: 'link',
  },
  {
    id: 'blog',
    label: 'Blog',
    href: '/blog',
    type: 'link',
  },
  {
    id: 'contact',
    label: 'Contact Us',
    href: '/contact',
    type: 'link',
  },
];

export default navLinks;
