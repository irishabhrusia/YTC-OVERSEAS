'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Building2,
  MapPin,
  Sparkles,
  Filter,
  ArrowRight,
  GraduationCap,
  Award,
  CheckCircle2,
  Globe,
  SlidersHorizontal,
  BookOpen,
  DollarSign
} from 'lucide-react';
import PageHeader from '../PageHeader';
import { pageHeaders } from '../../data/pageHeaders';
import ConsultationModal from '../homesection/ConsultationModal';
import { fetchUniversities, fetchCountries } from '../../lib/api';

// Program discipline categories for quick filtering
const disciplines = [
  { id: 'all', label: 'All Disciplines' },
  { id: 'stem', label: 'STEM & AI', keywords: ['computer', 'ai', 'robotics', 'stem', 'physics', 'tech', 'data', 'automotive'] },
  { id: 'business', label: 'Business & MBA', keywords: ['business', 'mba', 'finance', 'management', 'economics', 'commerce'] },
  { id: 'health', label: 'Medicine & Health', keywords: ['medicine', 'health', 'biomedical', 'clinical', 'pharmacy', 'biotech'] },
  { id: 'engineering', label: 'Engineering', keywords: ['engineering', 'mechanical', 'aerospace', 'civil', 'chemical'] },
  { id: 'law-arts', label: 'Law & Humanities', keywords: ['law', 'arts', 'media', 'cinema', 'policy', 'humanities'] },
];

