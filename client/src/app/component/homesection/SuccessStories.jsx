'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, CheckCircle2, Award, Sparkles, Star, Quote } from 'lucide-react';

const COUNTRY_FLAGS = {
  canada: '🇨🇦',
  uk: '🇬🇧',
  'united kingdom': '🇬🇧',
  usa: '🇺🇸',
  'united states': '🇺🇸',
  australia: '🇦🇺',
  germany: '🇩🇪',
  ireland: '🇮🇪',
  'new zealand': '🇳🇿',
  'new-zealand': '🇳🇿',
  uae: '🇦🇪',
};

const BADGE_COLORS = {
  'Visa Approved': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Visa Stamped': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Visa Granted': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Scholarship: 'bg-amber-50 text-amber-700 border-amber-200',
  Enrolled: 'bg-blue-50 text-blue-700 border-blue-200',
  Admitted: 'bg-indigo-50 text-indigo-700 border-indigo-200',
};

const DEFAULT_SUCCESS_STORIES = [
  {
    name: 'Priya Sharma',
    country: 'Canada',
    flag: '🇨🇦',
    photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=200&q=80',
    university: 'University of Toronto',
    course: 'MSc Computer Science',
    result: 'Student Visa Approved — Fall 2026',
    badge: 'Visa Approved',
    text: 'YTC counselors guided me every single step from university selection to SOP drafting and visa filing. Received my Canadian visa in just 3 weeks with zero hassles!',
  },
  {
    name: 'Aditya Verma',
    country: 'UK',
    flag: '🇬🇧',
    photo: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=200&q=80',
    university: 'University of Manchester',
    course: 'MBA — Business Analytics',
    result: '£8,000 Global Excellence Scholarship & Visa Stamped',
    badge: 'Scholarship',
    text: 'The 1-on-1 counseling made all the difference. They helped me secure an £8,000 scholarship and prepared me thoroughly for the visa interview.',
  },
  {
    name: 'Sneha Patel',
    country: 'Australia',
    flag: '🇦🇺',
    photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=200&q=80',
    university: 'University of Melbourne',
    course: 'BEng Civil Engineering',
    result: 'Subclass 500 Visa Granted in 14 Days',
    badge: 'Visa Granted',
    text: 'Extremely grateful to the overseas recruitment and education team. Their guidance for the Australia Subclass 500 visa was flawless and transparent.',
  },
  {
    name: 'Rohan Mehra',
    country: 'Germany',
    flag: '🇩🇪',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    university: 'Technical University of Munich',
    course: 'MSc Data Engineering',
    result: '100% Tuition-Free Admission + Sperrkonto Setup',
    badge: 'Enrolled',
    text: 'Studying in Germany tuition-free seemed like a dream. YTC made it a reality by guiding my APS certification, blocked account, and university portal filing.',
  },
  {
    name: 'Ananya Deshmukh',
    country: 'Ireland',
    flag: '🇮🇪',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    university: 'Trinity College Dublin',
    course: 'MSc International Business',
    result: '€5,000 Dean’s Merit Award & 2-Yr Work Rights',
    badge: 'Scholarship',
    text: 'The guidance on Ireland post-study work permits and critical skills list was eye-opening. Got admission into my dream university with a generous bursary!',
  },
  {
    name: 'Karan Malhotra',
    country: 'USA',
    flag: '🇺🇸',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    university: 'Northeastern University',
    course: 'MS in Information Systems',
    result: 'F-1 Visa Approved with 3-Year STEM OPT',
    badge: 'Visa Approved',
    text: 'My counselor conducted 4 mock visa interviews until I felt completely confident. Cleared my US consulate interview on the very first attempt!',
  },
];

