// server/scripts/seedContent.js
// Idempotent seeding script for website content: Countries, Universities, Courses, Services, Testimonials, FAQs, Partners, and Jobs.

const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('../config/db');

// Models
const Country = require('../models/Country');
const University = require('../models/University');
const Course = require('../models/Course');
const Service = require('../models/Service');
const Testimonial = require('../models/Testimonial');
const Blog = require('../models/Blog');
const Faq = require('../models/Faq');
const Partner = require('../models/Partner');
const Job = require('../models/Job');

const countriesData = [
  {
    slug: 'usa',
    name: 'United States of America',
    shortName: 'USA',
    code: 'US',
    flagPath: '/flags/usa.svg',
    heroImage: '/destinations/usa.webp',
    heroAlt: 'Statue of Liberty and New York City skyline, USA',
    accentColor: '#EF4444',
    badge: '3-Year STEM OPT',
    headline: 'World’s Premier Education & Research Powerhouse',
    description:
      'Home to the world’s most prestigious Ivy League institutions, Silicon Valley tech ecosystems, and flexible academic curricula with up to 3 years of STEM OPT post-study work authorization.',
    quickFacts: {
      capital: 'Washington, D.C.',
      currency: 'USD ($)',
      majorIntakes: 'Fall (Aug/Sep), Spring (Jan)',
      averageTuition: '$20,000 - $55,000 / Year',
      livingExpenses: '$12,000 - $20,000 / Year',
      visaProcessing: '3 - 8 Weeks',
      visaType: 'F-1 Student Visa',
    },
    stats: [
      { label: 'QS Top 100 Unis', value: '30+' },
      { label: 'Intl. Students', value: '1M+' },
      { label: 'Work Rights', value: '20 Hrs/Wk' },
      { label: 'Post-Study Work', value: 'Up to 3 Years' },
    ],
    whyStudy: [
      {
        title: 'Academic Prestige & Global Prestige',
        desc: 'American degrees are universally respected by Fortune 500 employers, academic institutions, and global tech leaders.',
      },
      {
        title: '3-Year STEM OPT Extension',
        desc: 'Graduates in Science, Technology, Engineering, and Math degrees can work in the US for up to 36 months after graduation.',
      },
    ],
    order: 1,
  },
  {
    slug: 'uk',
    name: 'United Kingdom',
    shortName: 'UK',
    code: 'GB',
    flagPath: '/flags/uk.svg',
    heroImage: '/destinations/uk.webp',
    heroAlt: 'Big Ben, Palace of Westminster, London, United Kingdom',
    accentColor: '#1E3A8A',
    badge: '2-Year Graduate Route',
    headline: 'Centuries of Academic Distinction & Global Influence',
    description:
      'Fast-track 1-year master’s and 3-year bachelor’s degrees from globally renowned Russell Group universities with a 2-year post-study work visa in financial and creative hubs.',
    quickFacts: {
      capital: 'London',
      currency: 'GBP (£)',
      majorIntakes: 'September/October, January',
      averageTuition: '£13,000 - £35,000 / Year',
      livingExpenses: '£9,000 - £15,000 / Year',
      visaProcessing: '3 - 4 Weeks',
      visaType: 'Student Visa (Tier 4)',
    },
    stats: [
      { label: 'QS Top 100 Unis', value: '17+' },
      { label: 'Intl. Students', value: '680K+' },
      { label: 'Degree Duration', value: '1-Yr Masters' },
      { label: 'Post-Study Work', value: '2 Years' },
    ],
    whyStudy: [
      {
        title: 'Time-Efficient 1-Year Masters',
        desc: 'Complete an internationally accredited master’s degree in just 12 months, reducing tuition costs and living expenditure.',
      },
      {
        title: '2-Year Graduate Route PSW',
        desc: 'Unsponsored work visa enabling graduates to work in any sector across the UK for 2 years (3 years for PhDs).',
      },
    ],
    order: 2,
  },
  {
    slug: 'canada',
    name: 'Canada',
    shortName: 'Canada',
    code: 'CA',
    flagPath: '/flags/canada.svg',
    heroImage: '/destinations/canada.webp',
    heroAlt: 'Toronto skyline with CN Tower at twilight, Canada',
    accentColor: '#DC2626',
    badge: 'Up to 3-Year PGWP',
    headline: 'High-Quality Education with Clear Permanent Residency Pathways',
    description:
      'World-class universities, welcoming multicultural cities, affordable tuition relative to other Anglophone countries, and generous Post-Graduation Work Permits (PGWP).',
    quickFacts: {
      capital: 'Ottawa',
      currency: 'CAD ($)',
      majorIntakes: 'September (Fall), January (Winter), May (Spring)',
      averageTuition: 'CAD 18,000 - 45,000 / Year',
      livingExpenses: 'CAD 12,000 - 18,000 / Year',
      visaProcessing: '4 - 10 Weeks',
      visaType: 'Study Permit',
    },
    stats: [
      { label: 'QS Top 100 Unis', value: '8+' },
      { label: 'Intl. Students', value: '800K+' },
      { label: 'Work Rights', value: '20 Hrs/Wk' },
      { label: 'Post-Study Work', value: 'Up to 3 Years' },
    ],
    whyStudy: [
      {
        title: 'Straightforward Post-Study Work Permit',
        desc: 'Graduates of designated learning institutions can secure up to 3 years of open work authorization with PGWP.',
      },
      {
        title: 'Direct Pathways to Permanent Residency',
        desc: 'Canadian education and work experience award high points under Express Entry and Provincial Nominee Programs (PNP).',
      },
    ],
    order: 3,
  },
  {
    slug: 'australia',
    name: 'Australia',
    shortName: 'Australia',
    code: 'AU',
    flagPath: '/flags/australia.svg',
    heroImage: '/destinations/australia.webp',
    heroAlt: 'Sydney Opera House and Harbour Bridge, Australia',
    accentColor: '#059669',
    badge: 'Extended PSW Visa',
    headline: 'World-Leading Research & Unmatched Quality of Life',
    description:
      'Home to the renowned Group of Eight (Go8) universities, high minimum wage, sunshine, and post-study work rights in major metropolitan and regional hubs.',
    quickFacts: {
      capital: 'Canberra',
      currency: 'AUD ($)',
      majorIntakes: 'February (Semester 1), July (Semester 2)',
      averageTuition: 'AUD 22,000 - 50,000 / Year',
      livingExpenses: 'AUD 21,000 - 26,000 / Year',
      visaProcessing: '4 - 8 Weeks',
      visaType: 'Student Visa (Subclass 500)',
    },
    stats: [
      { label: 'QS Top 100 Unis', value: '9+' },
      { label: 'Intl. Students', value: '600K+' },
      { label: 'Work Rights', value: '48 Hrs/Fortnight' },
      { label: 'Post-Study Work', value: 'Up to 4 Years' },
    ],
    whyStudy: [
      {
        title: 'Group of Eight (Go8) Research Excellence',
        desc: 'Study at top-tier universities consistently ranked within the world’s top 50 in science, engineering, and medicine.',
      },
    ],
    order: 4,
  },
  {
    slug: 'germany',
    name: 'Germany',
    shortName: 'Germany',
    code: 'DE',
    flagPath: '/flags/germany.svg',
    heroImage: '/destinations/germany.webp',
    heroAlt: 'Brandenburg Gate in Berlin, Germany at sunset',
    accentColor: '#D97706',
    badge: 'Tuition-Free Public Unis',
    headline: 'Engineering Excellence & Tuition-Free Top Universities',
    description:
      'Europe’s industrial superpower offering tuition-free education at public universities, thousands of English-taught programs, and an 18-month job seeker visa.',
    quickFacts: {
      capital: 'Berlin',
      currency: 'EUR (€)',
      majorIntakes: 'Winter (October), Summer (April)',
      averageTuition: '€0 - €3,000 / Year (Public)',
      livingExpenses: '€10,500 - €12,500 / Year',
      visaProcessing: '6 - 12 Weeks',
      visaType: 'National Visa (Category D)',
    },
    stats: [
      { label: 'Tuition in Public Unis', value: '€0 Tuition' },
      { label: 'Intl. Students', value: '400K+' },
      { label: 'Work Rights', value: '120 Full Days/Yr' },
      { label: 'Post-Study Visa', value: '18 Months' },
    ],
    whyStudy: [
      {
        title: 'Zero Tuition Fees at Public Universities',
        desc: 'Most public universities charge only a nominal semester administration fee (€150–€350) including regional public transport.',
      },
    ],
    order: 5,
  },
  {
    slug: 'ireland',
    name: 'Ireland',
    shortName: 'Ireland',
    code: 'IE',
    flagPath: '/flags/ireland.svg',
    heroImage: '/destinations/ireland.webp',
    heroAlt: 'Dublin Castle and River Liffey, Ireland',
    accentColor: '#10B981',
    badge: 'European Silicon Valley',
    headline: 'Europe’s Thriving Tech & Pharmaceutical Headquarters Hub',
    description:
      'English-speaking European nation hosting EMEA headquarters for Google, Apple, Meta, and Pfizer with a 2-year Third Level Graduate work visa.',
    quickFacts: {
      capital: 'Dublin',
      currency: 'EUR (€)',
      majorIntakes: 'September/October, January',
      averageTuition: '€11,000 - €26,000 / Year',
      livingExpenses: '€10,000 - €14,000 / Year',
      visaProcessing: '4 - 8 Weeks',
      visaType: 'Stamp 2 Student Visa',
    },
    stats: [
      { label: 'Top Tech EMEA HQs', value: '1,000+' },
      { label: 'Intl. Students', value: '35K+' },
      { label: 'Work Rights', value: '20 Hrs/Wk' },
      { label: 'Post-Study Work', value: '2 Years' },
    ],
    order: 6,
  },
  {
    slug: 'uae',
    name: 'United Arab Emirates',
    shortName: 'UAE',
    code: 'AE',
    flagPath: '/flags/uae.svg',
    heroImage: '/destinations/uae.webp',
    heroAlt: 'Downtown Dubai skyline and Burj Khalifa, United Arab Emirates',
    accentColor: '#10B981',
    badge: 'Tax-Free Career Hub',
    headline: 'Global Gateway with International Branch Campuses & Tax-Free Earnings',
    description:
      'Premier education hub in Dubai & Abu Dhabi featuring branch campuses of world-renowned universities with zero income tax and 10-year Golden Visa opportunities.',
    quickFacts: {
      capital: 'Abu Dhabi',
      currency: 'AED (د.إ)',
      majorIntakes: 'September, January',
      averageTuition: 'AED 40,000 - 90,000 / Year',
      livingExpenses: 'AED 35,000 - 55,000 / Year',
      visaProcessing: '2 - 4 Weeks',
      visaType: 'Student Residence Visa',
    },
    stats: [
      { label: 'Global Branch Campuses', value: '30+' },
      { label: 'Income Tax', value: '0% Tax' },
      { label: 'Golden Visa', value: '10 Years' },
      { label: 'Placement Rate', value: '94%' },
    ],
    order: 7,
  },
];

