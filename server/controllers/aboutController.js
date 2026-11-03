const AboutContent = require('../models/AboutContent');
const asyncHandler = require('../utils/asyncHandler');

const defaultAbout = {
  header: {
    badge: 'WHO WE ARE',
    title: 'Pioneering Your Global Education & Career Pathways',
    description:
      'For over a decade, YTC Global Education has stood as a trusted partner, empowering ambitious students and professionals to unlock opportunities worldwide.',
    image: '/images/why-choose-student.jpg',
    imageAlt: 'YTC Global Education Team & Students',
  },
  aboutStats: [
    { value: '10+', label: 'Years of Experience', detail: 'Guiding global ambitions since 2015' },
    { value: '10K+', label: 'Students Placed', detail: 'Across top QS-ranked universities' },
    { value: '98%', label: 'Visa Success Rate', detail: 'Document verification & mock interviews' },
    { value: '50+', label: 'University Partners', detail: 'Direct tie-ups in 15+ countries' },
  ],
  briefHistory: {
    tag: 'OUR HERITAGE & ORIGINS',
    title: 'A Decade of Uncompromising Ethics & Transformative Journeys',
    paragraphs: [
      'Founded in 2015, YTC Global Education emerged from a deeply personal experience. Our founders witnessed firsthand the widespread challenges aspiring international students encountered: misleading advice, opaque processing fees, and an alarming lack of post-visa guidance.',
      'Starting from a single counseling room with an unwavering philosophy of radical honesty, YTC set out to redefine overseas education advisory. We chose not to sell courses, but rather to curate personalized academic roadmaps aligned with each student’s genuine career passions, financial capacity, and long-term residency prospects.',
      'Over the past decade, that student-first ethos propelled YTC into a trusted cross-border mobility partner. Today, we manage accredited operations across four countries, boast direct articulation agreements with 50+ world-class universities, and operate an overseas recruitment wing connecting skilled talent with global industry leaders.',
    ],
    quote: {
      text: "Education abroad isn't merely about getting a visa stamp; it's about altering the trajectory of a family's future for generations. That responsibility demands our absolute best every single day.",
      author: 'Dr. Sarah Jenkins',
      designation: 'Founder & Managing Director, YTC Global Education',
    },
    highlights: [
      { year: '2015', label: 'Founded in humble counseling suite' },
      { year: '2018', label: 'Surpassed 1,000 successful visa approvals' },
      { year: '2021', label: 'Established global institutional partnerships' },
      { year: '2024', label: 'Expanded to overseas recruitment & multi-country offices' },
    ],
  },
  coreValues: [
    {
      icon: 'ShieldCheck',
      title: 'Integrity & Transparency',
      desc: 'Zero hidden fees, honest admission guidance, and realistic university matching based purely on merit and budget.',
      accent: 'blue',
    },
    {
      icon: 'Target',
      title: 'Student-Centric Approach',
      desc: 'Every student’s career vision is distinct. We customize SOPs, shortlists, and visa strategies to individual aspirations.',
      accent: 'indigo',
    },
    {
      icon: 'Award',
      title: 'Excellence & Precision',
      desc: 'Our certified counselors stay updated on dynamic embassy visa rules, scholarship deadlines, and global job requirements.',
      accent: 'cyan',
    },
    {
      icon: 'HeartHandshake',
      title: 'End-to-End Partnership',
      desc: 'From initial counseling and IELTS prep to airport pickup, housing, and post-arrival settlement, we never leave your side.',
      accent: 'emerald',
    },
  ],
  leadershipTeam: [
    {
      name: 'Dr. Sarah Jenkins',
      role: 'Founder & Managing Director',
      experience: '15+ Years in International Higher Ed',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      bio: 'Former university admissions panelist dedicated to making global education ethical, transparent, and accessible.',
      specialty: 'Global Strategy & Policy',
    },
    {
      name: 'Rahim Chowdhury',
      role: 'Head of Visa & Immigration Compliance',
      experience: '12+ Years Embassy Liaison Experience',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
      bio: 'Specialist in complex visa documentation, financial verifications, and mock consular interviews.',
      specialty: 'Canada & UK Visa Law',
    },
    {
      name: 'Elena Rostova',
      role: 'Director of University Partnerships',
      experience: '10+ Years Institution Relations',
      image: 'https://images.unsplash.com/photo-1580894732483-3c9451d02c46?auto=format&fit=crop&w=400&q=80',
      bio: 'Oversees direct agreements and scholarship opportunities with top North American and European universities.',
      specialty: 'Scholarships & Admissions',
    },
    {
      name: 'Anand Patel',
      role: 'Head of Overseas Recruitment',
      experience: '8+ Years Global Talent Sourcing',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
      bio: 'Connecting skilled professionals in Healthcare, IT, and Engineering with vetted multinational employers.',
      specialty: 'Corporate Placements',
    },
  ],
  recognitions: [
    {
      year: '2024',
      title: 'Excellence in Overseas Education Advisory',
      issuedBy: 'Global Higher Education Summit',
      description: 'Awarded for maintaining the highest ethical standards and verifiable 98% student visa success.',
      badge: 'Premier Award',
    },
    {
      year: '2023',
      title: 'Top Visa Performance Agency',
      issuedBy: 'International Student Mobility Forum',
      description: 'Recognized for zero documentation discrepancies and outstanding applicant preparation.',
      badge: 'Top Performer',
    },
    {
      year: '2023',
      title: 'Best Post-Arrival Student Support',
      issuedBy: 'Commonwealth Education Council',
      description: 'Honored for comprehensive accommodation, settlement, and airport pickup network across Canada & the UK.',
      badge: 'Student Choice',
    },
    {
      year: '2022',
      title: 'Distinguished University Recruitment Partner',
      issuedBy: 'North American University Alliance',
      description: 'Awarded for exemplary academic candidate screening and record student retention rates.',
      badge: 'Institution Trust',
    },
  ],
  partnerWithUs: {
    tag: 'GLOBAL COLLABORATIONS',
    title: 'Partner With YTC Global Education',
    subtitle:
      'Whether you represent a prestigious university, a multinational employer, or an academic affiliate, we cultivate mutually prosperous global partnerships.',
    categories: [
      {
        title: 'For Universities & Colleges',
        icon: 'Building2',
        description:
          'Expand your international student diversity with high-caliber, pre-assessed candidates. We manage document verification, interview coaching, and localized campus fairs.',
        perks: [
          'Direct access to pre-screened, credential-verified student pool',
          'In-country recruitment seminars & spot admissions support',
          'Comprehensive marketing & brand representation across South Asia',
          'Dedicated admissions relationship manager',
        ],
        ctaText: 'Partner as an Institution',
      },
      {
        title: 'For Global Employers & Manpower',
        icon: 'Briefcase',
        description:
          'Streamline your cross-border talent acquisition. We identify, assess, and prepare qualified professionals in Healthcare, Hospitality, Construction, and IT.',
        perks: [
          'Curated shortlist of qualified, job-ready international candidates',
          'End-to-end work permit, licensing & visa processing guidance',
          'Cultural adaptation & workplace English preparation',
          'Fast-track deployment to the UAE, UK, and Europe',
        ],
        ctaText: 'Hire Global Talent',
      },
      {
        title: 'For Sub-Agents & Academic Mentors',
        icon: 'Users',
        description:
          'Grow your counseling practice with our global university network, automated portal, and high commission revenue structures.',
        perks: [
          'Access to 50+ direct university applications worldwide',
          'Competitive commission split & prompt disbursement schedule',
          'Dedicated processing desk to handle visa files on your behalf',
          'Regular training webinars on changing immigration legislation',
        ],
        ctaText: 'Join Agent Network',
      },
    ],
  },
  offices: [
    {
      type: 'Global Headquarters',
      city: 'Dubai',
      country: 'United Arab Emirates',
      address: 'Level 14, Boulevard Plaza Tower 1, Downtown Dubai',
      phone: '+971 4 800 9821',
      email: 'dubai@ytcglobal.com',
      timing: 'Sun - Thu: 9:00 AM - 6:00 PM',
      mapQuery: 'Downtown Dubai',
      badge: 'Head Office',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=500&q=80',
    },
    {
      type: 'Regional Admissions HQ',
      city: 'New Delhi',
      country: 'India',
      address: 'Suite 402, Connaught Place, Inner Circle, New Delhi',
      phone: '+91 11 4987 6500',
      email: 'delhi@ytcglobal.com',
      timing: 'Mon - Sat: 9:30 AM - 6:30 PM',
      mapQuery: 'Connaught Place New Delhi',
      badge: 'Admissions Hub',
      image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=500&q=80',
    },
    {
      type: 'UK & Europe Liaison Office',
      city: 'London',
      country: 'United Kingdom',
      address: '88 Kingsway, Holborn, London WC2B 6AA',
      phone: '+44 20 7946 0912',
      email: 'london@ytcglobal.com',
      timing: 'Mon - Fri: 9:00 AM - 5:30 PM',
      mapQuery: 'Kingsway Holborn London',
      badge: 'Student Support',
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=500&q=80',
    },
    {
      type: 'North America Liaison',
      city: 'Toronto',
      country: 'Canada',
      address: '250 University Avenue, Suite 200, Toronto, ON M5H 3E5',
      phone: '+1 416 555 0194',
      email: 'toronto@ytcglobal.com',
      timing: 'Mon - Fri: 9:00 AM - 5:00 PM',
      mapQuery: 'University Avenue Toronto',
      badge: 'Post-Arrival Hub',
      image: 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?auto=format&fit=crop&w=500&q=80',
    },
  ],
  accreditations: [
    { name: 'British Council Certified Agents', badge: 'Certified' },
    { name: 'ICEF Trained Agent Counselors', badge: 'Accredited' },
    { name: 'PIER Qualified Education Agents', badge: 'Recognized' },
    { name: 'AIRC Institutional Member', badge: 'Verified' },
    { name: 'NAFSA Global Education Association', badge: 'Member' },
  ],
  isActive: true,
};

