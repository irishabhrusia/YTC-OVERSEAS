'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  Globe,
  MapPin,
  Calendar,
  CreditCard,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Building2,
  ArrowRight,
  ChevronDown,
  Sparkles,
  ChevronRight,
  BookOpen,
  DollarSign,
  Award,
  HelpCircle
} from 'lucide-react';
import PageHeader from '../PageHeader';
import ConsultationModal from '../homesection/ConsultationModal';
import { fetchUniversities } from '../../lib/api';

export default function CountryDetailView({ country, allCountries, initialUniversities = [] }) {
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [liveUnis, setLiveUnis] = useState(initialUniversities || []);

  const toggleFaq = (idx) => setOpenFaqIndex(openFaqIndex === idx ? null : idx);

  // Synchronize live universities from database for this country
  useEffect(() => {
    if (initialUniversities && initialUniversities.length > 0) {
      setLiveUnis(initialUniversities);
      return;
    }
    let ignore = false;
    const countryId = country?._id || country?.slug;
    if (countryId) {
      fetchUniversities({ country: countryId, limit: 100 }).then((data) => {
        const list = Array.isArray(data) ? data : (data?.universities || []);
        if (!ignore && list.length > 0) {
          setLiveUnis(list);
        }
      });
    }
    return () => {
      ignore = true;
    };
  }, [country, initialUniversities]);

  // Derived Top Universities for this country (live DB first, then seed fallback, else empty)
  const displayUniversities = useMemo(() => {
    if (Array.isArray(liveUnis) && liveUnis.length > 0) {
      return liveUnis.map((u) => {
        const rawRanking = u.ranking;
        const qsRank = rawRanking
          ? (String(rawRanking).startsWith('#') ? String(rawRanking) : `QS #${rawRanking}`)
          : 'QS Top';
        const popularFor = Array.isArray(u.popularCourses) && u.popularCourses.length > 0
          ? u.popularCourses.join(', ')
          : (u.description || 'Comprehensive Degree Programs');
        const avgFee = u.tuitionFrom ? `$${u.tuitionFrom.toLocaleString()} / Yr` : (u.avgFee || 'Tuition Varies');
        const location = [u.city, country?.name].filter(Boolean).join(', ') || country?.name || '';

        return {
          id: u._id || u.slug,
          slug: u.slug || '',
          name: u.name,
          qsRank,
          location,
          popularFor,
          avgFee,
          image: u.image || u.logo || '',
          logo: u.logo || u.image || '',
        };
      });
    }

    if (Array.isArray(country?.topUniversities) && country.topUniversities.length > 0) {
      return country.topUniversities.map((u, i) => ({
        id: u._id || `top-${i}`,
        slug: u.slug || '',
        name: u.name,
        qsRank: u.qsRank || 'QS Top',
        location: u.city ? `${u.city}, ${country?.name}` : (u.location || country?.name || ''),
        popularFor: u.popularFor || 'Undergraduate & Postgraduate Degrees',
        avgFee: u.avgFee || u.avgTuition || 'Varies by Program',
        image: u.image || '',
        logo: u.logo || '',
      }));
    }

    return [];
  }, [liveUnis, country]);

  // Derived Why Study in [Country] with rich fallbacks so newly created countries are never blank
  const displayWhyStudy = useMemo(() => {
    if (Array.isArray(country?.whyStudy) && country.whyStudy.length > 0) {
      const filtered = country.whyStudy.filter((item) => item && (item.title || item.desc));
      if (filtered.length > 0) return filtered;
    }
    const countryName = country?.name || 'this destination';
    return [
      {
        title: 'World-Class Academic Excellence',
        desc: `Top accredited universities in ${countryName} offer rigorous degree curricula, internationally certified faculty, and state-of-the-art research laboratories.`,
      },
      {
        title: 'Post-Study Work & Career Pathways',
        desc: `Graduates in ${countryName} gain direct access to post-study work permits, opening fast pathways to multinational internships and employment.`,
      },
      {
        title: 'Competitive Tuition & Scholarships',
        desc: `Benefit from high value for money with accessible tuition fee structures, departmental scholarships, and generous campus work rights.`,
      },
      {
        title: 'Vibrant Multicultural Community',
        desc: `Enjoy a welcoming, safe environment fostering global student networking, inclusive campus activities, and lifelong friendships.`,
      },
    ];
  }, [country]);

  // Derived Popular Programs with fallbacks
  const displayPrograms = useMemo(() => {
    if (Array.isArray(country?.popularPrograms) && country.popularPrograms.length > 0) {
      const filtered = country.popularPrograms.filter((p) => typeof p === 'string' && p.trim().length > 0);
      if (filtered.length > 0) return filtered;
    }
    return [
      'Computer Science & Artificial Intelligence',
      'Business Administration & Management (MBA)',
      'Data Science & Big Data Analytics',
      'Mechanical & Aerospace Engineering',
      'Biomedical Sciences, Healthcare & Nursing',
      'Finance, International Banking & Accounting',
      'Digital Marketing & Communications',
      'Cybersecurity & Cloud Computing',
    ];
  }, [country]);

  // Derived Stats with fallbacks
  const displayStats = useMemo(() => {
    if (Array.isArray(country?.stats) && country.stats.length > 0) {
      const filtered = country.stats.filter((s) => s && (s.value || s.label));
      if (filtered.length > 0) return filtered;
    }
    return [
      { label: 'Top Universities', value: '25+' },
      { label: 'Intl. Students', value: '100K+' },
      { label: 'Work Rights', value: '20 Hrs/Wk' },
      { label: 'Post-Study Work', value: 'Up to 3 Years' },
    ];
  }, [country]);

  // Other countries excluding current one
  const otherCountries = (allCountries || []).filter((c) => c?.slug !== country?.slug);

  // Country FAQs normalization with fallback support
  const countryFaqs = useMemo(() => {
    if (!country) return [];
    const raw = Array.isArray(country.faqs) ? country.faqs : [];
    const cleaned = raw
      .map((item) => ({
        question: (item.question || item.q || '').trim(),
        answer: (item.answer || item.a || '').trim(),
      }))
      .filter((item) => item.question.length > 0 && item.answer.length > 0);

    if (cleaned.length > 0) return cleaned;

    const countryName = country.name || 'this destination';
    return [
      {
        question: `What are the post-study work opportunities in ${countryName}?`,
        answer: `Graduates in ${countryName} are eligible for post-study work visas ranging from 1 to 3+ years depending on qualification level and region, allowing students to gain valuable international career experience.`,
      },
      {
        question: `Can I work part-time while studying in ${countryName}?`,
        answer: `Yes, international students are generally permitted to work up to 20-24 hours per week during academic semesters and full-time during scheduled vacations and semester breaks.`,
      },
      {
        question: `What are the English language proficiency requirements for ${countryName}?`,
        answer: `Most universities and colleges accept IELTS, TOEFL, PTE Academic, or Duolingo English Test scores. Required scores typically range from 6.0 to 7.0 for undergraduate and postgraduate degrees.`,
      },
      {
        question: `Are scholarships available for international students in ${countryName}?`,
        answer: `Yes! Institutions offer merit-based and need-based scholarships covering anywhere from partial tuition discounts to full scholarships.`,
      },
      {
        question: `When should I start my application process for ${countryName}?`,
        answer: `It is best to start your application process 8 to 12 months in advance of your intended intake to allow ample time for admissions, exams, and visa processing.`,
      },
    ];
  }, [country]);

  if (!country) return null;

  // Data for PageHeader variant="flag"
  const headerData = {
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Study Abroad', href: '/study-abroad' },
      { label: country.name, href: `/study-abroad/${country.slug}` },
    ],
    badge: `STUDY IN ${country.name.toUpperCase()} · ${country.badge}`,
    title: country.headline || country.heroTagline,
    description: country.description || country.heroDescription,
    flagPath: country.flagPath,
    flagEmoji: country.flag,
    heroImage: country.heroImage,
    heroAlt: country.heroAlt,
    countryName: country.name,
    accentColor: country.accentColor,
    quickFacts: country.quickFacts,
    primaryBtnText: `Apply to ${country.shortName} Universities`,
    secondaryBtnText: 'View Universities',
    secondaryBtnHref: '#top-universities',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F4F8FD] via-[#EDF4FC] to-[#F1F6FD] text-slate-900 overflow-x-hidden selection:bg-blue-600 selection:text-white">
      
      {/* ── 1. Flag Header (Variant: flag) ── */}
      <PageHeader
        variant="flag"
        data={headerData}
        onOpenConsultation={() => setIsConsultationModalOpen(true)}
      />

      {/* ── 2. Key Metrics Bar (Clean spacing, no broken negative overlap) ── */}
      <section className="py-10 bg-white/70 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {displayStats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-blue-300 transition-all text-center flex flex-col items-center justify-center group"
              >
                <span
                  className="text-2xl sm:text-3xl font-black group-hover:scale-105 transition-transform duration-200"
                  style={{ color: country.accentColor || '#2563EB' }}
                >
                  {stat.value}
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 mt-1">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Why Study in [Country] ── */}
      <section id="why-study" className="py-16 sm:py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span
              className="text-xs font-bold tracking-wider uppercase block mb-1"
              style={{ color: country.accentColor || '#2563EB' }}
            >
              KEY ADVANTAGES
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Why Choose to Study in {country.name}?
            </h2>
            <p className="text-slate-500 text-sm sm:text-base mt-2">
              Transformative benefits that make {country.name} a top global destination for international students.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayWhyStudy.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                whileHover={{ y: -8 }}
                className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-xs">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-2.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ── 4. Top Universities & Colleges ── */}
      <section id="top-universities" className="py-16 sm:py-24 bg-gradient-to-b from-[#EDF4FC] via-[#F4F8FD] to-[#E9F2FC] border-y border-blue-100/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
            <div>
              <span
                className="text-xs font-bold tracking-wider uppercase block mb-1"
                style={{ color: country.accentColor || '#2563EB' }}
              >
                PREMIER INSTITUTIONS
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Top Universities in {country.name}
              </h2>
              <p className="text-slate-500 text-sm sm:text-base mt-1.5 max-w-xl">
                Partner institutions with guaranteed application support, scholarship matching, and fast-track offer letters.
              </p>
            </div>
            <button
              onClick={() => setIsConsultationModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 transition-all self-start sm:self-auto group cursor-pointer"
            >
              <span>Get Shortlisted for Universities</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {displayUniversities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayUniversities.map((uni, idx) => (
                <motion.div
                  key={uni.id || idx}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: idx * 0.08 }}
                  whileHover={{ y: -6 }}
                  className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-md hover:shadow-2xl hover:border-blue-400 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-100 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-blue-600" />
                        <span>{uni.qsRank}</span>
                      </span>
                      <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-blue-500" />
                        <span>{uni.location}</span>
                      </span>
                    </div>

                    <div className="flex items-start gap-3">
                      {uni.image ? (
                        <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden shrink-0 shadow-2xs">
                          <img
                            src={uni.image}
                            alt={uni.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 font-extrabold text-sm flex items-center justify-center border border-blue-100 shrink-0">
                          {(uni.name || '').split(' ').slice(0, 2).map((w) => w[0]).join('')}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        {uni.slug ? (
                          <Link href={`/partner-universities/${uni.slug}`} className="block">
                            <h3 className="font-extrabold text-lg text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                              {uni.name}
                            </h3>
                          </Link>
                        ) : (
                          <h3 className="font-extrabold text-lg text-slate-900 leading-snug">
                            {uni.name}
                          </h3>
                        )}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                      <div>
                        <span className="text-slate-400 font-medium block">Popular Programs:</span>
                        <span className="font-semibold text-slate-800 line-clamp-2">{uni.popularFor}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium block">Average Annual Tuition:</span>
                        <span className="font-bold text-blue-700">{uni.avgFee}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between gap-2">
                    {uni.slug ? (
                      <Link
                        href={`/partner-universities/${uni.slug}`}
                        className="text-xs font-bold text-slate-700 hover:text-blue-600 inline-flex items-center gap-1 group/btn transition-colors"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                      </Link>
                    ) : (
                      <button
                        onClick={() => setIsConsultationModalOpen(true)}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 group/btn cursor-pointer"
                      >
                        <span>Apply to this University</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                      </button>
                    )}

                    <button
                      onClick={() => setIsConsultationModalOpen(true)}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                    >
                      Apply Now
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            /* Clean Empty State when no universities exist yet */
            <div className="bg-white rounded-3xl p-10 sm:p-14 border border-slate-200/90 shadow-sm text-center max-w-2xl mx-auto space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-2xs">
                <GraduationCap className="w-8 h-8" />
              </div>
              <h3 className="font-extrabold text-xl sm:text-2xl text-slate-900">
                Partner Institutions in {country.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
                We are actively expanding and verifying direct articulation partnerships with top universities across {country.name}.
                Our senior counselors provide 1-on-1 profile evaluation, bespoke university shortlisting, and direct admission applications.
              </p>
              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => setIsConsultationModalOpen(true)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Request {country.name} University Shortlist</span>
                </button>
                <Link
                  href="/partner-universities"
                  className="px-5 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors"
                >
                  Explore All Global Universities
                </Link>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* ── 5. Popular Programs & Degrees of Study ── */}
      <section id="popular-programs" className="py-16 sm:py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span
              className="text-xs font-bold tracking-wider uppercase block mb-1"
              style={{ color: country.accentColor || '#2563EB' }}
            >
              IN-DEMAND DISCIPLINES
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Popular Programs in {country.name}
            </h2>
            <p className="text-slate-500 text-sm sm:text-base mt-2">
              Leading fields of study offering high graduate employability and global post-study work opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayPrograms.map((prog, i) => (
              <div
                key={i}
                className="p-4 sm:p-5 rounded-2xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200/80 hover:border-blue-300 transition-all flex items-center gap-3.5 group cursor-default"
              >
                <div className="w-10 h-10 rounded-xl bg-white text-blue-600 flex items-center justify-center shrink-0 shadow-xs group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                  {prog}
                </span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── 6. Visa Requirements & Scholarships Dual Grid ── */}
      <section id="visa-and-scholarships" className="py-16 sm:py-24 bg-gradient-to-b from-[#F3F7FD] via-[#EEF5FD] to-[#F0F6FD] border-t border-blue-100/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left: Visa & Admission Requirements */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-7 sm:p-9 border border-slate-200/90 shadow-xl space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xl text-slate-900">Visa & Admission Prerequisites</h3>
                  <p className="text-xs text-slate-500">Core criteria to study in {country.name}</p>
                </div>
              </div>

              <div className="space-y-3.5">
                {(country.visaRequirements || []).map((req, ri) => (
                  <div key={ri} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed font-medium">{req}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 text-xs text-blue-800 space-y-1">
                <p className="font-bold">Need assistance with visa documentation?</p>
                <p className="text-slate-600">Our certified visa case managers review financial statements, SOPs, and conduct mock consular interviews.</p>
              </div>
            </div>

            {/* Right: Scholarship Opportunities */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-7 sm:p-9 border border-slate-200/90 shadow-xl space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xl text-slate-900">Scholarships & Financial Aid</h3>
                  <p className="text-xs text-slate-500">Funding opportunities for international scholars</p>
                </div>
              </div>

              <div className="space-y-4">
                {(country.scholarships || []).map((sch, si) => (
                  <div key={si} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-amber-300 transition-colors">
                    <h4 className="font-bold text-sm sm:text-base text-slate-900">{sch.name}</h4>
                    <p className="text-xs text-amber-700 font-semibold mt-1">Coverage: {sch.coverage}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setIsConsultationModalOpen(true)}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-blue-500/20 cursor-pointer"
              >
                Check Your Scholarship Eligibility
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* ── 7. Country FAQs ── */}
      <section id="country-faqs" className="py-16 sm:py-24 bg-white relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-blue-600 uppercase mb-1">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Got Questions About Studying in {country.name}?
            </h2>
          </div>

          <div className="space-y-3">
            {countryFaqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isOpen ? 'border-blue-400 shadow-md bg-white' : 'border-slate-200/90 bg-white hover:border-blue-200'
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left cursor-pointer focus:outline-none"
                  >
                    <span className="font-semibold text-sm sm:text-base text-slate-900 leading-snug">
                      {faq.question}
                    </span>
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform shrink-0 ${
                        isOpen ? 'bg-blue-600 text-white rotate-180' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3"
                      >
                        {faq.answer}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ── 8. Switch to Other Destinations ── */}
      <section className="py-16 bg-gradient-to-b from-[#F4F8FD] to-[#EDF4FC] border-y border-blue-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-black text-slate-900">Explore Other Study Destinations</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Compare international academic opportunities worldwide</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
            {otherCountries.map((c) => (
              <Link
                key={c.slug}
                href={`/study-abroad/${c.slug}`}
                className="p-3.5 bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400 hover:shadow-lg transition-all flex flex-col items-center text-center gap-1.5 group"
              >
                {c.flagPath ? (
                  <div className="w-10 h-7 rounded overflow-hidden shadow-xs border border-slate-200 group-hover:scale-110 transition-transform">
                    <img src={c.flagPath} alt={c.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <span className="text-2xl leading-none">{c.flag}</span>
                )}
                <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                  {c.shortName}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. Final Call To Action Banner ── */}
      <section className="py-16 sm:py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-r from-[#0E4DA4] via-[#125ec9] to-[#0A3D85] text-white p-8 sm:p-14 overflow-hidden shadow-2xl">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-3 max-w-2xl text-left">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-bold tracking-widest uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                  <span>START YOUR APPLICATION TODAY</span>
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                  Ready to Study in {country.name}?
                </h2>
                <p className="text-blue-100 text-sm sm:text-base leading-relaxed max-w-xl">
                  Connect with our certified country specialists. We assess your profile, shortlist optimal institutions, and streamline your visa filing.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  onClick={() => setIsConsultationModalOpen(true)}
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm sm:text-base shadow-xl hover:shadow-2xl transition-all cursor-pointer group"
                >
                  <span>Book Free Consultation</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm sm:text-base border border-white/25 backdrop-blur-md transition-all"
                >
                  <span>Contact Advisor</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 10. Consultation Modal Integration ── */}
      <ConsultationModal
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
        initialDestination={country.shortName}
        onSubmit={(data) => {
          console.log(`Consultation requested for ${country.name}:`, data);
        }}
      />

    </div>
  );
}