const faqsData = [
  {
    question: 'How much does it cost to study abroad?',
    answer:
      'Costs vary by country and university. Tuition can range from $0 (Germany public universities) to $50,000+ per year (USA Ivy League). Living costs add $8,000–$25,000/year. We help you find scholarships and education loans to reduce out-of-pocket expenses.',
    category: 'Finance',
    order: 1,
  },
  {
    question: 'Do I need IELTS or PTE to study abroad?',
    answer:
      'Most English-speaking countries (UK, Canada, Australia, USA) require an English proficiency test like IELTS, TOEFL, or PTE. Some European countries may waive this for applicants with English-medium prior education. We guide you on minimum scores required per university.',
    category: 'Admissions',
    order: 2,
  },
  {
    question: 'How does the student visa process work?',
    answer:
      'After receiving an offer letter from your university, our visa team prepares your financial documents, Statement of Purpose, and application. We also conduct mock embassy interviews. Processing times range from 3 to 10 weeks depending on the country.',
    category: 'Visa',
    order: 3,
  },
  {
    question: 'Are there scholarships available for international students?',
    answer:
      'Yes! Many universities offer merit-based and need-based scholarships. Government scholarships such as Chevening (UK), Vanier (Canada), and Australia Awards are also available. We match your profile to the best scholarship opportunities.',
    category: 'Finance',
    order: 4,
  },
  {
    question: 'Can I work while studying abroad?',
    answer:
      'Yes. Most countries allow part-time work during studies — Canada (20 hrs/week), UK (20 hrs/week), Australia (48 hrs/fortnight), and Germany (120 full days/year). We provide full work-rights briefing for your destination.',
    category: 'Work Rights',
    order: 5,
  },
  {
    question: 'What is the overseas recruitment process?',
    answer:
      'We register your profile, match you with suitable employers in the UAE, UK, Europe, or other destinations, and guide you through interviews, offer letters, and work-permit documentation. We place candidates in healthcare, hospitality, construction, and IT roles.',
    category: 'Recruitment',
    order: 6,
  },
];

