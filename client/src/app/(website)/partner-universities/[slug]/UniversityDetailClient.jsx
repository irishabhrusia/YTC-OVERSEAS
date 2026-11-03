'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  MapPin,
  Award,
  Globe,
  ExternalLink,
  Calendar,
  DollarSign,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  Send,
  Building2,
} from 'lucide-react';
import ConsultationModal from '../../../component/homesection/ConsultationModal';

export default function UniversityDetailClient({ university, relatedUniversities = [] }) {
  const [modalOpen, setModalOpen] = useState(false);

  const country = university.country || {};
  const countryName = country.name || 'International';
  const countrySlug = country.slug || 'usa';
  const flag = country.flag || '🎓';

  const tuitionDisplay = university.tuitionFrom
    ? university.tuitionTo && university.tuitionTo > university.tuitionFrom
      ? `$${university.tuitionFrom.toLocaleString()} - $${university.tuitionTo.toLocaleString()} / Year`
      : `$${university.tuitionFrom.toLocaleString()} / Year`
    : 'Varies by Program';

  const intakesList = Array.isArray(university.intakes) && university.intakes.length > 0
    ? university.intakes
    : ['Fall (September)', 'Spring (January)'];

  const popularCourses = Array.isArray(university.popularCourses) && university.popularCourses.length > 0
    ? university.popularCourses
    : ['Computer Science & AI', 'Business Administration', 'Engineering', 'Health Sciences', 'Data Analytics'];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* ── Breadcrumb Bar ── */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <Link href="/partner-universities" className="hover:text-blue-600 transition-colors">
              Partner Universities
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <Link href={`/study-abroad/${countrySlug}`} className="hover:text-blue-600 transition-colors">
              {countryName}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-900 font-bold truncate">{university.name}</span>
          </div>
        </div>
      </div>

      {/* ── Hero Campus Banner ── */}
      <div className="relative bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white overflow-hidden">
        {university.image && (
          <div className="absolute inset-0 z-0 opacity-25">
            <img
              src={university.image}
              alt={university.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent" />
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 sm:pt-14 sm:pb-16 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4 sm:gap-5">
              {/* University Logo / Photo */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white p-2 shadow-xl border border-white/20 shrink-0 flex items-center justify-center overflow-hidden">
                {university.logo || university.image ? (
                  <img
                    src={university.logo || university.image}
                    alt={`${university.name} Logo`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full rounded-xl bg-blue-50 text-blue-600 font-black text-2xl flex items-center justify-center">
                    {university.name.split(' ').slice(0, 2).map((w) => w[0]).join('')}
                  </div>
                )}
              </div>

              {/* Title & Meta */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/study-abroad/${countrySlug}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white transition-all backdrop-blur-xs"
                  >
                    <span>{flag}</span>
                    <span>{countryName}</span>
                  </Link>

                  {university.ranking && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-extrabold backdrop-blur-xs">
                      <Award className="w-3.5 h-3.5" />
                      <span>QS #{university.ranking}</span>
                    </span>
                  )}

                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-400/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold backdrop-blur-xs">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Direct Articulation Partner</span>
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  {university.name}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300 pt-0.5">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>
                      {[university.city, countryName].filter(Boolean).join(', ')}
                    </span>
                  </div>

                  {university.website && (
                    <a
                      href={university.website.startsWith('http') ? university.website : `https://${university.website}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 underline underline-offset-4 font-semibold"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Official Website</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Top Action CTAs */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full md:w-auto shrink-0 pt-2 md:pt-0">
              <button
                onClick={() => setModalOpen(true)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Apply Through YTC Global</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Detail Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (8 cols): Key Facts, Overview, Courses */}
          <div className="lg:col-span-8 space-y-6">

            {/* Quick Facts Card Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Average Tuition
                </span>
                <span className="text-sm sm:text-base font-extrabold text-blue-700 block">
                  {tuitionDisplay}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">Undergraduate / Postgrad</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Global Ranking
                </span>
                <span className="text-sm sm:text-base font-extrabold text-slate-900 block">
                  {university.ranking ? `#${university.ranking}` : 'Top Tier'}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">QS World Ranking</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Major Intakes
                </span>
                <span className="text-sm sm:text-base font-extrabold text-emerald-700 block truncate">
                  {intakesList[0] || 'Fall / Spring'}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">Upcoming Admissions</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Campus Location
                </span>
                <span className="text-sm sm:text-base font-extrabold text-slate-900 block truncate">
                  {university.city || countryName}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">{countryName}</span>
              </div>
            </div>

            {/* About Institution Card */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
                <Building2 className="w-4 h-4" />
                <span>Institutional Profile</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                About {university.name}
              </h2>
              <div className="text-slate-600 text-sm leading-relaxed space-y-3">
                <p>
                  {university.description ||
                    `${university.name} is a premier accredited institution situated in ${university.city ? `${university.city}, ` : ''}${countryName}. Recognized for academic excellence and high graduate employability, it hosts a vibrant international student community from over 80 nations worldwide.`}
                </p>
                <p>
                  As an official articulated partner, YTC Global Education students benefit from priority application evaluations, dedicated scholarship assessment, and pre-arrival housing facilitation.
                </p>
              </div>

              {/* Verified Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Accredited Degree Programs</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Post-Study Work Visa Pathways</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>International Student Scholarships</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Campus Accommodation Guarantee</span>
                </div>
              </div>
            </div>

            {/* Popular Majors & Programs */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
                <BookOpen className="w-4 h-4" />
                <span>Featured Academic Streams</span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">
                Popular Programs &amp; Degrees
              </h3>
              <p className="text-xs text-slate-500">
                Our advisors assist with direct course shortlisting, syllabus matching, and prerequisite assessments:
              </p>

              <div className="flex flex-wrap gap-2.5 pt-1">
                {popularCourses.map((course, idx) => (
                  <span
                    key={idx}
                    className="px-3.5 py-2 rounded-xl bg-blue-50/70 border border-blue-200/80 text-blue-800 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>{course}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Admission Intakes & Deadlines */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
                <Calendar className="w-4 h-4" />
                <span>Intake Calendars</span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">
                Admission Deadlines &amp; Semesters
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {intakesList.map((intake, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                    <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">{intake} Intake</span>
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        Applications open 6-9 months prior. Contact YTC counselors for priority SOP reviews.
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column (4 cols): Sticky Application Card & Counseling */}
          <div className="lg:col-span-4 space-y-6">

            {/* Application Fast-Track Card */}
            <div className="bg-white p-6 rounded-2xl border-2 border-blue-600 shadow-xl space-y-5 sticky top-24">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-extrabold uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Zero Application Fees Guidance</span>
              </div>

              <div>
                <h4 className="text-lg font-black text-slate-900">
                  Ready to apply to {university.name}?
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Get personalized eligibility review, scholarship matching, and visa filing support from certified counselors.
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Free Profile &amp; GPA Evaluation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Scholarship &amp; Financial Aid Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Official SOP &amp; Recommendation Letter Review</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Guaranteed Visa Mock Interviews</span>
                </div>
              </div>

              <button
                onClick={() => setModalOpen(true)}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Book Free University Counseling</span>
              </button>

              <div className="text-center">
                <Link
                  href={`/study-abroad/${countrySlug}`}
                  className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  <span>Explore {countryName} Study Guide</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Sibling Related Universities in Same Country */}
            {relatedUniversities.length > 0 && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
                <h4 className="text-sm font-extrabold text-slate-900">
                  Other Partner Universities in {countryName}
                </h4>

                <div className="space-y-3">
                  {relatedUniversities.map((rel) => (
                    <Link
                      key={rel._id || rel.slug}
                      href={`/partner-universities/${rel.slug}`}
                      className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200/80 hover:border-blue-300 transition-all block group"
                    >
                      <span className="font-bold text-xs text-slate-800 group-hover:text-blue-600 transition-colors block">
                        {rel.name}
                      </span>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        {rel.city ? `${rel.city} • ` : ''}QS {rel.ranking ? `#${rel.ranking}` : '#—'}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* ── Consultation Modal ── */}
      <ConsultationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialDestination={countryName}
      />
    </div>
  );
}

