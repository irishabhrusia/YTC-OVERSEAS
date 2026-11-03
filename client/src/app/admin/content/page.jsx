'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  Globe,
  GraduationCap,
  Briefcase,
  BookOpen,
  HelpCircle,
  X,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  ExternalLink,
  Save,
  Star,
  ShieldCheck,
  Check,
  Award,
  Info,
  Users,
  MapPin,
  Building2,
  Target,
  Phone,
  Mail,
  Clock,
} from 'lucide-react';
import {
  getContentList,
  createContentItem,
  updateContentItem,
  deleteContentItem,
  getAdminHero,
  updateAdminHero,
  getAdminAbout,
  updateAdminAbout,
  getAdminFooter,
  updateAdminFooter,
  getAdminContact,
  updateAdminContact,
} from '../../lib/adminApi';
import ImageUploadWidget from '../../component/admin/ImageUploadWidget';
import HeroSection from '../../component/homesection/HeroSection';

const TABS = [
  { id: 'hero', label: 'Hero Section (Live Studio)', icon: Sparkles, singular: 'Hero Section' },
  { id: 'about', label: 'About Page Studio', icon: Info, singular: 'About Page' },
  { id: 'contact', label: 'Contact & Lounges Studio', icon: MapPin, singular: 'Contact Info' },
  { id: 'footer', label: 'Footer & Socials Studio', icon: ShieldCheck, singular: 'Footer Settings' },
  { id: 'countries', label: 'Countries', icon: Globe, singular: 'Country' },
  { id: 'universities', label: 'Universities', icon: GraduationCap, singular: 'University' },
  { id: 'jobs', label: 'Recruitment Jobs', icon: Briefcase, singular: 'Job' },
  { id: 'blogs', label: 'Blog Posts', icon: BookOpen, singular: 'Blog Post' },
  { id: 'testimonials', label: 'Student Stories', icon: Award, singular: 'Student Story' },
  { id: 'faqs', label: 'FAQs', icon: HelpCircle, singular: 'FAQ' },
];