const servicesDataList = [
  {
    title: 'University Selection & Application',
    slug: 'university-selection',
    description:
      'Strategic institutional matching and flawless application submissions to top QS-ranked universities worldwide.',
    icon: 'GraduationCap',
    group: 'study',
    order: 1,
  },
  {
    title: 'Scholarship & Financial Aid Guidance',
    slug: 'scholarships',
    description:
      'Profile-based scholarship identification, essay refinement, and documentation to maximize merit and need-based awards.',
    icon: 'Award',
    group: 'study',
    order: 2,
  },
  {
    title: 'Student Visa Filing & Mock Interviews',
    slug: 'visa-filing',
    description:
      'High-success-rate visa filing, financial dossier preparation, and mock interview coaching tailored to embassy expectations.',
    icon: 'FileCheck',
    group: 'study',
    order: 3,
  },
  {
    title: 'Overseas Talent Recruitment',
    slug: 'overseas-talent-recruitment',
    description:
      'End-to-end international job placements for skilled healthcare, engineering, hospitality, and IT professionals with verified global employers.',
    icon: 'Briefcase',
    group: 'recruitment',
    order: 4,
  },
  {
    title: 'Employer Workforce Solutions',
    slug: 'employer-workforce-solutions',
    description:
      'Volume manpower deployment, pre-screened international talent acquisition, and compliance with foreign labor ministries.',
    icon: 'Building2',
    group: 'recruitment',
    order: 5,
  },
];