export default function PartnerUniversitiesView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedDiscipline, setSelectedDiscipline] = useState('all');
  const [sortBy, setSortBy] = useState('rank');
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState('USA');

  const handleOpenConsultation = (destination = 'USA') => {
    setSelectedDestination(destination);
    setIsConsultationModalOpen(true);
  };

  const [liveUnis, setLiveUnis] = useState([]);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    let ignore = false;
    fetchUniversities({ limit: 100 }).then((data) => {
      const list = Array.isArray(data) ? data : (data?.universities || []);
      if (!ignore && list.length > 0) {
        setLiveUnis(list);
      }
    });
    fetchCountries().then((data) => {
      if (!ignore && Array.isArray(data) && data.length > 0) {
        setCountries(data);
      }
    });
    return () => {
      ignore = true;
    };
  }, []);

  // Compile all universities directly from live database
  const allUniversities = useMemo(() => {
    return (liveUnis || []).map((u) => {
      const location = [u.city, u.country?.name].filter(Boolean).join(', ') || u.country?.name || 'Global Campus';
      return {
        name: u.name || '',
        qsRank: u.ranking ? `#${u.ranking}` : '#—',
        city: u.city || '',
        location,
        popularFor: Array.isArray(u.popularCourses) && u.popularCourses.length > 0
          ? u.popularCourses.join(', ')
          : u.description || 'Comprehensive Degree Programs',
        acceptanceRate: u.acceptanceRate || 'Competitive',
        avgTuition: u.tuitionFrom ? `$${u.tuitionFrom.toLocaleString()} / Yr` : 'Varies',
        id: u._id || u.slug,
        slug: u.slug || u._id,
        countryName: u.country?.name || 'Partner Destination',
        countryShort: u.country?.code || 'INTL',
        countrySlug: u.country?.slug || 'usa',
        flag: u.country?.flag || '🎓',
        flagPath: u.country?.flagPath || '/flags/usa.svg',
        accentColor: u.country?.accentColor || '#2563eb',
        numericRank: typeof u.ranking === 'number' ? u.ranking : parseInt(u.ranking, 10) || 999,
        website: u.website,
        image: u.image || u.logo || '',
        logo: u.logo || u.image || '',
      };
    });
  }, [liveUnis]);

  // Filtered and sorted universities
  const filteredUniversities = useMemo(() => {
    const q = (searchQuery || '').toLowerCase().trim();

    return allUniversities
      .filter((uni) => {
        // Country filter
        if (selectedCountry !== 'all' && uni.countrySlug !== selectedCountry) {
          return false;
        }

        // Discipline filter
        if (selectedDiscipline !== 'all') {
          const disc = disciplines.find((d) => d.id === selectedDiscipline);
          if (disc && disc.keywords) {
            const matchesDiscipline = disc.keywords.some((kw) =>
              (uni.popularFor || '').toLowerCase().includes(kw)
            );
            if (!matchesDiscipline) return false;
          }
        }

        // Search Query filter
        if (q) {
          const matchName = (uni.name || '').toLowerCase().includes(q);
          const matchLocation = (uni.location || '').toLowerCase().includes(q);
          const matchCountry =
            (uni.countryName || '').toLowerCase().includes(q) ||
            (uni.countryShort || '').toLowerCase().includes(q);
          const matchPrograms = (uni.popularFor || '').toLowerCase().includes(q);
          if (!matchName && !matchLocation && !matchCountry && !matchPrograms) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rank') {
          return a.numericRank - b.numericRank;
        }
        if (sortBy === 'name') {
          return (a.name || '').localeCompare(b.name || '');
        }
        return 0;
      });
  }, [allUniversities, searchQuery, selectedCountry, selectedDiscipline, sortBy]);

  const headerConfig = pageHeaders['partner-universities'] || {
    variant: 'light',
    badge: 'PARTNER INSTITUTION DIRECTORY',
    title: 'Search Top Partner Universities Worldwide',
    description:
      'Explore and filter through 500+ QS-ranked partner universities across our 8 global study destinations. Compare tuition fees, popular programs, locations, and admission requirements.',
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Study Abroad', href: '/study-abroad' },
      { label: 'Partner Universities', href: '/partner-universities' },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F4F8FD] via-[#EDF4FC] to-[#F1F6FD] text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* ── 1. Page Header ── */}
      <PageHeader
        variant="light"
        data={headerConfig}
        onOpenConsultation={() => handleOpenConsultation('USA')}
      />

      {/* ── 2. Directory Key Stats Strip ── */}
      <section className="py-6 bg-white border-b border-slate-200/80 shadow-xs relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
            <div className="p-3">
              <span className="block text-2xl sm:text-3xl font-black text-blue-600">8</span>
              <span className="text-xs sm:text-sm font-semibold text-slate-600">Global Study Hubs</span>
            </div>
            <div className="p-3 border-l border-slate-100">
              <span className="block text-2xl sm:text-3xl font-black text-blue-600">500+</span>
              <span className="text-xs sm:text-sm font-semibold text-slate-600">Partner Universities</span>
            </div>
            <div className="p-3 border-l border-slate-100">
              <span className="block text-2xl sm:text-3xl font-black text-blue-600">Top 1%</span>
              <span className="text-xs sm:text-sm font-semibold text-slate-600">QS World Ranked</span>
            </div>
            <div className="p-3 border-l border-slate-100">
              <span className="block text-2xl sm:text-3xl font-black text-blue-600">100%</span>
              <span className="text-xs sm:text-sm font-semibold text-slate-600">Direct Application Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Main Search & Filtering Directory ── */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Search Box & Multi-Filters Panel */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl mb-10 space-y-6">
            
            {/* Top Row: Search Input + Sort Dropdown */}
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search university name, city, program (e.g. Toronto, Harvard, AI, MBA, Berlin)..."
                  className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm text-slate-800 placeholder:text-slate-400 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-700 p-1"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Sort by dropdown */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1 shrink-0">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Sort by:</span>
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3.5 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="rank">QS World Rank (High to Low)</option>
                  <option value="name">University Name (A - Z)</option>
                </select>
              </div>
            </div>

            {/* Middle Row: Country Filter Tabs */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-500" />
                <span>Filter By Destination</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setSelectedCountry('all')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedCountry === 'all'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  All Destinations ({allUniversities.length})
                </button>
                {countries.map((c) => (
                  <button
                    key={c.slug}
                    onClick={() => setSelectedCountry(c.slug)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      selectedCountry === c.slug
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span className="text-sm leading-none">{c.flag || '🌍'}</span>
                    <span>{c.shortName || c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Row: Discipline / Field of Study Filter */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                <span>Filter By Discipline</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {disciplines.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDiscipline(d.id)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      selectedDiscipline === d.id
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Filters Summary Bar */}
            <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
              <span className="font-medium">
                Showing <strong>{filteredUniversities.length}</strong> of <strong>{allUniversities.length}</strong> institutions
              </span>
              {(selectedCountry !== 'all' || selectedDiscipline !== 'all' || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedCountry('all');
                    setSelectedDiscipline('all');
                    setSearchQuery('');
                  }}
                  className="text-blue-600 font-bold hover:underline cursor-pointer"
                >
                  Reset all filters
                </button>
              )}
            </div>

          </div>

          {/* ── 4. University Results Grid ── */}
          {filteredUniversities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredUniversities.map((uni) => (
                <motion.div
                  key={uni.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-md hover:shadow-2xl hover:border-blue-400 transition-all flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Subtle top country accent bar */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1.5 opacity-80"
                    style={{ backgroundColor: uni.accentColor || '#2563EB' }}
                  />

                  <div className="space-y-4 pt-1">
                    {/* Header: Flag, Country & QS Rank */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                        <span className="text-xl leading-none">{uni.flag}</span>
                        <span>{uni.countryName}</span>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-100 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-blue-600" />
                        <span>QS {uni.qsRank}</span>
                      </span>
                    </div>

                    {/* University Logo & Name (Linked to Full Profile) */}
                    <div className="flex items-start gap-3">
                      {uni.image ? (
                        <Link
                          href={`/partner-universities/${uni.slug}`}
                          className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden shrink-0 shadow-2xs hover:border-blue-400 transition-colors block"
                        >
                          <img
                            src={uni.image}
                            alt={uni.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </Link>
                      ) : (
                        <Link
                          href={`/partner-universities/${uni.slug}`}
                          className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 font-extrabold text-sm flex items-center justify-center border border-blue-100 shrink-0 hover:bg-blue-100 transition-colors block"
                        >
                          {uni.name.split(' ').slice(0, 2).map((w) => w[0]).join('')}
                        </Link>
                      )}
                      <div className="flex-1 min-w-0">
                        <Link href={`/partner-universities/${uni.slug}`} className="block">
                          <h3 className="font-extrabold text-base sm:text-lg text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                            {uni.name}
                          </h3>
                        </Link>
                      </div>
                    </div>

                    {/* Location */}
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span>{uni.location}</span>
                    </p>

                    {/* Programs */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                        Popular Degrees & Majors
                      </span>
                      <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                        {uni.popularFor}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer: Avg Fee & Actions */}
                  <div className="pt-5 mt-5 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Average Tuition
                        </span>
                        <span className="text-xs font-extrabold text-blue-700">
                          {uni.avgTuition}
                        </span>
                      </div>

                      <Link
                        href={`/study-abroad/${uni.countrySlug}`}
                        className="text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1"
                      >
                        <span>{uni.countryShort} Guide</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <Link
                        href={`/partner-universities/${uni.slug}`}
                        className="py-2.5 px-3 rounded-xl border border-slate-300 hover:border-blue-500 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-bold text-xs transition-all flex items-center justify-center gap-1"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>

                      <button
                        onClick={() => handleOpenConsultation(uni.countryName)}
                        className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>Apply Now</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/90 p-8 shadow-sm max-w-xl mx-auto space-y-4">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900">No Universities Found</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                We could not find any institutions matching &quot;{searchQuery}&quot; with your selected filters. Try broadening your keywords or clearing the active filters.
              </p>
              <button
                onClick={() => {
                  setSelectedCountry('all');
                  setSelectedDiscipline('all');
                  setSearchQuery('');
                }}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          )}

        </div>
      </section>

      {/* ── 5. Bottom Consultation Banner ── */}
      <section className="py-16 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.3),transparent_70%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold tracking-wide text-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>CUSTOM UNIVERSITY MATCHING</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight max-w-2xl mx-auto">
            Can&apos;t Find Your Dream University or Course?
          </h2>
          <p className="text-blue-100/90 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Our certified international education advisors maintain direct ties with 500+ unlisted colleges, medical schools, and private institutions globally.
          </p>
          <div className="pt-2">
            <button
              onClick={() => handleOpenConsultation('USA')}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#FF7A18] via-[#FF6A00] to-[#FF4E00] hover:from-[#ff882b] hover:to-[#ff5c14] text-white font-bold text-sm shadow-xl shadow-orange-600/30 transition-all cursor-pointer group"
            >
              <span>Get Free University Profile Evaluation</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>

      {/* ── Consultation Modal ── */}
      <ConsultationModal
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
        initialDestination={selectedDestination}
      />
    </div>
  );
}
