// src/app/data/pageHeaders.js
// Header content and configuration for all inner pages.

export const pageHeaders = {
  about: {
    variant: 'light',
    badge: 'WHO WE ARE',
    title: 'Pioneering Your Global Education & Career Pathways',
    description:
      'For over a decade, YTC Global Education has stood as a trusted partner, empowering ambitious students and professionals to unlock opportunities worldwide.',
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'About Us', href: '/about' },
    ],
    image: '/images/why-choose-student.jpg',
    imageAlt: 'YTC Global Education Team & Students',
  },

  services: {
    variant: 'light',
    badge: 'OUR SERVICES',
    title: 'End-to-End International Solutions',
    description:
      'From university matching and visa processing to IELTS preparation and post-arrival settlement, explore comprehensive support tailored to your goals.',
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Services', href: '/services' },
    ],
    image: '/images/hero-student.jpg',
    imageAlt: 'Global Education Services Consultation',
  },

  contact: {
    variant: 'light',
    badge: 'GET IN TOUCH',
    title: 'Contact Our Global Education Counselors',
    description:
      'Have questions about universities, visas, or career opportunities abroad? Speak with our certified advisors or visit one of our international offices.',
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Contact Us', href: '/contact' },
    ],
  },

  'study-abroad': {
    variant: 'light',
    badge: 'GLOBAL DESTINATIONS',
    title: 'Explore Premier Study Destinations Worldwide',
    description:
      'Compare top-ranked countries, admission standards, tuition ranges, and post-study work authorization across 8 major international education hubs.',
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Study Abroad', href: '/study-abroad' },
    ],
    hasSearch: true,
  },

  'partner-universities': {
    variant: 'search',
    badge: 'PARTNER INSTITUTION DIRECTORY',
    title: 'Search Top Partner Universities Worldwide',
    description:
      'Explore and filter through 500+ QS-ranked partner universities across our 8 global study destinations. Compare tuition fees, popular programs, locations, and admission requirements.',
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Study Abroad', href: '/study-abroad' },
      { label: 'Partner Universities', href: '/partner-universities' },
    ],
  },

  destinations: {
    variant: 'search',
    badge: 'DESTINATION DIRECTORY',
    title: 'Destination-wise Education & Career Listing',
    description:
      'Browse and filter global destinations by region, post-study work policies, and institutional strengths to find your ideal international pathway.',
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Destinations', href: '/destinations' },
    ],
  },

  'overseas-recruitment': {
    variant: 'split',
    badge: 'GLOBAL MANPOWER & CAREERS',
    title: 'Work Abroad With Confidence & Professional Security',
    description:
      'Connecting qualified specialists in Healthcare, Hospitality, Construction, and IT with vetted international employers and structured visa facilitation.',
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Overseas Recruitment', href: '/overseas-recruitment' },
    ],
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'International Professionals Working Abroad',
    accentColor: '#FF6A00', // Warm orange accent to differentiate recruitment from study
    accentBg: 'bg-orange-500',
    accentText: 'text-orange-500',
    accentBorder: 'border-orange-500',
    chips: ['Healthcare', 'Hospitality', 'Construction', 'IT & Engineering'],
  },

  blog: {
    variant: 'light',
    badge: 'LATEST INSIGHTS & ARTICLES',
    title: 'Study Abroad Guides, Visa Updates & Career Tips',
    description:
      'Stay informed with the latest university admission deadlines, visa regulations, scholarship announcements, and international student living guides.',
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Blog', href: '/blog' },
    ],
  },
};

export default pageHeaders;