const testimonialsData = [
  {
    studentName: 'Priya Sharma',
    photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=200&q=80',
    country: 'Canada',
    university: 'University of Toronto',
    course: 'MSc Computer Science',
    result: 'Student Visa Approved — Fall 2026',
    text: 'YTC counselors guided me every single step from university selection to SOP writing and visa approval. Got my Canadian visa in just 3 weeks!',
    rating: 5,
    type: 'success_story',
    order: 1,
  },
  {
    studentName: 'Aditya Verma',
    photo: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=200&q=80',
    country: 'UK',
    university: 'University of Manchester',
    course: 'MBA — Business Analytics',
    result: 'Offer Letter Received & Visa Stamped',
    text: 'The 1-on-1 counseling made all the difference. They helped me get an £8,000 scholarship and prepared me thoroughly for the visa interview.',
    rating: 5,
    type: 'testimonial',
    order: 2,
  },
  {
    studentName: 'Sneha Patel',
    photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=200&q=80',
    country: 'Australia',
    university: 'University of Melbourne',
    course: 'BEng Civil Engineering',
    result: 'Admitted with Merit Scholarship',
    text: 'Extremely grateful to the overseas recruitment and education team. Their guidance for Australia Subclass 500 visa was flawless.',
    rating: 5,
    type: 'success_story',
    order: 3,
  },
];

const partnersData = [
  { name: 'University of Oxford', logo: '/flags/uk.svg', website: 'https://ox.ac.uk', order: 1 },
  { name: 'University of Toronto', logo: '/flags/canada.svg', website: 'https://utoronto.ca', order: 2 },
  { name: 'University of Melbourne', logo: '/flags/australia.svg', website: 'https://unimelb.edu.au', order: 3 },
  { name: 'Harvard University', logo: '/flags/usa.svg', website: 'https://harvard.edu', order: 4 },
  { name: 'Technical University of Munich', logo: '/flags/germany.svg', website: 'https://tum.de', order: 5 },
  { name: 'Trinity College Dublin', logo: '/flags/ireland.svg', website: 'https://tcd.ie', order: 6 },
];