function formatAboutResponse(doc) {
  if (!doc) return doc;
  const plain = doc.toObject ? doc.toObject() : { ...doc };

  if (plain.header) {
    plain.header.tag = plain.header.tag || plain.header.badge || '';
    plain.header.badge = plain.header.badge || plain.header.tag || '';
    plain.header.heroImage = plain.header.heroImage || plain.header.image || '';
    plain.header.image = plain.header.image || plain.header.heroImage || '';
  }

  if (plain.briefHistory) {
    const defaultParagraphs = defaultAbout.briefHistory.paragraphs || [];
    const paragraphs = (Array.isArray(plain.briefHistory.paragraphs) && plain.briefHistory.paragraphs.length > 0)
      ? plain.briefHistory.paragraphs
      : defaultParagraphs;
    plain.briefHistory.p1 = (plain.briefHistory.p1 && plain.briefHistory.p1.trim())
      ? plain.briefHistory.p1
      : (paragraphs[0] || defaultParagraphs[0] || '');
    plain.briefHistory.p2 = (plain.briefHistory.p2 && plain.briefHistory.p2.trim())
      ? plain.briefHistory.p2
      : (paragraphs[1] || defaultParagraphs[1] || '');
    plain.briefHistory.p3 = (plain.briefHistory.p3 && plain.briefHistory.p3.trim())
      ? plain.briefHistory.p3
      : (paragraphs[2] || defaultParagraphs[2] || '');
    plain.briefHistory.paragraphs = [plain.briefHistory.p1, plain.briefHistory.p2, plain.briefHistory.p3].filter(Boolean);
    if (plain.briefHistory.quote) {
      plain.briefHistory.quote.role = plain.briefHistory.quote.role || plain.briefHistory.quote.designation || '';
      plain.briefHistory.quote.designation = plain.briefHistory.quote.designation || plain.briefHistory.quote.role || '';
    }
    if (Array.isArray(plain.briefHistory.highlights) && (!plain.briefHistory.milestones || plain.briefHistory.milestones.length === 0)) {
      plain.briefHistory.milestones = plain.briefHistory.highlights.map((h) => ({
        year: h.year || '',
        title: h.label || '',
        desc: '',
      }));
    }
  }

  if (Array.isArray(plain.leadershipTeam)) {
    plain.leadershipTeam = plain.leadershipTeam.map((m) => ({
      ...m,
      photo: m.photo || m.image || '',
      image: m.image || m.photo || '',
    }));
  }

  if (Array.isArray(plain.offices)) {
    plain.offices = plain.offices.map((o) => ({
      ...o,
      photo: o.photo || o.image || '',
      image: o.image || o.photo || '',
      hours: o.hours || o.timing || '',
      timing: o.timing || o.hours || '',
    }));
  }

  return plain;
}