function getFlagEmoji(countryCode) {
  if (!countryCode || countryCode.length !== 2) return '';
  try {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  } catch {
    return '';
  }
}

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState('countries');
  const [items, setItems] = useState([]);
  const [countriesList, setCountriesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Hero Section Dynamic Studio State
  const [heroData, setHeroData] = useState({
    tag: 'Study Abroad Consultancy',
    badgeText: 'Admissions Open 2026-2027',
    headline: {
      line1: 'Your Dream to Study',
      line2: 'Abroad, ',
      highlight: 'Our Priority',
    },
    description:
      'YTC Global Education helps you explore overseas education opportunities, find top-ranked universities, and build a brighter future with expert guidance at every step.',
    primaryBtnText: 'Start Your Journey',
    primaryBtnAction: 'consultation',
    secondaryBtnText: 'Explore Universities',
    secondaryBtnLink: '/destinations',
    stats: [
      { label: 'Happy Students', value: '10K+', iconType: 'users' },
      { label: 'Partner Universities', value: '50+', iconType: 'building' },
      { label: 'Countries', value: '15+', iconType: 'globe' },
    ],
    heroImage: '/images/hero-student.jpg',
    reviewCardText: 'Better Education Brighter Future ✨',
    reviewCardStars: 5,
    achievementBadgeTitle: '99% Visa Success',
    achievementBadgeSub: 'Certified Counselors',
    brandBadgeText: 'YTC GLOBAL',
    isActive: true,
  });
  const [savingHero, setSavingHero] = useState(false);

  // Footer & Social Links Dynamic Studio State
  const [footerData, setFooterData] = useState({
    socialLinks: {
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com',
      youtube: 'https://youtube.com',
      twitter: 'https://x.com',
      whatsapp: '',
    },
    recognitions: [
      { name: 'AIRC Accredited', badge: 'Accredited', icon: 'ShieldCheck', url: 'https://www.airc.education' },
      { name: 'ICEF Quality Agent', badge: 'Certified', icon: 'Award', url: 'https://www.icef.com' },
      { name: 'British Council Trained', badge: 'Trained', icon: 'CheckCircle2', url: 'https://www.britishcouncil.org' },
      { name: 'Education New Zealand Recognized', badge: 'Recognized', icon: 'Globe', url: 'https://www.enz.govt.nz' },
      { name: 'PIER QEAC Certified', badge: 'Certified', icon: 'GraduationCap', url: 'https://pieronline.org' },
    ],
    agencyBadge: {
      title: 'AIRC & ICEF CERTIFIED',
      subtitle: 'Global Trusted Agency',
      url: '',
    },
    copyrightText: '© 2026 YTC Global Education. Developed with ❤️ by Goatlabs. All rights reserved.',
    isActive: true,
  });
  const [savingFooter, setSavingFooter] = useState(false);

  // Contact & Liaison Lounges Dynamic Studio State
  const [contactData, setContactData] = useState({
    headquarters: {
      title: 'Corporate Headquarters',
      subtitle: 'Downtown Dubai, UAE',
      address: 'Level 14, Boulevard Plaza Tower 1, Downtown Dubai, United Arab Emirates',
      phone: '+971 4 800 9821',
      email: 'info@ytcglobal.com',
      hours: 'Sun - Thu: 9:00 AM - 6:00 PM (GMT +4)',
      photo: '',
    },
    regionalLoungesTitle: 'Regional Liaison Lounges',
    regionalLounges: [
      {
        city: 'New Delhi',
        country: 'India',
        badge: 'Admissions Hub',
        address: 'Suite 402, Connaught Place, Inner Circle, New Delhi',
        phone: '+91 11 4987 6500',
        email: 'delhi@ytcglobal.com',
        hours: 'Mon - Sat: 9:30 AM - 6:30 PM',
        photo: '',
      },
      {
        city: 'London',
        country: 'United Kingdom',
        badge: 'Student Support',
        address: '88 Kingsway, Holborn, London WC2B 6AA',
        phone: '+44 20 7946 0912',
        email: 'london@ytcglobal.com',
        hours: 'Mon - Fri: 9:00 AM - 5:30 PM',
        photo: '',
      },
      {
        city: 'Toronto',
        country: 'Canada',
        badge: 'Post Arrival Hub',
        address: '250 University Avenue, Suite 200, Toronto, ON M5H 3E5',
        phone: '+1 416 555 0194',
        email: 'toronto@ytcglobal.com',
        hours: 'Mon - Fri: 9:00 AM - 5:00 PM',
        photo: '',
      },
    ],
    isActive: true,
  });
  const [savingContact, setSavingContact] = useState(false);

  // About Page Dynamic Studio State
  const [aboutData, setAboutData] = useState(null);
  const [savingAbout, setSavingAbout] = useState(false);
  const [aboutSubTab, setAboutSubTab] = useState('header_stats');

  const normalizeAboutData = (raw) => {
    if (!raw) return null;
    const data = { ...raw };
    if (!data.briefHistory) data.briefHistory = {};
    const bh = data.briefHistory;

    // Normalize paragraphs from paragraphs array with bulletproof fallbacks
    const DEFAULT_PARAS = [
      'Founded in 2015, YTC Global Education emerged from a deeply personal experience. Our founders witnessed firsthand the widespread challenges aspiring international students encountered: misleading advice, opaque processing fees, and an alarming lack of post-visa guidance.',
      'Starting from a single counseling room with an unwavering philosophy of radical honesty, YTC set out to redefine overseas education advisory. We chose not to sell courses, but rather to curate personalized academic roadmaps aligned with each student’s genuine career passions, financial capacity, and long-term residency prospects.',
      'Over the past decade, that student-first ethos propelled YTC into a trusted cross-border mobility partner. Today, we manage accredited operations across four countries, boast direct articulation agreements with 50+ world-class universities, and operate an overseas recruitment wing connecting skilled talent with global industry leaders.',
    ];
    const paragraphs = Array.isArray(bh.paragraphs) ? bh.paragraphs : [];
    bh.p1 = bh.p1 || paragraphs[0] || DEFAULT_PARAS[0];
    bh.p2 = bh.p2 || paragraphs[1] || DEFAULT_PARAS[1];
    bh.p3 = bh.p3 || paragraphs[2] || DEFAULT_PARAS[2];
    bh.paragraphs = [bh.p1, bh.p2, bh.p3].filter(Boolean);

    // Normalize quote
    if (!bh.quote) bh.quote = {};
    bh.quote.role = bh.quote.role || bh.quote.designation || '';
    bh.quote.designation = bh.quote.designation || bh.quote.role || '';

    // Normalize milestones from highlights if missing
    if (!Array.isArray(bh.milestones) || bh.milestones.length === 0) {
      if (Array.isArray(bh.highlights) && bh.highlights.length > 0) {
        bh.milestones = bh.highlights.map((h) => ({
          year: h.year || '',
          title: h.label || '',
          desc: '',
        }));
      } else {
        bh.milestones = [];
      }
    }

    return data;
  };

  // Load live Hero, About, and Footer content from backend
  useEffect(() => {
    getAdminHero().then((res) => {
      if (res.success && res.data) {
        setHeroData(res.data);
      }
    });
    getAdminAbout().then((res) => {
      if (res.success && res.data) {
        setAboutData(normalizeAboutData(res.data));
      }
    });
    getAdminFooter().then((res) => {
      if (res.success && res.data) {
        setFooterData(res.data);
      }
    });
    getAdminContact().then((res) => {
      if (res.success && res.data) {
        setContactData(res.data);
      }
    });
  }, []);

  const handleSaveContact = async (e) => {
    if (e) e.preventDefault();
    setSavingContact(true);
    const res = await updateAdminContact(contactData);
    setSavingContact(false);
    if (res.success) {
      if (res.data) setContactData(res.data);
      setFeedback({ type: 'success', message: 'Corporate Headquarters & Regional Liaison Lounges updated live!' });
      setTimeout(() => setFeedback(null), 3500);
    } else {
      setFeedback({ type: 'error', message: res.message || 'Failed to update Contact settings' });
    }
  };

  const handleSaveFooter = async (e) => {
    if (e) e.preventDefault();
    setSavingFooter(true);
    const res = await updateAdminFooter(footerData);
    setSavingFooter(false);
    if (res.success) {
      if (res.data) setFooterData(res.data);
      setFeedback({ type: 'success', message: 'Footer & Social Media links updated live on the website!' });
      setTimeout(() => setFeedback(null), 3500);
    } else {
      setFeedback({ type: 'error', message: res.message || 'Failed to update Footer settings' });
    }
  };

  const handleSaveHero = async (e) => {
    if (e) e.preventDefault();
    setSavingHero(true);
    const res = await updateAdminHero(heroData);
    setSavingHero(false);
    if (res.success) {
      setFeedback({ type: 'success', message: 'Hero Section updated live on the website!' });
      setTimeout(() => setFeedback(null), 3500);
    } else {
      setFeedback({ type: 'error', message: res.message || 'Failed to update Hero section' });
    }
  };

  const handleSaveAbout = async (e) => {
    if (e) e.preventDefault();
    if (!aboutData) return;
    setSavingAbout(true);

    const payload = { ...aboutData };
    if (payload.briefHistory) {
      const bh = { ...payload.briefHistory };
      const paragraphs = [bh.p1, bh.p2, bh.p3].map((p) => (p || '').trim()).filter(Boolean);
      if (paragraphs.length > 0) {
        bh.paragraphs = paragraphs;
      }
      if (Array.isArray(bh.milestones) && bh.milestones.length > 0) {
        bh.highlights = bh.milestones.map((m) => ({
          year: m.year || '',
          label: m.title ? `${m.title}${m.desc ? `: ${m.desc}` : ''}` : m.label || '',
        }));
      }
      payload.briefHistory = bh;
    }

    const res = await updateAdminAbout(payload);
    setSavingAbout(false);
    if (res.success) {
      if (res.data) {
        setAboutData(normalizeAboutData(res.data));
      }
      setFeedback({ type: 'success', message: 'About Page updated live on the website!' });
      setTimeout(() => setFeedback(null), 3500);
    } else {
      setFeedback({ type: 'error', message: res.message || 'Failed to update About page' });
    }
  };

  const currentTab = TABS.find((t) => t.id === activeTab) || TABS[0];

  // Load countries list for university dropdowns
  useEffect(() => {
    getContentList('countries').then((res) => {
      if (res.success && Array.isArray(res.data)) {
        setCountriesList(res.data);
      }
    });
  }, []);

  const extractItems = (resData) => {
    if (Array.isArray(resData)) return resData;
    if (resData?.universities) return resData.universities;
    if (resData?.blogs) return resData.blogs;
    if (resData?.jobs) return resData.jobs;
    if (resData?.testimonials) return resData.testimonials;
    if (resData?.faqs) return resData.faqs;
    return [];
  };

  const fetchItems = useCallback(async () => {
    if (activeTab === 'hero' || activeTab === 'about' || activeTab === 'footer' || activeTab === 'contact') {
      setLoading(false);
      return;
    }
    setLoading(true);
    const res = await getContentList(activeTab);
    if (res.success && res.data) {
      setItems(extractItems(res.data));
    }
    setLoading(false);
  }, [activeTab]);

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      if (activeTab === 'hero' || activeTab === 'about' || activeTab === 'footer' || activeTab === 'contact') {
        setLoading(false);
        return;
      }
      setLoading(true);
      const res = await getContentList(activeTab);
      if (!ignore) {
        if (res.success && res.data) {
          setItems(extractItems(res.data));
        }
        setLoading(false);
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, [activeTab]);

  const handleOpenCreate = () => {
    setEditingItem(null);
    if (activeTab === 'countries') {
      setFormData({
        name: '',
        slug: '',
        code: '',
        flag: '',
        badge: 'Top Destination',
        accentColor: '#2563EB',
        headline: '',
        description: '',
        heroImage: '',
        quickFacts: {
          capital: '',
          currency: '',
          majorIntakes: 'Fall, Spring',
          intakes: 'Fall, Spring',
          averageTuition: '$15,000 - $35,000 / Year',
          avgTuition: '$15,000 - $35,000 / Year',
          livingExpenses: '$10,000 - $15,000 / Year',
          visaProcessing: '3 - 6 Weeks',
          visaType: 'Student Visa',
        },
        stats: [
          { label: 'Top Universities', value: '25+' },
          { label: 'Intl. Students', value: '100K+' },
          { label: 'Work Rights', value: '20 Hrs/Wk' },
          { label: 'Post-Study Work', value: 'Up to 3 Years' },
        ],
        whyStudy: [
          { title: 'Global Academic Prestige', desc: 'Degrees respected by top multinational employers worldwide.' },
          { title: 'Post-Study Work Pathways', desc: 'Robust graduate work visa rights and high employability.' },
        ],
        isActive: true,
      });
    } else if (activeTab === 'universities') {
      const defaultCountry = countriesList[0]?._id || '';
      setFormData({
        name: '',
        slug: '',
        country: defaultCountry,
        city: '',
        ranking: '',
        website: '',
        logo: '',
        image: '',
        tuitionFrom: 0,
        tuitionTo: 0,
        intakes: ['Fall', 'Spring'],
        isActive: true,
      });
    } else if (activeTab === 'jobs') {
      setFormData({
        title: '',
        slug: '',
        country: 'United Arab Emirates',
        city: 'Dubai',
        category: 'Hospitality',
        salaryRange: 'AED 3,500 - 5,000 / Month',
        experienceRequired: '1-3 Years',
        openings: 2,
        type: 'full_time',
        description: 'We are seeking qualified candidates for international overseas placement.',
        requirements: 'Valid passport with at least 1 year validity\nRelevant working experience\nGood communication skills',
        benefits: 'Accommodation provided\nMedical insurance covered\nAnnual air ticket',
        isActive: true,
        isOpen: true,
      });
    } else if (activeTab === 'blogs') {
      setFormData({
        title: '',
        name: '',
        slug: '',
        category: 'Study Abroad',
        author: 'YTC Editorial Team',
        summary: '',
        excerpt: '',
        content: '',
        tags: '',
        coverImage: '',
        isActive: true,
      });
    } else if (activeTab === 'testimonials') {
      setFormData({
        studentName: '',
        name: '',
        country: 'Canada',
        university: '',
        course: '',
        result: 'Student Visa Approved',
        badge: 'Visa Approved',
        text: '',
        type: 'success_story',
        photo: '',
        rating: 5,
        isActive: true,
      });
    } else if (activeTab === 'faqs') {
      setFormData({ question: '', answer: '', category: 'study_abroad', order: 0, isActive: true });
    }
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      ...item,
      title: item.title || item.name || item.studentName || '',
      studentName: item.studentName || item.name || '',
      country: typeof item.country === 'object' ? item.country?._id : item.country || '',
      requirements: Array.isArray(item.requirements) ? item.requirements.join('\n') : item.requirements || '',
      benefits: Array.isArray(item.benefits) ? item.benefits.join('\n') : item.benefits || '',
      quickFacts: item.quickFacts || {},
      stats: item.stats || [],
      whyStudy: item.whyStudy || [],
      summary: item.summary || item.excerpt || '',
      excerpt: item.excerpt || item.summary || '',
      content: item.content || item.excerpt || item.summary || '',
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : item.tags || '',
      photo: item.photo || item.image || '',
    });
    setModalOpen(true);
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Are you sure you want to delete "${item.name || item.title || item.question}"?`)) {
      return;
    }
    const res = await deleteContentItem(activeTab, item._id);
    if (res.success) {
      setItems((prev) => prev.filter((i) => i._id !== item._id));
      setFeedback({ type: 'success', message: 'Item deleted successfully.' });
      setTimeout(() => setFeedback(null), 3000);
    } else {
      setFeedback({ type: 'error', message: res.message || 'Delete failed.' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    const payload = { ...formData };
    if (activeTab === 'blogs') {
      if (!payload.title && payload.name) payload.title = payload.name;
      if (!payload.name && payload.title) payload.name = payload.title;
      if (payload.summary && !payload.excerpt) payload.excerpt = payload.summary;
      if (payload.excerpt && !payload.summary) payload.summary = payload.excerpt;
      if (!payload.content && payload.excerpt) payload.content = payload.excerpt;
      if (!payload.content && payload.summary) payload.content = payload.summary;
      if (!payload.content && payload.title) payload.content = `${payload.title} - Guide and insights from YTC Global.`;
      if (typeof payload.tags === 'string') {
        payload.tags = payload.tags.split(',').map((t) => t.trim()).filter(Boolean);
      }
    }

    if (activeTab === 'testimonials') {
      if (!payload.studentName && payload.name) payload.studentName = payload.name;
      if (!payload.name && payload.studentName) payload.name = payload.studentName;
      if (payload.image && !payload.photo) payload.photo = payload.image;
      if (payload.photo && !payload.image) payload.image = payload.photo;
    }

    let res;
    if (editingItem) {
      res = await updateContentItem(activeTab, editingItem._id, payload);
    } else {
      res = await createContentItem(activeTab, payload);
    }
    setSaving(false);

    if (res.success) {
      setModalOpen(false);
      fetchItems();
      setFeedback({
        type: 'success',
        message: `${currentTab.singular} ${editingItem ? 'updated' : 'created'} successfully!`,
      });
      setTimeout(() => setFeedback(null), 3000);
    } else {
      setFeedback({ type: 'error', message: res.message || 'Failed to save item.' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Content Management (CMS)</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage public website data: destinations, universities, recruitment jobs, blogs & FAQs
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {activeTab !== 'hero' && activeTab !== 'about' && activeTab !== 'footer' ? (
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add {currentTab.singular}</span>
            </button>
          ) : activeTab === 'hero' ? (
            <button
              onClick={handleSaveHero}
              disabled={savingHero}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all disabled:opacity-60 cursor-pointer"
            >
              {savingHero ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>{savingHero ? 'Publishing...' : 'Publish Hero Live'}</span>
            </button>
          ) : activeTab === 'about' ? (
            <button
              onClick={handleSaveAbout}
              disabled={savingAbout}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all disabled:opacity-60 cursor-pointer"
            >
              {savingAbout ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>{savingAbout ? 'Publishing...' : 'Publish About Live'}</span>
            </button>
          ) : activeTab === 'contact' ? (
            <button
              onClick={handleSaveContact}
              disabled={savingContact}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all disabled:opacity-60 cursor-pointer"
            >
              {savingContact ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>{savingContact ? 'Publishing...' : 'Publish Contact Live'}</span>
            </button>
          ) : (
            <button
              onClick={handleSaveFooter}
              disabled={savingFooter}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all disabled:opacity-60 cursor-pointer"
            >
              {savingFooter ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>{savingFooter ? 'Publishing...' : 'Publish Footer Live'}</span>
            </button>
          )}

          <button
            onClick={
              activeTab === 'hero'
                ? () => getAdminHero().then((res) => res.data && setHeroData(res.data))
                : activeTab === 'about'
                ? () => getAdminAbout().then((res) => res.data && setAboutData(normalizeAboutData(res.data)))
                : activeTab === 'contact'
                ? () => getAdminContact().then((res) => res.data && setContactData(res.data))
                : activeTab === 'footer'
                ? () => getAdminFooter().then((res) => res.data && setFooterData(res.data))
                : fetchItems
            }
            className="p-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading || savingHero || savingAbout || savingFooter || savingContact ? 'animate-spin text-blue-600' : ''}`} />
          </button>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs font-medium flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Resource Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto space-x-2 pb-px">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold rounded-t-xl transition-all whitespace-nowrap border-b-2 ${
                active
                  ? 'border-blue-600 text-blue-600 bg-white shadow-2xs'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content Area: Hero Studio or Resource Table */}
      {activeTab === 'hero' ? (
        <div className="space-y-6">
          {/* Hero Studio Top Banner */}
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-5 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 text-[11px] font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3" />
                <span>Interactive Live Studio</span>
              </div>
              <h3 className="text-base font-bold">Homepage Hero Section & Live Visual Preview</h3>
              <p className="text-xs text-blue-200/80 mt-0.5">
                Edit text, highlights, CTA buttons, stats, and collage images with an instant live preview.
              </p>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white transition-all"
              >
                <span>View Live Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={handleSaveHero}
                disabled={savingHero}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold shadow-lg transition-all cursor-pointer disabled:opacity-60"
              >
                {savingHero ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{savingHero ? 'Publishing...' : 'Publish Hero Live'}</span>
              </button>
            </div>
          </div>

          {/* 2-Column Studio Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            {/* Left Column: Form Controls */}
            <div className="xl:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 sm:p-6 space-y-6 text-xs text-slate-800">
              {/* Category Pill & Badge */}
              <div className="space-y-3 pb-4 border-b border-slate-100">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Category Tag & Live Badge</span>
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Tagline Pill</label>
                    <input
                      type="text"
                      value={heroData.tag || ''}
                      onChange={(e) => setHeroData({ ...heroData, tag: e.target.value })}
                      placeholder="e.g. Study Abroad Consultancy"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Pulsing Badge Text</label>
                    <input
                      type="text"
                      value={heroData.badgeText || ''}
                      onChange={(e) => setHeroData({ ...heroData, badgeText: e.target.value })}
                      placeholder="e.g. Admissions Open 2026-2027"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Main Headline */}
              <div className="space-y-3 pb-4 border-b border-slate-100">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <span>Headline & Highlights</span>
                </h4>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Line 1</label>
                  <input
                    type="text"
                    value={heroData.headline?.line1 || ''}
                    onChange={(e) =>
                      setHeroData({
                        ...heroData,
                        headline: { ...heroData.headline, line1: e.target.value },
                      })
                    }
                    placeholder="Your Dream to Study"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Line 2</label>
                    <input
                      type="text"
                      value={heroData.headline?.line2 || ''}
                      onChange={(e) =>
                        setHeroData({
                          ...heroData,
                          headline: { ...heroData.headline, line2: e.target.value },
                        })
                      }
                      placeholder="Abroad,"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Highlight Word <span className="text-cyan-600 font-bold">(Glow Underline)</span>
                    </label>
                    <input
                      type="text"
                      value={heroData.headline?.highlight || ''}
                      onChange={(e) =>
                        setHeroData({
                          ...heroData,
                          headline: { ...heroData.headline, highlight: e.target.value },
                        })
                      }
                      placeholder="Our Priority"
                      className="w-full px-3 py-2 bg-slate-50 border border-blue-300 rounded-xl text-xs font-bold text-blue-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subtitle / Description</label>
                  <textarea
                    rows={3}
                    value={heroData.description || ''}
                    onChange={(e) => setHeroData({ ...heroData, description: e.target.value })}
                    placeholder="Enter engaging sub-headline..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed"
                  />
                </div>
              </div>

              {/* Call to Actions */}
              <div className="space-y-3 pb-4 border-b border-slate-100">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <span>Call to Action Buttons</span>
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Primary Button (Flame Orange)
                    </label>
                    <input
                      type="text"
                      value={heroData.primaryBtnText || ''}
                      onChange={(e) => setHeroData({ ...heroData, primaryBtnText: e.target.value })}
                      placeholder="Start Your Journey"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Secondary Button (Glassmorphic)
                    </label>
                    <input
                      type="text"
                      value={heroData.secondaryBtnText || ''}
                      onChange={(e) => setHeroData({ ...heroData, secondaryBtnText: e.target.value })}
                      placeholder="Explore Universities"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Secondary Button Link Target
                  </label>
                  <input
                    type="text"
                    value={heroData.secondaryBtnLink || ''}
                    onChange={(e) => setHeroData({ ...heroData, secondaryBtnLink: e.target.value })}
                    placeholder="/destinations"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              {/* Stats Counters */}
              <div className="space-y-3 pb-4 border-b border-slate-100">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <span>Stats Tiles (3 Counters)</span>
                </h4>
                <div className="space-y-2.5">
                  {(heroData.stats || []).map((stat, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <div className="col-span-4">
                        <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Value</label>
                        <input
                          type="text"
                          value={stat.value || ''}
                          onChange={(e) => {
                            const newStats = [...(heroData.stats || [])];
                            newStats[idx] = { ...newStats[idx], value: e.target.value };
                            setHeroData({ ...heroData, stats: newStats });
                          }}
                          placeholder="e.g. 10K+"
                          className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                        />
                      </div>
                      <div className="col-span-5">
                        <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Label</label>
                        <input
                          type="text"
                          value={stat.label || ''}
                          onChange={(e) => {
                            const newStats = [...(heroData.stats || [])];
                            newStats[idx] = { ...newStats[idx], label: e.target.value };
                            setHeroData({ ...heroData, stats: newStats });
                          }}
                          placeholder="e.g. Happy Students"
                          className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                      <div className="col-span-3">
                        <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Icon</label>
                        <select
                          value={stat.iconType || 'users'}
                          onChange={(e) => {
                            const newStats = [...(heroData.stats || [])];
                            newStats[idx] = { ...newStats[idx], iconType: e.target.value };
                            setHeroData({ ...heroData, stats: newStats });
                          }}
                          className="w-full px-1.5 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-medium"
                        >
                          <option value="users">Users</option>
                          <option value="building">Building</option>
                          <option value="globe">Globe</option>
                          <option value="award">Award</option>
                          <option value="shield">Shield</option>
                          <option value="graduation">Graduation</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Graphic Badges & Hero Image */}
              <div className="space-y-3 pb-4 border-b border-slate-100">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <span>Graphic Badges & Student Image</span>
                </h4>

                <div>
                  <ImageUploadWidget
                    label="Hero Student / Landmark Photo (Cloudinary)"
                    value={heroData.heroImage || ''}
                    onChange={(url) => setHeroData({ ...heroData, heroImage: url })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Top Review Badge Text</label>
                    <input
                      type="text"
                      value={heroData.reviewCardText || ''}
                      onChange={(e) => setHeroData({ ...heroData, reviewCardText: e.target.value })}
                      placeholder="Better Education Brighter Future ✨"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Review Stars</label>
                    <select
                      value={heroData.reviewCardStars || 5}
                      onChange={(e) => setHeroData({ ...heroData, reviewCardStars: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    >
                      <option value={5}>5 Stars (★★★★★)</option>
                      <option value={4}>4 Stars (★★★★☆)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Bottom Badge Title</label>
                    <input
                      type="text"
                      value={heroData.achievementBadgeTitle || ''}
                      onChange={(e) => setHeroData({ ...heroData, achievementBadgeTitle: e.target.value })}
                      placeholder="99% Visa Success"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Bottom Badge Subtitle</label>
                    <input
                      type="text"
                      value={heroData.achievementBadgeSub || ''}
                      onChange={(e) => setHeroData({ ...heroData, achievementBadgeSub: e.target.value })}
                      placeholder="Certified Counselors"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Brand Tag on Notebook</label>
                  <input
                    type="text"
                    value={heroData.brandBadgeText || ''}
                    onChange={(e) => setHeroData({ ...heroData, brandBadgeText: e.target.value })}
                    placeholder="YTC GLOBAL"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider"
                  />
                </div>
              </div>

              {/* Publish Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSaveHero}
                  disabled={savingHero}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm shadow-xl shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {savingHero ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{savingHero ? 'Publishing Changes...' : 'Save & Publish Live to Homepage'}</span>
                </button>
              </div>
            </div>

            {/* Right Column: Live Sticky Real-Time Preview */}
            <div className="xl:col-span-7 sticky top-24 space-y-3">
              <div className="bg-slate-900 text-white rounded-2xl p-3 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Live Hero Preview (WYSIWYG)</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700">Desktop View</span>
                  <span>Instant reflection</span>
                </div>
              </div>

              {/* Preview Container Frame */}
              <div className="rounded-2xl overflow-hidden border-2 border-slate-800 shadow-2xl bg-[#0c3ec7]">
                <HeroSection data={heroData} isPreview={true} />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-[11px] text-blue-900 flex items-center justify-between">
                <span>💡 Tip: Click <strong>&quot;Publish Hero Live&quot;</strong> to update the live homepage.</span>
                <a
                  href="/"
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-blue-600 hover:underline shrink-0 ml-3 flex items-center gap-1"
                >
                  <span>Open Homepage</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === 'about' ? (
        /* About Page Live CMS Studio */
        <div className="space-y-6">
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-2xl p-5 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl border border-blue-900/40">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-blue-300">Live Dynamic CMS</span>
              </div>
              <h3 className="text-lg font-bold">About Page Studio</h3>
              <p className="text-xs text-blue-200/80">Manage all 8 sections of the /about page with real-time database updates and Cloudinary uploads.</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <a
                href="/about"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md border border-white/20 flex items-center gap-1.5 transition-all"
              >
                <span>View Live /about</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={handleSaveAbout}
                disabled={savingAbout || !aboutData}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {savingAbout ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>{savingAbout ? 'Saving...' : 'Publish Changes Live'}</span>
              </button>
            </div>
          </div>

          {!aboutData ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-3" />
              <p className="text-sm font-semibold">Loading About Page content from server...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Sub-tab Navigation */}
              <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
                {[
                  { id: 'header_stats', label: '1. Header & Stats Strip', icon: Layers },
                  { id: 'history', label: '2. Heritage & Milestones', icon: Sparkles },
                  { id: 'values', label: '3. Core Values & Mission', icon: Target },
                  { id: 'team', label: '4. Leadership Team', icon: Users },
                  { id: 'awards', label: '5. Recognitions & Accreditations', icon: Award },
                  { id: 'offices', label: '6. Global Offices', icon: MapPin },
                ].map((st) => {
                  const StIcon = st.icon;
                  const isActive = aboutSubTab === st.id;
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setAboutSubTab(st.id)}
                      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                          : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      <StIcon className="w-3.5 h-3.5" />
                      <span>{st.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Sub-tab 1: Header & Stats */}
              {aboutSubTab === 'header_stats' && (
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 space-y-6 text-xs text-slate-800">
                  <div className="space-y-4 pb-5 border-b border-slate-100">
                    <h4 className="font-bold text-slate-900 text-sm">About Hero Header</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Header Tag Pill</label>
                        <input
                          type="text"
                          value={aboutData.header?.tag || ''}
                          onChange={(e) =>
                            setAboutData({
                              ...aboutData,
                              header: { ...aboutData.header, tag: e.target.value },
                            })
                          }
                          placeholder="ABOUT YTC GLOBAL"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Header Main Title</label>
                        <input
                          type="text"
                          value={aboutData.header?.title || ''}
                          onChange={(e) =>
                            setAboutData({
                              ...aboutData,
                              header: { ...aboutData.header, title: e.target.value },
                            })
                          }
                          placeholder="Pioneering Your Global Education & Career Pathways"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Header Description Paragraph</label>
                      <textarea
                        rows={3}
                        value={aboutData.header?.description || ''}
                        onChange={(e) =>
                          setAboutData({
                            ...aboutData,
                            header: { ...aboutData.header, description: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed"
                      />
                    </div>

                    <div>
                      <ImageUploadWidget
                        label="Header Background / Cover Image (Cloudinary)"
                        value={aboutData.header?.heroImage || ''}
                        onChange={(url) =>
                          setAboutData({
                            ...aboutData,
                            header: { ...aboutData.header, heroImage: url },
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* 4 Stats Cards */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-slate-900 text-sm">Stats Strip (4 Key Metrics)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {(aboutData.aboutStats || []).map((st, idx) => (
                        <div key={idx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2">
                          <div>
                            <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Value (e.g. 20+)</label>
                            <input
                              type="text"
                              value={st.value || ''}
                              onChange={(e) => {
                                const arr = [...(aboutData.aboutStats || [])];
                                arr[idx] = { ...arr[idx], value: e.target.value };
                                setAboutData({ ...aboutData, aboutStats: arr });
                              }}
                              className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Label</label>
                            <input
                              type="text"
                              value={st.label || ''}
                              onChange={(e) => {
                                const arr = [...(aboutData.aboutStats || [])];
                                arr[idx] = { ...arr[idx], label: e.target.value };
                                setAboutData({ ...aboutData, aboutStats: arr });
                              }}
                              className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Subtitle / Detail</label>
                            <input
                              type="text"
                              value={st.detail || ''}
                              onChange={(e) => {
                                const arr = [...(aboutData.aboutStats || [])];
                                arr[idx] = { ...arr[idx], detail: e.target.value };
                                setAboutData({ ...aboutData, aboutStats: arr });
                              }}
                              className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-tab 2: Heritage & Milestones */}
              {aboutSubTab === 'history' && (
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 space-y-6 text-xs text-slate-800">
                  <div className="space-y-4 pb-5 border-b border-slate-100">
                    <h4 className="font-bold text-slate-900 text-sm">Brief History & Story</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Story Tag</label>
                        <input
                          type="text"
                          value={aboutData.briefHistory?.tag || ''}
                          onChange={(e) =>
                            setAboutData({
                              ...aboutData,
                              briefHistory: { ...aboutData.briefHistory, tag: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Story Section Title</label>
                        <input
                          type="text"
                          value={aboutData.briefHistory?.title || ''}
                          onChange={(e) =>
                            setAboutData({
                              ...aboutData,
                              briefHistory: { ...aboutData.briefHistory, title: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Story Paragraph 1</label>
                        <textarea
                          rows={2}
                          value={aboutData.briefHistory?.p1 || ''}
                          onChange={(e) =>
                            setAboutData({
                              ...aboutData,
                              briefHistory: { ...aboutData.briefHistory, p1: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Story Paragraph 2</label>
                        <textarea
                          rows={2}
                          value={aboutData.briefHistory?.p2 || ''}
                          onChange={(e) =>
                            setAboutData({
                              ...aboutData,
                              briefHistory: { ...aboutData.briefHistory, p2: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Story Paragraph 3</label>
                        <textarea
                          rows={2}
                          value={aboutData.briefHistory?.p3 || ''}
                          onChange={(e) =>
                            setAboutData({
                              ...aboutData,
                              briefHistory: { ...aboutData.briefHistory, p3: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed"
                        />
                      </div>
                    </div>

                    {/* Quote Box */}
                    <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200/80 space-y-3">
                      <h5 className="font-bold text-blue-900 text-xs">Featured Quote Box</h5>
                      <div>
                        <label className="block text-[11px] font-semibold text-blue-800 mb-1">Quote Text</label>
                        <input
                          type="text"
                          value={aboutData.briefHistory?.quote?.text || ''}
                          onChange={(e) =>
                            setAboutData({
                              ...aboutData,
                              briefHistory: {
                                ...aboutData.briefHistory,
                                quote: { ...aboutData.briefHistory?.quote, text: e.target.value },
                              },
                            })
                          }
                          className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-xs"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-blue-800 mb-1">Author</label>
                          <input
                            type="text"
                            value={aboutData.briefHistory?.quote?.author || ''}
                            onChange={(e) =>
                              setAboutData({
                                ...aboutData,
                                briefHistory: {
                                  ...aboutData.briefHistory,
                                  quote: { ...aboutData.briefHistory?.quote, author: e.target.value },
                                },
                              })
                            }
                            className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-xs font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-blue-800 mb-1">Role / Designation</label>
                          <input
                            type="text"
                            value={aboutData.briefHistory?.quote?.role || ''}
                            onChange={(e) =>
                              setAboutData({
                                ...aboutData,
                                briefHistory: {
                                  ...aboutData.briefHistory,
                                  quote: { ...aboutData.briefHistory?.quote, role: e.target.value },
                                },
                              })
                            }
                            className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Milestones */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-sm">Key Milestones</h4>
                      <button
                        type="button"
                        onClick={() => {
                          const arr = [...(aboutData.briefHistory?.milestones || [])];
                          arr.push({ year: '2026', title: 'New Expansion', desc: 'Milestone description.' });
                          setAboutData({
                            ...aboutData,
                            briefHistory: { ...aboutData.briefHistory, milestones: arr },
                          });
                        }}
                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      >
                        + Add Milestone
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(aboutData.briefHistory?.milestones || []).map((m, idx) => (
                        <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 relative group">
                          <button
                            type="button"
                            onClick={() => {
                              const arr = aboutData.briefHistory.milestones.filter((_, i) => i !== idx);
                              setAboutData({
                                ...aboutData,
                                briefHistory: { ...aboutData.briefHistory, milestones: arr },
                              });
                            }}
                            className="absolute top-2 right-2 text-slate-400 hover:text-rose-600 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <div className="grid grid-cols-3 gap-2 mb-2">
                            <div>
                              <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Year</label>
                              <input
                                type="text"
                                value={m.year || ''}
                                onChange={(e) => {
                                  const arr = [...aboutData.briefHistory.milestones];
                                  arr[idx] = { ...arr[idx], year: e.target.value };
                                  setAboutData({
                                    ...aboutData,
                                    briefHistory: { ...aboutData.briefHistory, milestones: arr },
                                  });
                                }}
                                className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-bold"
                              />
                            </div>
                            <div className="col-span-2">
                              <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Title</label>
                              <input
                                type="text"
                                value={m.title || ''}
                                onChange={(e) => {
                                  const arr = [...aboutData.briefHistory.milestones];
                                  arr[idx] = { ...arr[idx], title: e.target.value };
                                  setAboutData({
                                    ...aboutData,
                                    briefHistory: { ...aboutData.briefHistory, milestones: arr },
                                  });
                                }}
                                className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-semibold"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Description</label>
                            <input
                              type="text"
                              value={m.desc || ''}
                              onChange={(e) => {
                                const arr = [...aboutData.briefHistory.milestones];
                                arr[idx] = { ...arr[idx], desc: e.target.value };
                                setAboutData({
                                  ...aboutData,
                                  briefHistory: { ...aboutData.briefHistory, milestones: arr },
                                });
                              }}
                              className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-tab 3: Core Values & Mission */}
              {aboutSubTab === 'values' && (
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 space-y-6 text-xs text-slate-800">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Core Values & Ethical Guiding Pillars</h4>
                      <p className="text-slate-500 text-xs">These 6 core pillars define YTC Global&apos;s educational standard.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const arr = [...(aboutData.coreValues || [])];
                        arr.push({ title: 'New Value', desc: 'Description of the ethical pillar.' });
                        setAboutData({ ...aboutData, coreValues: arr });
                      }}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      + Add Pillar
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(aboutData.coreValues || []).map((val, idx) => (
                      <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative group space-y-2">
                        <button
                          type="button"
                          onClick={() => {
                            const arr = aboutData.coreValues.filter((_, i) => i !== idx);
                            setAboutData({ ...aboutData, coreValues: arr });
                          }}
                          className="absolute top-2.5 right-2.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div>
                          <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Pillar #{idx + 1} Title</label>
                          <input
                            type="text"
                            value={val.title || ''}
                            onChange={(e) => {
                              const arr = [...aboutData.coreValues];
                              arr[idx] = { ...arr[idx], title: e.target.value };
                              setAboutData({ ...aboutData, coreValues: arr });
                            }}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Description</label>
                          <textarea
                            rows={2}
                            value={val.desc || ''}
                            onChange={(e) => {
                              const arr = [...aboutData.coreValues];
                              arr[idx] = { ...arr[idx], desc: e.target.value };
                              setAboutData({ ...aboutData, coreValues: arr });
                            }}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs leading-relaxed"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-tab 4: Leadership Team */}
              {aboutSubTab === 'team' && (
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 space-y-6 text-xs text-slate-800">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Leadership & Executive Mentors</h4>
                      <p className="text-slate-500 text-xs">Showcased on the About page team directory with Cloudinary photos.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const arr = [...(aboutData.leadershipTeam || [])];
                        arr.push({
                          name: 'New Leader',
                          role: 'Managing Director',
                          experience: '12+ Years',
                          specialty: 'Global Admissions',
                          bio: 'Professional leadership biography.',
                          photo: '',
                        });
                        setAboutData({ ...aboutData, leadershipTeam: arr });
                      }}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      + Add Team Member
                    </button>
                  </div>

                  <div className="space-y-4">
                    {(aboutData.leadershipTeam || []).map((member, idx) => (
                      <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative group space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-xs">Leader #{idx + 1}: {member.name || 'Unnamed'}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const arr = aboutData.leadershipTeam.filter((_, i) => i !== idx);
                              setAboutData({ ...aboutData, leadershipTeam: arr });
                            }}
                            className="text-rose-500 hover:text-rose-700 font-semibold text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                          <div>
                            <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Full Name</label>
                            <input
                              type="text"
                              value={member.name || ''}
                              onChange={(e) => {
                                const arr = [...aboutData.leadershipTeam];
                                arr[idx] = { ...arr[idx], name: e.target.value };
                                setAboutData({ ...aboutData, leadershipTeam: arr });
                              }}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Role / Title</label>
                            <input
                              type="text"
                              value={member.role || ''}
                              onChange={(e) => {
                                const arr = [...aboutData.leadershipTeam];
                                arr[idx] = { ...arr[idx], role: e.target.value };
                                setAboutData({ ...aboutData, leadershipTeam: arr });
                              }}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Experience</label>
                            <input
                              type="text"
                              value={member.experience || ''}
                              onChange={(e) => {
                                const arr = [...aboutData.leadershipTeam];
                                arr[idx] = { ...arr[idx], experience: e.target.value };
                                setAboutData({ ...aboutData, leadershipTeam: arr });
                              }}
                              placeholder="e.g. 15+ Years"
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Specialty</label>
                            <input
                              type="text"
                              value={member.specialty || ''}
                              onChange={(e) => {
                                const arr = [...aboutData.leadershipTeam];
                                arr[idx] = { ...arr[idx], specialty: e.target.value };
                                setAboutData({ ...aboutData, leadershipTeam: arr });
                              }}
                              placeholder="e.g. UK & Australia Admissions"
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Biography</label>
                          <textarea
                            rows={2}
                            value={member.bio || ''}
                            onChange={(e) => {
                              const arr = [...aboutData.leadershipTeam];
                              arr[idx] = { ...arr[idx], bio: e.target.value };
                              setAboutData({ ...aboutData, leadershipTeam: arr });
                            }}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs leading-relaxed"
                          />
                        </div>

                        <div>
                          <ImageUploadWidget
                            label="Leader Profile Photo (Cloudinary)"
                            value={member.photo || ''}
                            onChange={(url) => {
                              const arr = [...aboutData.leadershipTeam];
                              arr[idx] = { ...arr[idx], photo: url };
                              setAboutData({ ...aboutData, leadershipTeam: arr });
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-tab 5: Recognitions & Accreditations */}
              {aboutSubTab === 'awards' && (
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 space-y-6 text-xs text-slate-800">
                  {/* Recognitions */}
                  <div className="space-y-4 pb-6 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">Awards & Industry Recognitions</h4>
                        <p className="text-slate-500 text-xs">Featured in the Recognitions carousel.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const arr = [...(aboutData.recognitions || [])];
                          arr.push({
                            year: '2026',
                            title: 'New Award',
                            issuedBy: 'Global Education Council',
                            badge: 'Gold Tier',
                            description: 'Honored for exceptional student counseling standards.',
                          });
                          setAboutData({ ...aboutData, recognitions: arr });
                        }}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        + Add Award
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(aboutData.recognitions || []).map((aw, idx) => (
                        <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative group space-y-2">
                          <button
                            type="button"
                            onClick={() => {
                              const arr = aboutData.recognitions.filter((_, i) => i !== idx);
                              setAboutData({ ...aboutData, recognitions: arr });
                            }}
                            className="absolute top-2.5 right-2.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Year</label>
                              <input
                                type="text"
                                value={aw.year || ''}
                                onChange={(e) => {
                                  const arr = [...aboutData.recognitions];
                                  arr[idx] = { ...arr[idx], year: e.target.value };
                                  setAboutData({ ...aboutData, recognitions: arr });
                                }}
                                className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-bold"
                              />
                            </div>
                            <div className="col-span-2">
                              <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Award Badge</label>
                              <input
                                type="text"
                                value={aw.badge || ''}
                                onChange={(e) => {
                                  const arr = [...aboutData.recognitions];
                                  arr[idx] = { ...arr[idx], badge: e.target.value };
                                  setAboutData({ ...aboutData, recognitions: arr });
                                }}
                                className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Award Title</label>
                            <input
                              type="text"
                              value={aw.title || ''}
                              onChange={(e) => {
                                const arr = [...aboutData.recognitions];
                                arr[idx] = { ...arr[idx], title: e.target.value };
                                setAboutData({ ...aboutData, recognitions: arr });
                              }}
                              className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Issued By</label>
                            <input
                              type="text"
                              value={aw.issuedBy || ''}
                              onChange={(e) => {
                                const arr = [...aboutData.recognitions];
                                arr[idx] = { ...arr[idx], issuedBy: e.target.value };
                                setAboutData({ ...aboutData, recognitions: arr });
                              }}
                              className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-medium"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Description</label>
                            <textarea
                              rows={2}
                              value={aw.description || ''}
                              onChange={(e) => {
                                const arr = [...aboutData.recognitions];
                                arr[idx] = { ...arr[idx], description: e.target.value };
                                setAboutData({ ...aboutData, recognitions: arr });
                              }}
                              className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs leading-relaxed"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Accreditations */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">Official Accreditations & Certifications</h4>
                        <p className="text-slate-500 text-xs">Pills shown in the bottom trust bar.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const arr = [...(aboutData.accreditations || [])];
                          arr.push({ name: 'New Council / Board', badge: 'Certified' });
                          setAboutData({ ...aboutData, accreditations: arr });
                        }}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        + Add Accreditation
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {(aboutData.accreditations || []).map((acc, idx) => (
                        <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 relative group flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const arr = aboutData.accreditations.filter((_, i) => i !== idx);
                              setAboutData({ ...aboutData, accreditations: arr });
                            }}
                            className="text-slate-400 hover:text-rose-600 cursor-pointer shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <div className="flex-1 space-y-1">
                            <input
                              type="text"
                              value={acc.name || ''}
                              onChange={(e) => {
                                const arr = [...aboutData.accreditations];
                                arr[idx] = { ...arr[idx], name: e.target.value };
                                setAboutData({ ...aboutData, accreditations: arr });
                              }}
                              placeholder="Name"
                              className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-semibold"
                            />
                            <input
                              type="text"
                              value={acc.badge || ''}
                              onChange={(e) => {
                                const arr = [...aboutData.accreditations];
                                arr[idx] = { ...arr[idx], badge: e.target.value };
                                setAboutData({ ...aboutData, accreditations: arr });
                              }}
                              placeholder="Badge (e.g. Certified Agency)"
                              className="w-full px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-tab 6: Global Offices */}
              {aboutSubTab === 'offices' && (
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 space-y-6 text-xs text-slate-800">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Worldwide Office Locations</h4>
                      <p className="text-slate-500 text-xs">Featured in the global hubs grid with contact details and Cloudinary images.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const arr = [...(aboutData.offices || [])];
                        arr.push({
                          city: 'New City',
                          country: 'Country',
                          address: 'Full street address',
                          phone: '+1 234 567 890',
                          email: 'office@ytcglobal.com',
                          hours: 'Mon - Fri: 9:00 AM - 6:00 PM',
                          badge: 'Branch Office',
                          photo: '',
                        });
                        setAboutData({ ...aboutData, offices: arr });
                      }}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      + Add Office
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(aboutData.offices || []).map((office, idx) => (
                      <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative group space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-xs">Office #{idx + 1}: {office.city || 'City'}, {office.country || ''}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const arr = aboutData.offices.filter((_, i) => i !== idx);
                              setAboutData({ ...aboutData, offices: arr });
                            }}
                            className="text-rose-500 hover:text-rose-700 font-semibold text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">City</label>
                            <input
                              type="text"
                              value={office.city || ''}
                              onChange={(e) => {
                                const arr = [...aboutData.offices];
                                arr[idx] = { ...arr[idx], city: e.target.value };
                                setAboutData({ ...aboutData, offices: arr });
                              }}
                              className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Country</label>
                            <input
                              type="text"
                              value={office.country || ''}
                              onChange={(e) => {
                                const arr = [...aboutData.offices];
                                arr[idx] = { ...arr[idx], country: e.target.value };
                                setAboutData({ ...aboutData, offices: arr });
                              }}
                              className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Badge</label>
                            <input
                              type="text"
                              value={office.badge || ''}
                              onChange={(e) => {
                                const arr = [...aboutData.offices];
                                arr[idx] = { ...arr[idx], badge: e.target.value };
                                setAboutData({ ...aboutData, offices: arr });
                              }}
                              placeholder="e.g. Headquarters"
                              className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-medium"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Address</label>
                          <input
                            type="text"
                            value={office.address || ''}
                            onChange={(e) => {
                              const arr = [...aboutData.offices];
                              arr[idx] = { ...arr[idx], address: e.target.value };
                              setAboutData({ ...aboutData, offices: arr });
                            }}
                            className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Phone</label>
                            <input
                              type="text"
                              value={office.phone || ''}
                              onChange={(e) => {
                                const arr = [...aboutData.offices];
                                arr[idx] = { ...arr[idx], phone: e.target.value };
                                setAboutData({ ...aboutData, offices: arr });
                              }}
                              className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Email</label>
                            <input
                              type="text"
                              value={office.email || ''}
                              onChange={(e) => {
                                const arr = [...aboutData.offices];
                                arr[idx] = { ...arr[idx], email: e.target.value };
                                setAboutData({ ...aboutData, offices: arr });
                              }}
                              className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <ImageUploadWidget
                            label="Office Building Photo (Cloudinary)"
                            value={office.photo || ''}
                            onChange={(url) => {
                              const arr = [...aboutData.offices];
                              arr[idx] = { ...arr[idx], photo: url };
                              setAboutData({ ...aboutData, offices: arr });
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom Quick Save Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSaveAbout}
                  disabled={savingAbout}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm shadow-xl shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {savingAbout ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{savingAbout ? 'Publishing Changes...' : 'Save & Publish Live to /about'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : activeTab === 'footer' ? (
        /* ── FOOTER & SOCIALS STUDIO ── */
        <div className="space-y-6">
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-5 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md border border-slate-800">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 text-[11px] font-bold uppercase tracking-wider mb-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Global Footer Studio</span>
              </div>
              <h3 className="text-base font-bold">Industry Recognitions & Social Media Links</h3>
              <p className="text-xs text-slate-300/80 mt-0.5">
                Manage accreditation badges, official verification links, and social profile links shown across all pages.
              </p>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <a
                href="/#partner-universities"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white transition-all"
              >
                <span>View Live Footer</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={handleSaveFooter}
                disabled={savingFooter}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold shadow-lg transition-all cursor-pointer disabled:opacity-60"
              >
                {savingFooter ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{savingFooter ? 'Publishing...' : 'Publish Footer Live'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Social Media Links & Trust Badge (6 cols) */}
            <div className="lg:col-span-6 space-y-6">
              {/* Social Media Links Card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 sm:p-6 space-y-4">
                <div className="pb-3 border-b border-slate-100">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-600" />
                    <span>Official Social Media Accounts</span>
                  </h4>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Enter the URL to your organization&apos;s profiles. Empty inputs will hide that icon.
                  </p>
                </div>

                <div className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                      <span>Facebook Page URL</span>
                    </label>
                    <input
                      type="url"
                      value={footerData.socialLinks?.facebook || ''}
                      onChange={(e) =>
                        setFooterData({
                          ...footerData,
                          socialLinks: { ...footerData.socialLinks, facebook: e.target.value },
                        })
                      }
                      placeholder="https://facebook.com/ytcglobal"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-pink-500" />
                      <span>Instagram Profile URL</span>
                    </label>
                    <input
                      type="url"
                      value={footerData.socialLinks?.instagram || ''}
                      onChange={(e) =>
                        setFooterData({
                          ...footerData,
                          socialLinks: { ...footerData.socialLinks, instagram: e.target.value },
                        })
                      }
                      placeholder="https://instagram.com/ytcglobal"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-700" />
                      <span>LinkedIn Company Page</span>
                    </label>
                    <input
                      type="url"
                      value={footerData.socialLinks?.linkedin || ''}
                      onChange={(e) =>
                        setFooterData({
                          ...footerData,
                          socialLinks: { ...footerData.socialLinks, linkedin: e.target.value },
                        })
                      }
                      placeholder="https://linkedin.com/company/ytcglobal"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-600" />
                      <span>YouTube Channel URL</span>
                    </label>
                    <input
                      type="url"
                      value={footerData.socialLinks?.youtube || ''}
                      onChange={(e) =>
                        setFooterData({
                          ...footerData,
                          socialLinks: { ...footerData.socialLinks, youtube: e.target.value },
                        })
                      }
                      placeholder="https://youtube.com/@ytcglobal"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-slate-900" />
                      <span>X (Twitter) Profile URL</span>
                    </label>
                    <input
                      type="url"
                      value={footerData.socialLinks?.twitter || ''}
                      onChange={(e) =>
                        setFooterData({
                          ...footerData,
                          socialLinks: { ...footerData.socialLinks, twitter: e.target.value },
                        })
                      }
                      placeholder="https://x.com/ytcglobal"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>WhatsApp Number or Chat Link</span>
                    </label>
                    <input
                      type="text"
                      value={footerData.socialLinks?.whatsapp || ''}
                      onChange={(e) =>
                        setFooterData({
                          ...footerData,
                          socialLinks: { ...footerData.socialLinks, whatsapp: e.target.value },
                        })
                      }
                      placeholder="+91 98765 43210 or https://wa.me/919876543210"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Agency Trust Badge Box */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 sm:p-6 space-y-4">
                <div className="pb-3 border-b border-slate-100">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-cyan-600" />
                    <span>Agency Trust Badge (Below Logo)</span>
                  </h4>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Displayed prominently on the left column under the YTC Global brand logo.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Badge Title</label>
                    <input
                      type="text"
                      value={footerData.agencyBadge?.title || ''}
                      onChange={(e) =>
                        setFooterData({
                          ...footerData,
                          agencyBadge: { ...footerData.agencyBadge, title: e.target.value },
                        })
                      }
                      placeholder="AIRC & ICEF CERTIFIED"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Subtitle</label>
                    <input
                      type="text"
                      value={footerData.agencyBadge?.subtitle || ''}
                      onChange={(e) =>
                        setFooterData({
                          ...footerData,
                          agencyBadge: { ...footerData.agencyBadge, subtitle: e.target.value },
                        })
                      }
                      placeholder="Global Trusted Agency"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Copyright Text Box */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 sm:p-6 space-y-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500">
                  Footer Copyright Line
                </h4>
                <input
                  type="text"
                  value={footerData.copyrightText || ''}
                  onChange={(e) =>
                    setFooterData({
                      ...footerData,
                      copyrightText: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700"
                />
              </div>
            </div>

            {/* Right Column: Industry Recognitions & Certifications (6 cols) */}
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-500" />
                      <span>Industry Recognitions & Certifications</span>
                    </h4>
                    <p className="text-slate-500 text-xs mt-0.5">
                      Pills rendered above the copyright bar. Add verification URLs so students can click to verify credentials.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const arr = [...(footerData.recognitions || [])];
                      arr.push({
                        name: 'New Certification',
                        badge: 'Certified',
                        icon: 'ShieldCheck',
                        url: '',
                      });
                      setFooterData({ ...footerData, recognitions: arr });
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Badge</span>
                  </button>
                </div>

                <div className="space-y-3.5 max-h-[640px] overflow-y-auto pr-1">
                  {(footerData.recognitions || []).map((rec, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50/80 hover:bg-slate-50 p-4 rounded-xl border border-slate-200 relative group space-y-3 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-xs flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-blue-100 text-blue-600 font-extrabold flex items-center justify-center text-[10px]">
                            {idx + 1}
                          </span>
                          <span>{rec.name || 'Unnamed Recognition'}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const arr = footerData.recognitions.filter((_, i) => i !== idx);
                            setFooterData({ ...footerData, recognitions: arr });
                          }}
                          className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer flex items-center gap-1 text-xs"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">
                            Recognition Name / Title
                          </label>
                          <input
                            type="text"
                            value={rec.name || ''}
                            onChange={(e) => {
                              const arr = [...footerData.recognitions];
                              arr[idx] = { ...arr[idx], name: e.target.value };
                              setFooterData({ ...footerData, recognitions: arr });
                            }}
                            placeholder="e.g. AIRC Accredited"
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">
                            Icon Graphic
                          </label>
                          <select
                            value={rec.icon || 'ShieldCheck'}
                            onChange={(e) => {
                              const arr = [...footerData.recognitions];
                              arr[idx] = { ...arr[idx], icon: e.target.value };
                              setFooterData({ ...footerData, recognitions: arr });
                            }}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium cursor-pointer"
                          >
                            <option value="ShieldCheck">🛡️ Shield Check (Accredited)</option>
                            <option value="Award">🏆 Award Ribbon (Quality Agent)</option>
                            <option value="CheckCircle2">✅ Check Circle (Trained)</option>
                            <option value="Globe">🌍 Globe (International)</option>
                            <option value="GraduationCap">🎓 Graduation Cap (Education Board)</option>
                            <option value="Building2">🏛️ Building (Institutional)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">
                            Verification Link URL (Optional)
                          </label>
                          <input
                            type="url"
                            value={rec.url || ''}
                            onChange={(e) => {
                              const arr = [...footerData.recognitions];
                              arr[idx] = { ...arr[idx], url: e.target.value };
                              setFooterData({ ...footerData, recognitions: arr });
                            }}
                            placeholder="https://www.airc.education"
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">
                            Status Tag / Badge
                          </label>
                          <input
                            type="text"
                            value={rec.badge || ''}
                            onChange={(e) => {
                              const arr = [...footerData.recognitions];
                              arr[idx] = { ...arr[idx], badge: e.target.value };
                              setFooterData({ ...footerData, recognitions: arr });
                            }}
                            placeholder="e.g. Verified"
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Save Button Card */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSaveFooter}
                  disabled={savingFooter}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm shadow-xl shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {savingFooter ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{savingFooter ? 'Publishing Changes...' : 'Save & Publish Live to Footer'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === 'contact' ? (
        /* ══════════════════════════════════════════════════════════════════ */
        /* CONTACT & REGIONAL LIAISON LOUNGES STUDIO                        */
        /* ══════════════════════════════════════════════════════════════════ */
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 space-y-6 text-xs text-slate-800">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-[10px] uppercase tracking-wider mb-1.5">
                  <MapPin className="w-3 h-3 text-blue-600" />
                  <span>Public Contact Page Management</span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-base">Corporate Headquarters & Regional Liaison Lounges</h3>
                <p className="text-slate-500 text-xs">
                  Configure corporate contact information and global student liaison lounges displayed dynamically on <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-600 font-semibold">/contact</code>.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSaveContact}
                disabled={savingContact}
                className="self-start sm:self-auto px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60 shrink-0"
              >
                {savingContact ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>{savingContact ? 'Publishing...' : 'Save Changes'}</span>
              </button>
            </div>

            {/* ── SECTION 1: CORPORATE HEADQUARTERS ── */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Globe className="w-4 h-4 text-blue-600" />
                <h4 className="font-bold text-slate-900 text-sm">1. Corporate Headquarters (Main Office)</h4>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Form fields */}
                <div className="lg:col-span-7 space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Display Title
                      </label>
                      <input
                        type="text"
                        value={contactData.headquarters?.title || ''}
                        onChange={(e) =>
                          setContactData({
                            ...contactData,
                            headquarters: { ...contactData.headquarters, title: e.target.value },
                          })
                        }
                        placeholder="Corporate Headquarters"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Location Subtitle
                      </label>
                      <input
                        type="text"
                        value={contactData.headquarters?.subtitle || ''}
                        onChange={(e) =>
                          setContactData({
                            ...contactData,
                            headquarters: { ...contactData.headquarters, subtitle: e.target.value },
                          })
                        }
                        placeholder="Downtown Dubai, UAE"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Full Physical Street Address
                    </label>
                    <textarea
                      rows={2}
                      value={contactData.headquarters?.address || ''}
                      onChange={(e) =>
                        setContactData({
                          ...contactData,
                          headquarters: { ...contactData.headquarters, address: e.target.value },
                        })
                      }
                      placeholder="Level 14, Boulevard Plaza Tower 1, Downtown Dubai, United Arab Emirates"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={contactData.headquarters?.phone || ''}
                        onChange={(e) =>
                          setContactData({
                            ...contactData,
                            headquarters: { ...contactData.headquarters, phone: e.target.value },
                          })
                        }
                        placeholder="+971 4 800 9821"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={contactData.headquarters?.email || ''}
                        onChange={(e) =>
                          setContactData({
                            ...contactData,
                            headquarters: { ...contactData.headquarters, email: e.target.value },
                          })
                        }
                        placeholder="info@ytcglobal.com"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Operating Hours / Working Timing
                    </label>
                    <input
                      type="text"
                      value={contactData.headquarters?.hours || ''}
                      onChange={(e) =>
                        setContactData({
                          ...contactData,
                          headquarters: { ...contactData.headquarters, hours: e.target.value },
                        })
                      }
                      placeholder="Sun - Thu: 9:00 AM - 6:00 PM (GMT +4)"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Live Preview Card */}
                <div className="lg:col-span-5 bg-gradient-to-br from-slate-50 to-blue-50/40 p-5 rounded-2xl border border-slate-200/90 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 block mb-3">
                      Live Contact Card Preview
                    </span>
                    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-3">
                      <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
                          <Globe className="w-4 h-4" />
                        </div>
                        <div>
                          <h5 className="font-bold text-sm text-slate-900 leading-snug">
                            {contactData.headquarters?.title || 'Corporate Headquarters'}
                          </h5>
                          <p className="text-[11px] text-slate-500">
                            {contactData.headquarters?.subtitle || 'Downtown Dubai, UAE'}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs text-slate-600">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                          <span className="leading-tight text-[11px]">{contactData.headquarters?.address || 'Street address here'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span className="font-semibold text-[11px] text-blue-600">{contactData.headquarters?.phone || '+971 4 800 9821'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span className="font-semibold text-[11px] text-blue-600">{contactData.headquarters?.email || 'info@ytcglobal.com'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{contactData.headquarters?.hours || 'Operating hours'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 italic mt-3 text-center">
                    Rendered at the top of the Contact page right column
                  </p>
                </div>
              </div>
            </div>

            {/* ── SECTION 2: REGIONAL LIAISON LOUNGES ── */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">2. Regional Liaison Lounges Directory</h4>
                    <p className="text-slate-500 text-[11px]">Worldwide city hubs for student admissions, advising, and post-arrival support.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const arr = [...(contactData.regionalLounges || [])];
                      arr.push({
                        city: 'Sydney',
                        country: 'Australia',
                        badge: 'Admissions Hub',
                        address: 'Level 5, George Street, Sydney NSW 2000',
                        phone: '+61 2 8000 1234',
                        email: 'sydney@ytcglobal.com',
                        hours: 'Mon - Fri: 9:00 AM - 5:30 PM',
                        photo: '',
                      });
                      setContactData({ ...contactData, regionalLounges: arr });
                    }}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Liaison Lounge</span>
                  </button>
                </div>
              </div>

              {/* Editable Section Title */}
              <div className="max-w-md">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Section Header Title
                </label>
                <input
                  type="text"
                  value={contactData.regionalLoungesTitle || ''}
                  onChange={(e) =>
                    setContactData({ ...contactData, regionalLoungesTitle: e.target.value })
                  }
                  placeholder="Regional Liaison Lounges"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Lounges Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {(contactData.regionalLounges || []).map((lounge, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200 relative group space-y-3 shadow-2xs hover:border-blue-400 transition-colors"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                      <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-extrabold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span>{lounge.city || 'City'}, {lounge.country || ''}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const arr = contactData.regionalLounges.filter((_, i) => i !== idx);
                          setContactData({ ...contactData, regionalLounges: arr });
                        }}
                        className="text-rose-500 hover:text-rose-700 font-semibold text-xs flex items-center gap-1 cursor-pointer"
                        title="Delete Lounge"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-slate-500 font-bold mb-0.5">City</label>
                        <input
                          type="text"
                          value={lounge.city || ''}
                          onChange={(e) => {
                            const arr = [...contactData.regionalLounges];
                            arr[idx] = { ...arr[idx], city: e.target.value };
                            setContactData({ ...contactData, regionalLounges: arr });
                          }}
                          placeholder="e.g. New Delhi"
                          className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 font-bold mb-0.5">Country</label>
                        <input
                          type="text"
                          value={lounge.country || ''}
                          onChange={(e) => {
                            const arr = [...contactData.regionalLounges];
                            arr[idx] = { ...arr[idx], country: e.target.value };
                            setContactData({ ...contactData, regionalLounges: arr });
                          }}
                          placeholder="e.g. India"
                          className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-500 font-bold mb-0.5">Badge / Function Tag</label>
                      <input
                        type="text"
                        value={lounge.badge || ''}
                        onChange={(e) => {
                          const arr = [...contactData.regionalLounges];
                          arr[idx] = { ...arr[idx], badge: e.target.value };
                          setContactData({ ...contactData, regionalLounges: arr });
                        }}
                        placeholder="e.g. Admissions Hub, Student Support, Post Arrival Hub"
                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-blue-700"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-500 font-bold mb-0.5">Street Address</label>
                      <input
                        type="text"
                        value={lounge.address || ''}
                        onChange={(e) => {
                          const arr = [...contactData.regionalLounges];
                          arr[idx] = { ...arr[idx], address: e.target.value };
                          setContactData({ ...contactData, regionalLounges: arr });
                        }}
                        placeholder="Street Address, Suite / Floor"
                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-slate-500 font-bold mb-0.5">Phone</label>
                        <input
                          type="text"
                          value={lounge.phone || ''}
                          onChange={(e) => {
                            const arr = [...contactData.regionalLounges];
                            arr[idx] = { ...arr[idx], phone: e.target.value };
                            setContactData({ ...contactData, regionalLounges: arr });
                          }}
                          placeholder="+91 11 4987 6500"
                          className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 font-bold mb-0.5">Email</label>
                        <input
                          type="email"
                          value={lounge.email || ''}
                          onChange={(e) => {
                            const arr = [...contactData.regionalLounges];
                            arr[idx] = { ...arr[idx], email: e.target.value };
                            setContactData({ ...contactData, regionalLounges: arr });
                          }}
                          placeholder="delhi@ytcglobal.com"
                          className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Save & Publish Button */}
            <div className="pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleSaveContact}
                disabled={savingContact}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm shadow-xl shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {savingContact ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{savingContact ? 'Publishing Changes...' : 'Save & Publish Live to /contact'}</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Regular Table */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-100 font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Title / Name</th>
                  <th className="py-3.5 px-4">Slug / Identifier</th>
                  <th className="py-3.5 px-4">Key Info</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-500 mb-2" />
                      <p className="text-xs">Loading {currentTab.label}...</p>
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      <p className="text-sm font-medium text-slate-600">No {currentTab.label} added yet</p>
                      <p className="text-xs mt-1">Click &quot;Add {currentTab.singular}&quot; above to create the first one.</p>
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">
                          {item.studentName || item.name || item.title || item.question}
                        </div>
                        {item.headline && (
                          <div className="text-[11px] text-slate-400 truncate max-w-xs">{item.headline}</div>
                        )}
                        {item.result && (
                          <div className="text-[11px] text-emerald-600 font-bold truncate max-w-xs">✅ {item.result}</div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                        {item.slug || item.code || item.type || item.category || '—'}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600">
                        {item.university && <span>Uni: {item.university} • </span>}
                        {item.course && <span>Course: {item.course} • </span>}
                        {item.city && <span>City: {item.city} • </span>}
                        {item.country && (
                          <span>
                            Country: {typeof item.country === 'object' ? item.country.name || item.country.shortName : item.country}
                          </span>
                        )}
                        {item.ranking && <span> • Rank: #{item.ranking}</span>}
                        {item.category && !item.university && <span>Category: {item.category}</span>}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                            item.isActive !== false
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}
                        >
                          {item.isActive !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          {item.isActive !== false ? 'Active' : 'Draft'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDelete(item)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-base font-bold text-slate-900">
                {editingItem ? `Edit ${currentTab.singular}` : `Create New ${currentTab.singular}`}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Common Title/Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {activeTab === 'faqs' ? 'Question' : activeTab === 'testimonials' ? 'Student Full Name' : 'Name / Title'} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.studentName || formData.name || formData.title || formData.question || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (activeTab === 'faqs') {
                      setFormData({ ...formData, question: val });
                    } else if (activeTab === 'testimonials') {
                      setFormData({ ...formData, studentName: val, name: val });
                    } else if (activeTab === 'blogs' || activeTab === 'jobs') {
                      setFormData({
                        ...formData,
                        title: val,
                        slug: !editingItem ? val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : formData.slug,
                      });
                    } else {
                      setFormData({
                        ...formData,
                        name: val,
                        slug: !editingItem ? val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : formData.slug,
                      });
                    }
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Slug if not FAQ or Testimonials */}
              {activeTab !== 'faqs' && activeTab !== 'testimonials' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug || ''}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* Tab specific fields */}
              {activeTab === 'countries' && (
                <>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">ISO Code (e.g. FR)</label>
                      <input
                        type="text"
                        value={formData.code || ''}
                        onChange={(e) => {
                          const code = e.target.value.toUpperCase();
                          const autoFlag = getFlagEmoji(code);
                          setFormData({
                            ...formData,
                            code,
                            flag: formData.flag || autoFlag,
                          });
                        }}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Flag Emoji (e.g. 🇫🇷)</label>
                      <input
                        type="text"
                        value={formData.flag || ''}
                        onChange={(e) => setFormData({ ...formData, flag: e.target.value })}
                        placeholder="🇫🇷"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Badge (e.g. 2-Year PSW)</label>
                      <input
                        type="text"
                        value={formData.badge || ''}
                        onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                        placeholder="Top Choice"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Headline</label>
                      <input
                        type="text"
                        value={formData.headline || ''}
                        onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Accent Hex (e.g. #2563EB)</label>
                      <input
                        type="text"
                        value={formData.accentColor || '#2563EB'}
                        onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Avg Tuition (e.g. $15,000 / Yr)</label>
                      <input
                        type="text"
                        value={formData.quickFacts?.avgTuition || formData.quickFacts?.averageTuition || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData({
                            ...formData,
                            quickFacts: {
                              ...(formData.quickFacts || {}),
                              avgTuition: val,
                              averageTuition: val,
                            },
                          });
                        }}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Major Intakes (e.g. Fall, Spring)</label>
                      <input
                        type="text"
                        value={formData.quickFacts?.intakes || formData.quickFacts?.majorIntakes || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData({
                            ...formData,
                            quickFacts: {
                              ...(formData.quickFacts || {}),
                              intakes: val,
                              majorIntakes: val,
                            },
                          });
                        }}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <ImageUploadWidget
                    label="Destination Hero Banner (Cloudinary)"
                    value={formData.heroImage || ''}
                    onChange={(url) => setFormData({ ...formData, heroImage: url })}
                  />
                </>
              )}

              {activeTab === 'universities' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={typeof formData.country === 'object' ? formData.country?._id : formData.country || ''}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">-- Select Country --</option>
                      {countriesList.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.flag || ''} {c.name || c.shortName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                      <input
                        type="text"
                        value={formData.city || ''}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="e.g. Cambridge, London"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">World Ranking</label>
                      <input
                        type="text"
                        value={formData.ranking || ''}
                        onChange={(e) => setFormData({ ...formData, ranking: e.target.value })}
                        placeholder="e.g. 15 or Top 50"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Tuition From ($/Year)</label>
                      <input
                        type="number"
                        value={formData.tuitionFrom || 0}
                        onChange={(e) => setFormData({ ...formData, tuitionFrom: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Tuition To ($/Year)</label>
                      <input
                        type="number"
                        value={formData.tuitionTo || 0}
                        onChange={(e) => setFormData({ ...formData, tuitionTo: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Official Website</label>
                    <input
                      type="url"
                      value={formData.website || ''}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://www.harvard.edu"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>

                  <ImageUploadWidget
                    label="University Logo / Campus Image (Cloudinary)"
                    value={formData.image || formData.logo || ''}
                    onChange={(url) => setFormData({ ...formData, image: url, logo: url })}
                  />
                </>
              )}

              {activeTab === 'jobs' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        value={formData.category || 'Hospitality'}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                      >
                        <option value="Healthcare">Healthcare</option>
                        <option value="Hospitality">Hospitality</option>
                        <option value="Construction">Construction</option>
                        <option value="IT and Engineering">IT and Engineering</option>
                        <option value="Logistics & Warehouse">Logistics & Warehouse</option>
                        <option value="Retail & Customer Service">Retail & Customer Service</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Employment Type
                      </label>
                      <select
                        value={formData.type || 'full_time'}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                      >
                        <option value="full_time">Full Time</option>
                        <option value="contract">Contract</option>
                        <option value="part_time">Part Time</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Country / Destination <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.country || ''}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        placeholder="e.g. United Arab Emirates, UK, Poland"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                      <input
                        type="text"
                        value={formData.city || ''}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="e.g. Dubai, London, Warsaw"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Salary Range</label>
                      <input
                        type="text"
                        value={formData.salaryRange || ''}
                        onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
                        placeholder="e.g. AED 4,500 - 6,000"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Experience</label>
                      <input
                        type="text"
                        value={formData.experienceRequired || ''}
                        onChange={(e) => setFormData({ ...formData, experienceRequired: e.target.value })}
                        placeholder="e.g. 1-3 Years"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Openings</label>
                      <input
                        type="number"
                        min={1}
                        value={formData.openings || 1}
                        onChange={(e) => setFormData({ ...formData, openings: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Job Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Outline job duties, role expectations, and workplace environment..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Requirements (1 per line)
                      </label>
                      <textarea
                        rows={3}
                        value={formData.requirements || ''}
                        onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                        placeholder="Valid passport&#10;Diploma or certification&#10;English proficiency"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Benefits (1 per line)
                      </label>
                      <textarea
                        rows={3}
                        value={formData.benefits || ''}
                        onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                        placeholder="Visa sponsored&#10;Accommodation provided&#10;Health insurance"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                      />
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'blogs' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                      <select
                        value={formData.category || 'Study Abroad'}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Study Abroad">Study Abroad</option>
                        <option value="Visa Guides">Visa Guides</option>
                        <option value="Scholarships">Scholarships</option>
                        <option value="Career & Jobs">Career & Jobs</option>
                        <option value="University Guides">University Guides</option>
                        <option value="Test Prep (IELTS/PTE)">Test Prep (IELTS/PTE)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Author</label>
                      <input
                        type="text"
                        value={formData.author || ''}
                        placeholder="YTC Editorial Team"
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Summary / Excerpt</label>
                    <textarea
                      rows={2}
                      value={formData.summary || formData.excerpt || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          summary: e.target.value,
                          excerpt: e.target.value,
                        })
                      }
                      placeholder="Brief overview or teaser of the post..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Content (Markdown/HTML)</label>
                    <textarea
                      rows={5}
                      value={formData.content || ''}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Full blog post content..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Tags (comma-separated)</label>
                    <input
                      type="text"
                      value={Array.isArray(formData.tags) ? formData.tags.join(', ') : formData.tags || ''}
                      placeholder="study in canada, student visa, pgwp"
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <ImageUploadWidget
                    label="Cover Image (Cloudinary)"
                    value={formData.coverImage || ''}
                    onChange={(url) => setFormData({ ...formData, coverImage: url })}
                  />
                </>
              )}

              {activeTab === 'testimonials' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Entry Type *</label>
                      <select
                        value={formData.type || 'success_story'}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      >
                        <option value="success_story">Success Story (Homepage Cards)</option>
                        <option value="testimonial">Testimonial Review</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Destination Country *</label>
                      <select
                        value={formData.country || 'Canada'}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      >
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Australia">Australia</option>
                        <option value="Germany">Germany</option>
                        <option value="Ireland">Ireland</option>
                        <option value="USA">United States</option>
                        <option value="New Zealand">New Zealand</option>
                        <option value="UAE">UAE</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">University / College *</label>
                      <input
                        type="text"
                        placeholder="e.g. University of Toronto"
                        value={formData.university || ''}
                        onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Course / Program</label>
                      <input
                        type="text"
                        placeholder="e.g. MSc Data Science & AI"
                        value={formData.course || ''}
                        onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Outcome / Result</label>
                      <input
                        type="text"
                        placeholder="e.g. Visa Approved — Fall 2026 Intake"
                        value={formData.result || ''}
                        onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Badge Tag</label>
                      <input
                        type="text"
                        placeholder="e.g. Visa Approved"
                        value={formData.badge || ''}
                        onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Student Story / Testimonial Quote *</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Share the student's journey, counseling experience, or outcome..."
                      value={formData.text || ''}
                      onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Star Rating (1 - 5)</label>
                      <input
                        type="number"
                        min={1}
                        max={5}
                        value={formData.rating ?? 5}
                        onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <ImageUploadWidget
                        label="Student Photo"
                        value={formData.photo || formData.image || ''}
                        onChange={(url) => setFormData({ ...formData, photo: url, image: url })}
                      />
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'faqs' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Answer</label>
                    <textarea
                      rows={4}
                      required
                      value={formData.answer || ''}
                      onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </>
              )}

              {/* Status Toggle */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive !== false}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="text-xs font-medium text-slate-700">
                  Publish to live website (Active)
                </label>
              </div>

              {/* Modal footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