const jobsData = [
  {
    title: 'Senior ICU Registered Nurse',
    slug: 'senior-icu-registered-nurse',
    category: 'Healthcare',
    country: 'United Kingdom',
    city: 'Manchester',
    salaryRange: '£36,000 - £44,000 / Year',
    experienceRequired: '3+ Years',
    description:
      'NHS Trust Hospital is seeking qualified ICU nurses with NMC registration support and full visa sponsorship.',
    requirements: ['B.Sc in Nursing', 'IELTS 7.0 or OET Grade B', 'Minimum 3 years in Critical Care'],
    benefits: ['Certificate of Sponsorship (Tier 2)', 'Relocation flight allowance', '27 days paid holiday'],
    openings: 12,
    order: 1,
  },
  {
    title: 'Executive Sous Chef',
    slug: 'executive-sous-chef',
    category: 'Hospitality',
    country: 'United Arab Emirates',
    city: 'Dubai',
    salaryRange: 'AED 14,000 - 18,000 / Month',
    experienceRequired: '4+ Years',
    description:
      'Luxury 5-star beachfront resort in Dubai seeking an accomplished Executive Sous Chef specializing in international cuisine.',
    requirements: ['Culinary Arts Degree or Diploma', 'Experience in luxury hotel kitchens', 'HACCP Certified'],
    benefits: ['Accommodation provided', 'Annual return flight tickets', 'Medical insurance'],
    openings: 3,
    order: 2,
  },
  {
    title: 'Cloud DevOps Engineer',
    slug: 'cloud-devops-engineer',
    category: 'IT and Engineering',
    country: 'Germany',
    city: 'Munich',
    salaryRange: '€65,000 - €80,000 / Year',
    experienceRequired: '4+ Years',
    description:
      'Leading German enterprise SaaS provider hiring DevOps specialists for Kubernetes cloud modernization projects.',
    requirements: ['B.Tech/B.E in Computer Science or IT', 'Hands-on experience with AWS, Terraform, Docker, K8s', 'B1 German preferred but English fluent accepted'],
    benefits: ['EU Blue Card visa sponsorship', 'Hybrid working arrangement', 'Public transport subvention'],
    openings: 5,
    order: 3,
  },
];

