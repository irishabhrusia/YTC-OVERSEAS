'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Globe,
  Search,
  ArrowRight,
  MapPin,
  Sparkles,
  ChevronRight,
  Building2,
  CheckCircle2,
  Filter
} from 'lucide-react';
import PageHeader from '../../component/PageHeader';
import { pageHeaders } from '../../data/pageHeaders';
import ConsultationModal from '../../component/homesection/ConsultationModal';
import { fetchCountries } from '../../lib/api';

// Region classifier for filters
const REGION_MAP = {
  usa: 'North America',
  canada: 'North America',
  uk: 'Europe',
  germany: 'Europe',
  ireland: 'Europe',
  australia: 'Oceania',
  'new-zealand': 'Oceania',
  uae: 'Middle East',
};

export default function DestinationsListingPage() {
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState('Canada');
  const [liveCountries, setLiveCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    fetchCountries().then((data) => {
      if (!ignore) {
        if (Array.isArray(data) && data.length > 0) {
          setLiveCountries(data);
        }
        setIsLoading(false);
      }
    });
    return () => {
      ignore = true;
    };
  }, []);

  const filteredCountries = useMemo(() => {
    return liveCountries.filter((c) => {
      const region = REGION_MAP[c.slug] || 'Other';
      const matchesRegion = selectedRegion === 'all' || region === selectedRegion;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.shortName && c.shortName.toLowerCase().includes(q)) ||
        (c.headline && c.headline.toLowerCase().includes(q)) ||
        (c.badge && c.badge.toLowerCase().includes(q));

      return matchesRegion && matchesQuery;
    });
  }, [searchQuery, selectedRegion, liveCountries]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F4F8FD] via-[#EDF4FC] to-[#F1F6FD] text-slate-900 overflow-x-hidden selection:bg-blue-600 selection:text-white">
      
      {/* ── 1. Reusable PageHeader (Variant: search) ── */}
      <PageHeader
        variant="search"
        data={pageHeaders.destinations}
      >
        {/* Controls Bar inside header */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-md space-y-3.5 max-w-3xl">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search destination by country, visa perk (e.g. Canada, STEM, Zero Tuition)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400"
            />
          </div>

          {/* Region Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Region:</span>
            </span>
            {['all', 'North America', 'Europe', 'Oceania', 'Middle East'].map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedRegion === reg
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {reg === 'all' ? 'All Regions' : reg}
              </button>
            ))}
          </div>
        </div>
      </PageHeader>

      {/* ── 2. Destination Cards Grid ── */}
      <section className="py-14 sm:py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Available Destinations ({filteredCountries.length})
            </h2>
            {selectedRegion !== 'all' && (
              <button
                onClick={() => setSelectedRegion('all')}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                Show All Destinations
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              <div className="col-span-full py-20 text-center text-slate-400">
                <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin mx-auto mb-3" />
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Loading Live Destinations...
                </p>
              </div>
            ) : filteredCountries.length === 0 ? (
              <div className="col-span-full py-16 text-center text-slate-400">
                <p className="text-sm font-medium">No destinations found matching your criteria.</p>
              </div>
            ) : (
              filteredCountries.map((c, idx) => (
              <motion.div
                key={c.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.07 }}
                whileHover={{ y: -8 }}
                className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-2xl hover:border-blue-400 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <Link href={`/study-abroad/${c.slug}`} className="block relative h-48 w-full overflow-hidden bg-slate-900">
                    <img
                      src={c.flagPath || c.heroImage || '/destinations/usa.webp'}
                      alt={`${c.name} Flag`}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 opacity-85"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                    {c.badge && (
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-[10px] font-bold text-slate-800 px-2.5 py-0.5 rounded-full shadow-md">
                        {c.badge}
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white">
                      <span className="text-2xl leading-none">{c.flag || '🌍'}</span>
                      <h3 className="font-black text-lg">{c.name}</h3>
                    </div>
                  </Link>

                  <div className="p-5 space-y-3 text-xs">
                    <p className="text-slate-500 leading-relaxed line-clamp-2">
                      {c.headline}
                    </p>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Post-Study Work:</span>
                        <span className="font-bold text-slate-800">
                          {c.stats?.[3]?.value || c.stats?.[0]?.value || 'Up to 3 Years'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Average Tuition:</span>
                        <span className="font-bold text-blue-700">
                          {(c.quickFacts?.avgTuition || c.quickFacts?.averageTuition || '$15,000 / Yr').split('/')[0]}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Major Intakes:</span>
                        <span className="font-semibold text-slate-700 truncate max-w-[140px]">
                          {c.quickFacts?.intakes || c.quickFacts?.majorIntakes || 'Fall, Spring'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    href={`/study-abroad/${c.slug}`}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-50 group-hover:bg-blue-600 text-blue-700 group-hover:text-white text-xs sm:text-sm font-bold transition-all shadow-xs"
                  >
                    <span>View Destination Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            )))}
          </div>

        </div>
      </section>

      {/* ── 3. Final Consultation CTA ── */}
      <section className="py-16 sm:py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-r from-[#0E4DA4] via-[#125ec9] to-[#0A3D85] text-white p-8 sm:p-14 overflow-hidden shadow-2xl">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-3 max-w-2xl text-left">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-bold tracking-widest uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                  <span>CUSTOMIZED PROFILE ADVISORY</span>
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                  Get Matched to Your Ideal Country
                </h2>
                <p className="text-blue-100 text-sm sm:text-base leading-relaxed max-w-xl">
                  Book a free evaluation session. Our authorized counselors evaluate your academic scores, budget, and long-term career aspirations.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  onClick={() => {
                    setSelectedDestination('Canada');
                    setIsConsultationModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm sm:text-base shadow-xl hover:shadow-2xl transition-all cursor-pointer group"
                >
                  <span>Book Free Consultation</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ConsultationModal
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
        initialDestination={selectedDestination}
        onSubmit={(data) => {
          console.log('Consultation requested from Destinations Listing:', data);
        }}
      />

    </div>
  );
}