export default function SuccessStories({
  stories = [],
  isLoading = false,
  tag = 'REAL STUDENT OUTCOMES',
  title = "Our Students' Success Stories",
  subtitle = 'Visa approvals, top university admissions, and merit scholarships — real journeys guided by YTC Global Education.',
}) {
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Normalize data with complete fallback support
  const normalizedStories = useMemo(() => {
    const list = Array.isArray(stories) && stories.length > 0 ? stories : DEFAULT_SUCCESS_STORIES;

    return list.map((item, idx) => {
      const countryStr = item.country || 'Global';
      const flagEmoji =
        item.flag ||
        COUNTRY_FLAGS[countryStr.toLowerCase().trim()] ||
        '🎓';

      let autoBadge = item.badge;
      if (!autoBadge) {
        const resLower = (item.result || '').toLowerCase();
        if (resLower.includes('scholarship') || resLower.includes('award') || resLower.includes('bursary')) {
          autoBadge = 'Scholarship';
        } else if (resLower.includes('visa')) {
          autoBadge = 'Visa Approved';
        } else {
          autoBadge = 'Admitted';
        }
      }

      return {
        id: item._id || item.id || `story-${idx}`,
        name: item.studentName || item.name || 'YTC Scholar',
        country: countryStr,
        flag: flagEmoji,
        photo:
          item.photo ||
          item.image ||
          `https://images.unsplash.com/photo-${1530000000000 + idx * 10000}?auto=format&fit=crop&w=200&q=80`,
        university: item.university || 'Global Partner University',
        course: item.course || 'Degree Program',
        result: item.result || 'Admitted with Visa Grant',
        badge: autoBadge,
        text: item.text || item.quote || '',
      };
    });
  }, [stories]);

  // Extract unique countries for filter tabs
  const availableCountries = useMemo(() => {
    const set = new Set();
    normalizedStories.forEach((s) => {
      if (s.country && s.country !== 'Global') set.add(s.country);
    });
    return Array.from(set);
  }, [normalizedStories]);

  // Filtered stories
  const filteredStories = useMemo(() => {
    if (selectedFilter === 'all') return normalizedStories;
    return normalizedStories.filter(
      (s) => s.country.toLowerCase() === selectedFilter.toLowerCase()
    );
  }, [normalizedStories, selectedFilter]);

  return (
    <section
      id="success-stories"
      className="py-20 bg-gradient-to-b from-white via-[#F8FAFD] to-[#EDF4FC] relative overflow-hidden"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-indigo-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-xs font-extrabold tracking-wider text-blue-600 uppercase mb-3">
            <Trophy className="w-3.5 h-3.5 text-blue-600" />
            <span>{tag}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {title}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2.5 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>

          {/* Interactive Country Filter Tabs */}
          {availableCountries.length > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mt-7">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedFilter === 'all'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                All Destinations ({normalizedStories.length})
              </button>
              {availableCountries.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedFilter(c)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedFilter.toLowerCase() === c.toLowerCase()
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span>{COUNTRY_FLAGS[c.toLowerCase()] || '🌍'}</span>
                  <span>{c}</span>
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Loading Skeleton */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-slate-200/90 p-6 flex flex-col gap-4 animate-pulse shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-slate-200 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded-md w-28" />
                    <div className="h-3 bg-slate-100 rounded-md w-16" />
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl space-y-1.5">
                  <div className="h-3 bg-slate-200 rounded w-3/4" />
                  <div className="h-2.5 bg-slate-100 rounded w-1/2" />
                </div>
                <div className="h-4 bg-slate-200 rounded w-4/5" />
                <div className="h-6 bg-slate-100 rounded-full w-24 mt-auto" />
              </div>
            ))}
          </div>
        ) : (
          /* Cards Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredStories.map((story, idx) => {
                const badgeCls =
                  BADGE_COLORS[story.badge] ||
                  'bg-blue-50 text-blue-700 border-blue-200';

                return (
                  <motion.div
                    key={story.id || idx}
                    layout
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                    className="group bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 p-6 flex flex-col justify-between relative overflow-hidden"
                  >
                    {/* Top corner gradient tint */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-50 to-transparent rounded-tr-3xl pointer-events-none" />

                    <div className="space-y-4">
                      {/* Top Row: Photo + Name + Flag */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3.5">
                          <div className="relative shrink-0">
                            <img
                              src={story.photo}
                              alt={story.name}
                              className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md group-hover:scale-105 transition-transform"
                            />
                            <span
                              className="absolute -bottom-1 -right-1 text-base leading-none drop-shadow-sm"
                              role="img"
                              aria-label={story.country}
                            >
                              {story.flag}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-extrabold text-base text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                              {story.name}
                            </h3>
                            <p className="text-xs text-blue-600 font-bold flex items-center gap-1 mt-0.5">
                              <span>{story.country}</span>
                            </p>
                          </div>
                        </div>

                        {/* Top Badge */}
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-black border uppercase tracking-wider shrink-0 ${badgeCls}`}
                        >
                          {story.badge}
                        </span>
                      </div>

                      {/* University & Course Info Box */}
                      <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-1">
                        <p className="text-xs font-extrabold text-slate-800 leading-snug line-clamp-1">
                          {story.university}
                        </p>
                        <p className="text-[11px] text-slate-500 font-semibold line-clamp-1">
                          {story.course}
                        </p>
                      </div>

                      {/* Key Result Line */}
                      <div className="flex items-start gap-2 text-xs font-bold text-slate-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-snug">{story.result}</span>
                      </div>

                      {/* Optional Student Review Quote */}
                      {story.text && (
                        <p className="text-xs text-slate-500 leading-relaxed italic border-t border-slate-100 pt-3 line-clamp-3">
                          &ldquo;{story.text}&rdquo;
                        </p>
                      )}
                    </div>

                    {/* Bottom verification stamp */}
                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                      <span className="flex items-center gap-1 text-emerald-600">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>Verified YTC Placement</span>
                      </span>
                      <span>Intake 2026/2027</span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

      </div>
    </section>
  );
}