/**
 * Public GET /api/about
 * Retrieves about page content or initializes defaults
 */
const getAboutContent = asyncHandler(async (req, res) => {
  let about = await AboutContent.findOne();
  if (!about) {
    about = await AboutContent.create(defaultAbout);
  }

  res.status(200).json({
    success: true,
    data: formatAboutResponse(about),
  });
});

/**
 * Admin PUT/POST /api/admin/about
 * Updates or creates about page content
 */
const updateAboutContent = asyncHandler(async (req, res) => {
  let body = { ...req.body };

  // Normalize header aliases
  if (body.header) {
    if (body.header.tag && !body.header.badge) body.header.badge = body.header.tag;
    if (body.header.badge && !body.header.tag) body.header.tag = body.header.badge;
    if (body.header.heroImage && !body.header.image) body.header.image = body.header.heroImage;
    if (body.header.image && !body.header.heroImage) body.header.heroImage = body.header.image;
  }

  // Normalize briefHistory
  if (body.briefHistory) {
    const p1 = (body.briefHistory.p1 || '').trim();
    const p2 = (body.briefHistory.p2 || '').trim();
    const p3 = (body.briefHistory.p3 || '').trim();
    if (p1 || p2 || p3) {
      body.briefHistory.p1 = p1;
      body.briefHistory.p2 = p2;
      body.briefHistory.p3 = p3;
      body.briefHistory.paragraphs = [p1, p2, p3].filter(Boolean);
    } else if (Array.isArray(body.briefHistory.paragraphs) && body.briefHistory.paragraphs.length > 0) {
      body.briefHistory.p1 = body.briefHistory.paragraphs[0] || '';
      body.briefHistory.p2 = body.briefHistory.paragraphs[1] || '';
      body.briefHistory.p3 = body.briefHistory.paragraphs[2] || '';
    } else {
      // Fallback to defaults so paragraphs are never wiped out
      const defaultParas = defaultAbout.briefHistory.paragraphs || [];
      body.briefHistory.p1 = defaultParas[0] || '';
      body.briefHistory.p2 = defaultParas[1] || '';
      body.briefHistory.p3 = defaultParas[2] || '';
      body.briefHistory.paragraphs = defaultParas;
    }
    if (body.briefHistory.quote) {
      if (body.briefHistory.quote.role && !body.briefHistory.quote.designation) {
        body.briefHistory.quote.designation = body.briefHistory.quote.role;
      }
      if (body.briefHistory.quote.designation && !body.briefHistory.quote.role) {
        body.briefHistory.quote.role = body.briefHistory.quote.designation;
      }
    }
    if (Array.isArray(body.briefHistory.milestones) && body.briefHistory.milestones.length > 0) {
      body.briefHistory.highlights = body.briefHistory.milestones.map((m) => ({
        year: m.year || '',
        label: m.title ? `${m.title}${m.desc ? `: ${m.desc}` : ''}` : m.label || '',
      }));
    }
  }

  // Normalize leadershipTeam (photo vs image)
  if (Array.isArray(body.leadershipTeam)) {
    body.leadershipTeam = body.leadershipTeam.map((m) => ({
      ...m,
      image: m.photo || m.image || '',
      photo: m.photo || m.image || '',
    }));
  }

  // Normalize offices (photo vs image, hours vs timing)
  if (Array.isArray(body.offices)) {
    body.offices = body.offices.map((o) => ({
      ...o,
      image: o.photo || o.image || '',
      photo: o.photo || o.image || '',
      timing: o.hours || o.timing || '',
      hours: o.hours || o.timing || '',
    }));
  }

  let about = await AboutContent.findOne();
  if (!about) {
    about = await AboutContent.create({ ...defaultAbout, ...body });
  } else {
    about = await AboutContent.findByIdAndUpdate(about._id, body, {
      new: true,
      runValidators: false,
    });
  }

  res.status(200).json({
    success: true,
    message: 'About page content updated successfully',
    data: formatAboutResponse(about),
  });
});

module.exports = {
  getAboutContent,
  updateAboutContent,
};