const seedContent = async () => {
  try {
    await connectDB();
    console.log('--- Starting Content Seeding ---');

    // 1. Seed Countries
    console.log('Seeding Countries...');
    for (const country of countriesData) {
      await Country.findOneAndUpdate({ slug: country.slug }, country, {
        upsert: true,
        returnDocument: 'after',
      });
    }
    console.log(`✓ Seeded ${countriesData.length} countries.`);

    // Map countries by slug for referencing
    const countryMap = {};
    const allCountries = await Country.find();
    allCountries.forEach((c) => {
      countryMap[c.slug] = c._id;
    });

    // 2. Seed Universities
    console.log('Seeding Universities...');
    const universitiesSeedList = [
      {
        name: 'University of Toronto',
        slug: 'university-of-toronto',
        country: countryMap['canada'] || allCountries[0]._id,
        city: 'Toronto, ON',
        ranking: '#21 QS World',
        tuitionFrom: 35000,
        tuitionTo: 58000,
        intakes: ['September', 'January'],
        website: 'https://utoronto.ca',
        popularCourses: ['Computer Science', 'Commerce', 'Engineering'],
        isFeatured: true,
        order: 1,
      },
      {
        name: 'University of Oxford',
        slug: 'university-of-oxford',
        country: countryMap['uk'] || allCountries[0]._id,
        city: 'Oxford',
        ranking: '#3 QS World',
        tuitionFrom: 28000,
        tuitionTo: 45000,
        intakes: ['October'],
        website: 'https://ox.ac.uk',
        popularCourses: ['Philosophy', 'Economics', 'Law', 'Medicine'],
        isFeatured: true,
        order: 2,
      },
      {
        name: 'University of Melbourne',
        slug: 'university-of-melbourne',
        country: countryMap['australia'] || allCountries[0]._id,
        city: 'Melbourne, VIC',
        ranking: '#14 QS World',
        tuitionFrom: 32000,
        tuitionTo: 48000,
        intakes: ['February', 'July'],
        website: 'https://unimelb.edu.au',
        popularCourses: ['Biomedicine', 'Architecture', 'Data Science'],
        isFeatured: true,
        order: 3,
      },
      {
        name: 'Harvard University',
        slug: 'harvard-university',
        country: countryMap['usa'] || allCountries[0]._id,
        city: 'Cambridge, MA',
        ranking: '#4 QS World',
        tuitionFrom: 54000,
        tuitionTo: 65000,
        intakes: ['September'],
        website: 'https://harvard.edu',
        popularCourses: ['Business (MBA)', 'Law', 'Computer Science'],
        isFeatured: true,
        order: 4,
      },
      {
        name: 'Technical University of Munich (TUM)',
        slug: 'technical-university-of-munich',
        country: countryMap['germany'] || allCountries[0]._id,
        city: 'Munich, Bavaria',
        ranking: '#37 QS World',
        tuitionFrom: 0,
        tuitionTo: 4000,
        intakes: ['October', 'April'],
        website: 'https://tum.de',
        popularCourses: ['Mechanical Engineering', 'Informatics', 'AI'],
        isFeatured: true,
        order: 5,
      },
      {
        name: 'Trinity College Dublin',
        slug: 'trinity-college-dublin',
        country: countryMap['ireland'] || allCountries[0]._id,
        city: 'Dublin',
        ranking: '#81 QS World',
        tuitionFrom: 18000,
        tuitionTo: 30000,
        intakes: ['September'],
        website: 'https://tcd.ie',
        popularCourses: ['Biotechnology', 'Computer Science', 'Business'],
        isFeatured: true,
        order: 6,
      },
    ];

    for (const uni of universitiesSeedList) {
      await University.findOneAndUpdate({ slug: uni.slug }, uni, {
        upsert: true,
        returnDocument: 'after',
      });
    }
    console.log(`✓ Seeded ${universitiesSeedList.length} universities.`);

    // 3. Seed Courses
    console.log('Seeding Courses...');
    const coursesSeedList = [
      {
        name: 'Master of Science in Computer Science',
        slug: 'msc-computer-science',
        category: 'Information Technology',
        level: 'Master',
        duration: '1-2 Years',
        description: 'Advanced computing, algorithms, machine learning, and software architecture.',
        countries: allCountries.map((c) => c._id),
        isPopular: true,
        order: 1,
      },
      {
        name: 'Master of Business Administration (MBA)',
        slug: 'mba-international-business',
        category: 'Business & Management',
        level: 'Master',
        duration: '1-2 Years',
        description: 'Global leadership, financial analytics, strategic marketing, and venture creation.',
        countries: allCountries.map((c) => c._id),
        isPopular: true,
        order: 2,
      },
      {
        name: 'Bachelor of Science in Data Science & AI',
        slug: 'bsc-data-science-ai',
        category: 'Information Technology',
        level: 'Bachelor',
        duration: '3-4 Years',
        description: 'Predictive modeling, deep learning, big data engineering, and statistics.',
        countries: allCountries.map((c) => c._id),
        isPopular: true,
        order: 3,
      },
      {
        name: 'Postgraduate Diploma in Nursing Practice',
        slug: 'pg-diploma-nursing',
        category: 'Healthcare',
        level: 'Diploma',
        duration: '1 Year',
        description: 'Clinical competencies, emergency care, and patient triage protocols.',
        countries: [countryMap['uk'], countryMap['canada']].filter(Boolean),
        isPopular: true,
        order: 4,
      },
    ];

    for (const course of coursesSeedList) {
      await Course.findOneAndUpdate({ slug: course.slug }, course, {
        upsert: true,
        returnDocument: 'after',
      });
    }
    console.log(`✓ Seeded ${coursesSeedList.length} courses.`);

    // 4. Seed Services
    console.log('Seeding Services...');
    for (const service of servicesDataList) {
      await Service.findOneAndUpdate({ slug: service.slug }, service, {
        upsert: true,
        returnDocument: 'after',
      });
    }
    console.log(`✓ Seeded ${servicesDataList.length} services.`);

    // 5. Seed Testimonials
    console.log('Seeding Testimonials & Success Stories...');
    for (const testm of testimonialsData) {
      await Testimonial.findOneAndUpdate({ studentName: testm.studentName }, testm, {
        upsert: true,
        returnDocument: 'after',
      });
    }
    console.log(`✓ Seeded ${testimonialsData.length} testimonials.`);

    // 6. Seed FAQs
    console.log('Seeding FAQs...');
    for (const faq of faqsData) {
      await Faq.findOneAndUpdate({ question: faq.question }, faq, {
        upsert: true,
        returnDocument: 'after',
      });
    }
    console.log(`✓ Seeded ${faqsData.length} FAQs.`);

    // 7. Seed Partners
    console.log('Seeding Partners...');
    for (const partner of partnersData) {
      await Partner.findOneAndUpdate({ name: partner.name }, partner, {
        upsert: true,
        returnDocument: 'after',
      });
    }
    console.log(`✓ Seeded ${partnersData.length} partners.`);

    // 8. Seed Recruitment Jobs
    console.log('Seeding Jobs...');
    for (const job of jobsData) {
      await Job.findOneAndUpdate({ slug: job.slug }, job, {
        upsert: true,
        returnDocument: 'after',
      });
    }
    console.log(`✓ Seeded ${jobsData.length} jobs.`);

    console.log('--- Content Seeding Completed Successfully ---');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding content:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedContent();
