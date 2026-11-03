'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Globe,
  Search,
  ArrowRight,
  MapPin,
  Sparkles,
  Building2,
  Filter
} from 'lucide-react';
import PageHeader from '../../component/PageHeader';
import { pageHeaders } from '../../data/pageHeaders';
import ConsultationModal from '../../component/homesection/ConsultationModal';
import { fetchCountries } from '../../lib/api';

export default function StudyAbroadHubPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountryFilter, setSelectedCountryFilter] = useState('all');
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState('Canada');
  const [liveCountries, setLiveCountries] = useState([]);

  useEffect(() => {
    let ignore = false;
    fetchCountries().then((data) => {
      if (!ignore && Array.isArray(data) && data.length > 0) {
        setLiveCountries(data);
      }
    });
    return () => {
      ignore = true;
    };
  }, []);

  const handleOpenConsultation = (destination = 'Canada') => {
    setSelectedDestination(destination);
    setIsConsultationModalOpen(true);
  };

  // Compile all universities across all countries for the live university search
  const allUniversities = useMemo(() => {
    return liveCountries.flatMap((c) =>
      (c.topUniversities || []).map((uni) => ({
        ...uni,
        location: uni.city || uni.location || c.name,
        countryName: c.name,
        countrySlug: c.slug,
        flag: c.flag || '🎓',
        flagPath: c.flagPath || '',
      }))
    );
  }, [liveCountries]);

  // Filtered universities based on search query and country filter
  const filteredUniversities = useMemo(() => {
    return allUniversities.filter((uni) => {
      const matchesCountry =
        selectedCountryFilter === 'all' || uni.countrySlug === selectedCountryFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        uni.name.toLowerCase().includes(q) ||
        uni.location.toLowerCase().includes(q) ||
        uni.popularFor.toLowerCase().includes(q) ||
        uni.countryName.toLowerCase().includes(q);

      return matchesCountry && matchesQuery;
    });
  }, [allUniversities, searchQuery, selectedCountryFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F4F8FD] via-[#EDF4FC] to-[#F1F6FD] text-slate-900 overflow-x-hidden selection:bg-blue-600 selection:text-white">
      
      {/* ── 1. Reusable PageHeader (Variant: light with embedded search) ── */}
      <PageHeader
        variant="light"
        data={pageHeaders['study-abroad']}
        onOpenConsultation={() => handleOpenConsultation('Canada')}
      >
        <div className="mt-4 max-w-2xl">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by university name, city, or program (e.g., Harvard, Toronto, MBA, Data)..."
              className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-sm text-slate-900 placeholder:text-slate-400"
            />
            <Link
              href="/partner-universities"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              Search
            </Link>
          </div>
        </div>
      </PageHeader>

      {/* ── 2. All 8 Country Cards Grid ── */}
      <section className="py-14 sm:py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold tracking-wider text-blue-600 uppercase block mb-1">
              CHOOSE YOUR PATHWAY
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Top 8 International Education Hubs
            </h2>
            <p className="text-slate-500 text-sm sm:text-base mt-2">
              Click any country to explore detailed guides on universities, visas, tuition, and post-graduation opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {liveCountries.map((country, idx) => (
              <motion.div
                key={country.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.07 }}
                whileHover={{ y: -8 }}
                className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-2xl hover:border-blue-400 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <Link href={`/study-abroad/${country.slug}`} className="block relative h-48 w-full overflow-hidden bg-slate-900">
                    {/* Real flag image */}
                    <img
                      src={country.flagPath || country.heroImage || '/destinations/usa.webp'}
                      alt={`${country.name} Flag`}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out opacity-85"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    
                    {country.badge && (
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-[10px] font-bold text-slate-800 px-2.5 py-0.5 rounded-full shadow-md">
                        {country.badge}
                      </div>
                    )}

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl leading-none" role="img" aria-label={country.name}>
                          {country.flag || '🌍'}
                        </span>
                        <h3 className="font-black text-lg leading-tight">{country.name}</h3>
                      </div>
                    </div>
                  </Link>

                  <div className="p-5 space-y-3">
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {country.headline || country.heroTagline}
                    </p>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Post-Study Work:</span>
                        <span className="font-bold text-slate-800">{country.stats[3].value}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Average Tuition:</span>
                        <span className="font-bold text-blue-700">{country.quickFacts.avgTuition.split('/')[0]}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Work Rights:</span>
                        <span className="font-semibold text-slate-700">{country.stats[2].value}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    href={`/study-abroad/${country.slug}`}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-50 group-hover:bg-blue-600 text-blue-700 group-hover:text-white text-xs sm:text-sm font-bold transition-all shadow-xs"
                  >
                    <span>Explore {country.shortName} Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ── 3. Interactive Search Universities Section (#search-universities) ── */}
      <section
        id="search-universities"
        className="py-16 sm:py-24 bg-gradient-to-b from-[#EDF4FC] via-[#F4F8FD] to-[#E9F2FC] border-y border-blue-100/60 relative scroll-mt-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-blue-600 uppercase mb-1">
              <Building2 className="w-3.5 h-3.5" />
              <span>LIVE INSTITUTION DIRECTORY</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Search Partner Universities
            </h2>
            <p className="text-slate-500 text-sm sm:text-base mt-2">
              Filter through top QS-ranked universities across our 8 partner study destinations.
            </p>
            <div className="mt-3">
              <Link
                href="/partner-universities"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition-colors shadow-2xs"
              >
                <span>Open Full Directory on Dedicated Page</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-xl mb-10 space-y-4">
            
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search university name, city, program (e.g. Toronto, Harvard, AI, MBA)..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-800 placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                <span>Filter:</span>
              </span>
              <button
                onClick={() => setSelectedCountryFilter('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedCountryFilter === 'all'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Destinations
              </button>
              {liveCountries.map((c) => (
                <button
                  key={c.slug}
                  onClick={() => setSelectedCountryFilter(c.slug)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    selectedCountryFilter === c.slug
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>{c.flag}</span>
                  <span>{c.shortName}</span>
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-500 flex justify-between items-center pt-1 border-t border-slate-100">
              <span>Showing <strong>{filteredUniversities.length}</strong> institutions</span>
              {selectedCountryFilter !== 'all' && (
                <button
                  onClick={() => setSelectedCountryFilter('all')}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Reset Filter
                </button>
              )}
            </div>
          </div>

          {filteredUniversities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUniversities.map((uni, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-md hover:shadow-xl hover:border-blue-400 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                        <span className="text-lg leading-none">{uni.flag}</span>
                        <span>{uni.countryName}</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-700">
                        {uni.qsRank}
                      </span>
                    </div>

                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                      {uni.name}
                    </h3>

                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span>{uni.location}</span>
                    </p>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
                      <span className="text-slate-400 block font-medium">Popular Programs:</span>
                      <span className="font-semibold text-slate-800 leading-snug block">{uni.popularFor}</span>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Avg Tuition</span>
                      <span className="text-xs font-bold text-blue-700">{uni.avgFee}</span>
                    </div>
                    <Link
                      href={`/study-abroad/${uni.countrySlug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
              <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-800">No Universities Match Your Search</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Try searching for a different keyword or resetting your country filter to view all institutions.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCountryFilter('all');
                }}
                className="mt-4 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold"
              >
                Reset All Filters
              </button>
            </div>
          )}

        </div>
      </section>

      {/* ── 4. Destination Comparison Table ── */}
      <section className="py-16 sm:py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold tracking-wider text-blue-600 uppercase block mb-1">
              SIDE-BY-SIDE MATRIX
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Compare Study Destinations
            </h2>
            <p className="text-slate-500 text-sm sm:text-base mt-2">
              Key factors international applicants evaluate before finalizing their academic destination.
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-200/90 shadow-md">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="py-4 px-5 font-bold">Country</th>
                  <th className="py-4 px-5 font-bold">Post-Study Work</th>
                  <th className="py-4 px-5 font-bold">Average Tuition / Yr</th>
                  <th className="py-4 px-5 font-bold">Annual Living Cost</th>
                  <th className="py-4 px-5 font-bold">Part-Time Work</th>
                  <th className="py-4 px-5 font-bold text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {liveCountries.map((c) => (
                  <tr key={c.slug} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-4 px-5 font-bold text-slate-900 flex items-center gap-2">
                      <span className="text-xl" role="img" aria-label={c.name}>{c.flag || '🌍'}</span>
                      <span>{c.name}</span>
                    </td>
                    <td className="py-4 px-5 text-slate-700 font-semibold">{c.stats?.[3]?.value || c.stats?.[0]?.value || 'Up to 3 Years'}</td>
                    <td className="py-4 px-5 font-bold text-blue-700">{c.quickFacts?.avgTuition || c.quickFacts?.averageTuition || 'Varies'}</td>
                    <td className="py-4 px-5 text-slate-600">{c.quickFacts?.avgLivingCost || c.quickFacts?.livingExpenses || 'Varies'}</td>
                    <td className="py-4 px-5 text-slate-700">{c.stats?.[2]?.value || c.stats?.[0]?.value || '20 Hrs/Wk'}</td>
                    <td className="py-4 px-5 text-right">
                      <Link
                        href={`/study-abroad/${c.slug}`}
                        className="inline-flex items-center gap-1 font-bold text-blue-600 hover:text-blue-700"
                      >
                        <span>View</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </section>

      {/* ── 5. Final CTA Banner ── */}
      <section className="py-16 sm:py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-r from-[#0E4DA4] via-[#125ec9] to-[#0A3D85] text-white p-8 sm:p-14 overflow-hidden shadow-2xl">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-3 max-w-2xl text-left">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-bold tracking-widest uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                  <span>PERSONALIZED ADMISSIONS ADVISORY</span>
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                  Unsure Which Country Suits Your Profile?
                </h2>
                <p className="text-blue-100 text-sm sm:text-base leading-relaxed max-w-xl">
                  Schedule a complimentary counseling session with our senior country specialists. We match your academic background, budget, and residency goals.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  onClick={() => handleOpenConsultation('Canada')}
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

      {/* ── 6. Consultation Modal ── */}
      <ConsultationModal
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
        initialDestination={selectedDestination}
        onSubmit={(data) => {
          console.log('Consultation requested from Study Abroad hub:', data);
        }}
      />

    </div>
  );
}
