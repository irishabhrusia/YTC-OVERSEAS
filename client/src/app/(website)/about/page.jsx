'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Globe,
  Award,
  ShieldCheck,
  Target,
  HeartHandshake,
  Users,
  Building2,
  Briefcase,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Sparkles,
  ChevronRight,
  BadgeCheck,
  Quote,
  MapPin,
  Phone,
  Mail,
  Clock,
  ExternalLink,
  Trophy,
} from 'lucide-react';
import PageHeader from '../../component/PageHeader';
import { pageHeaders } from '../../data/pageHeaders';
import {
  aboutStats as defaultStats,
  briefHistory as defaultHistory,
  coreValues as defaultValues,
  leadershipTeam as defaultTeam,
  recognitions as defaultRecognitions,
  partnerWithUs as defaultPartners,
  offices as defaultOffices,
  accreditations as defaultAccreditations,
} from '../../data/aboutData';
import ConsultationModal from '../../component/homesection/ConsultationModal';
import { fetchAboutContent } from '../../lib/api';

const ICON_MAP = {
  ShieldCheck,
  Target,
  Award,
  HeartHandshake,
  Building2,
  Briefcase,
  Users,
};

export default function AboutPage() {
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState('Canada');
  const [dynamicAbout, setDynamicAbout] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load dynamic content from MongoDB with fallback to default data
  useEffect(() => {
    let ignore = false;
    fetchAboutContent()
      .then((data) => {
        if (!ignore && data) {
          setDynamicAbout(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Error fetching dynamic about content, using local defaults:', err);
        setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  const handleOpenConsultation = (destination = 'Canada') => {
    setSelectedDestination(destination);
    setIsConsultationModalOpen(true);
  };

  const handleCloseConsultation = () => {
    setIsConsultationModalOpen(false);
  };

  // Resolved dynamic data with safe fallbacks
  const header = {
    ...pageHeaders.about,
    ...(dynamicAbout?.header || {}),
    badge: dynamicAbout?.header?.badge || pageHeaders.about.badge,
    title: dynamicAbout?.header?.title || pageHeaders.about.title,
    description: dynamicAbout?.header?.description || pageHeaders.about.description,
    image: dynamicAbout?.header?.image || pageHeaders.about.image,
  };

  const stats = Array.isArray(dynamicAbout?.aboutStats) && dynamicAbout.aboutStats.length > 0
    ? dynamicAbout.aboutStats
    : defaultStats;

  const history = dynamicAbout?.briefHistory || defaultHistory;
  const values = Array.isArray(dynamicAbout?.coreValues) && dynamicAbout.coreValues.length > 0
    ? dynamicAbout.coreValues
    : defaultValues;

  const team = Array.isArray(dynamicAbout?.leadershipTeam) && dynamicAbout.leadershipTeam.length > 0
    ? dynamicAbout.leadershipTeam
    : defaultTeam;

  const recognitions = Array.isArray(dynamicAbout?.recognitions) && dynamicAbout.recognitions.length > 0
    ? dynamicAbout.recognitions
    : defaultRecognitions;

  const partners = dynamicAbout?.partnerWithUs || defaultPartners;

  const offices = Array.isArray(dynamicAbout?.offices) && dynamicAbout.offices.length > 0
    ? dynamicAbout.offices
    : defaultOffices;

  const accreditations = Array.isArray(dynamicAbout?.accreditations) && dynamicAbout.accreditations.length > 0
    ? dynamicAbout.accreditations
    : defaultAccreditations;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F4F8FD] via-[#EDF4FC] to-[#F1F6FD] text-slate-900 overflow-x-hidden selection:bg-blue-600 selection:text-white">
      
      {/* ── 1. Reusable PageHeader (Dynamic from MongoDB) ── */}
      <PageHeader
        variant="light"
        data={header}
        onOpenConsultation={() => handleOpenConsultation('Canada')}
      />

      {/* ── 2. Key Stats Highlights Strip (Dynamic Counters) ── */}
      <section className="py-10 bg-white/70 border-b border-slate-200/60 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-blue-300 transition-all text-center flex flex-col items-center justify-center group"
              >
                <span className="text-3xl sm:text-4xl font-black text-blue-600 group-hover:scale-105 transition-transform duration-200">
                  {stat.value}
                </span>
                <span className="text-sm sm:text-base font-bold text-slate-900 mt-1">
                  {stat.label}
                </span>
                <span className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  {stat.detail}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Brief History & Heritage Section (Dynamic Narrative) ── */}
      <section id="brief-history" className="py-12 sm:py-20 relative">
        <span id="history" className="sr-only" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Narrative Column */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-6 text-left"
            >
              <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-blue-600 uppercase">
                <Calendar className="w-3.5 h-3.5" />
                <span>{history.tag || 'OUR HERITAGE & ORIGINS'}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {history.title || 'A Decade of Uncompromising Ethics & Transformative Journeys'}
              </h2>

              <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
                {(history.paragraphs || []).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              {/* Founder Quote Card */}
              {history.quote && (
                <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-600 shadow-xs relative">
                  <Quote className="w-8 h-8 text-blue-300 absolute top-4 right-4 rotate-180 opacity-60 pointer-events-none" />
                  <p className="text-sm sm:text-base italic text-slate-800 leading-relaxed font-medium">
                    &ldquo;{history.quote.text}&rdquo;
                  </p>
                  <div className="mt-3 pt-3 border-t border-blue-200/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs">
                    <span className="font-bold text-slate-900">{history.quote.author}</span>
                    <span className="text-blue-600 font-semibold">{history.quote.designation}</span>
                  </div>
                </div>
              )}

              {/* Quality Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  'British Council & ICEF Certified Advisors',
                  'Comprehensive Profile Assessment & Shortlisting',
                  'High-Success Student & Work Visa Protocols',
                  'Pre-Departure & Post-Arrival Settlement Aid',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-sm font-semibold text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Milestones Mini-Timeline Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5 relative"
            >
              <div className="bg-white rounded-3xl p-7 sm:p-8 border border-slate-200/90 shadow-xl space-y-6">
                <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">Key Evolution Milestones</h3>
                    <p className="text-xs text-slate-500">How we grew into a global mobility leader</p>
                  </div>
                </div>

                <div className="space-y-5 relative before:absolute before:inset-0 before:left-3 before:h-full before:w-0.5 before:bg-blue-100">
                  {(history.highlights || []).map((h, idx) => (
                    <div key={idx} className="relative flex items-start gap-4 pl-8 group">
                      <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white border-4 border-blue-600 shadow-xs group-hover:scale-125 transition-transform" />
                      <div>
                        <span className="inline-block px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-700 text-xs font-black">
                          {h.year}
                        </span>
                        <p className="text-xs sm:text-sm font-medium text-slate-700 mt-1 leading-snug">
                          {h.label}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="relative rounded-2xl overflow-hidden aspect-[16/9] mt-6 border border-slate-100">
                  <img
                    src={header.image || '/images/why-choose-student.jpg'}
                    alt="YTC Global Education students"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2.5 left-2.5 bg-white/95 backdrop-blur-md px-3 py-1 rounded-lg text-[11px] font-bold text-blue-700 shadow-md">
                    10+ Years of Transforming Lives
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── 4. Mission & Vision Dual Cards ── */}
      <section id="mission-vision" className="py-16 sm:py-20 bg-gradient-to-b from-[#EDF4FC] via-[#F4F8FD] to-[#E9F2FC] relative overflow-hidden border-y border-blue-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold tracking-wider text-blue-600 uppercase block mb-1">
              OUR PURPOSE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Mission & Vision Driving Every Action
            </h2>
            <p className="text-slate-500 text-sm sm:text-base mt-2">
              Our north star is creating genuine impact in students&apos; lives and shaping future global leaders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -6 }}
              className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-md hover:shadow-2xl hover:border-blue-400 transition-all flex flex-col justify-between relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-36 h-36 bg-blue-50 rounded-bl-full -z-0 group-hover:scale-110 transition-transform duration-300" />
              <div className="relative z-10 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25">
                  <Target className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                  Our Mission
                </h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  To eliminate the stress, misinformation, and ambiguity surrounding international education and workforce migration. We are dedicated to providing ethical, transparent, and merit-aligned admissions and visa guidance so every candidate can maximize their global potential.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-blue-600">
                <span>Merit-Driven · Ethical · Compassionate</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -6 }}
              className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-md hover:shadow-2xl hover:border-indigo-400 transition-all flex flex-col justify-between relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-50 rounded-bl-full -z-0 group-hover:scale-110 transition-transform duration-300" />
              <div className="relative z-10 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/25">
                  <Globe className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Our Vision
                </h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  To be South Asia&apos;s most dependable and comprehensive global mobility platform, recognized internationally for establishing the highest standards of integrity, institutional trust, and transformative student outcomes.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-indigo-600">
                <span>Global Reach · Enduring Impact · Lifelong Alumni</span>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* ── 5. Core Values (Dynamic Principles) ── */}
      <section id="core-values" className="py-16 sm:py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold tracking-wider text-blue-600 uppercase block mb-1">
              THE PILLARS OF YTC
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Our Core Values
            </h2>
            <p className="text-slate-500 text-sm sm:text-base mt-2">
              Every counsel session, document check, and university correspondence is anchored in our four core principles.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val, idx) => {
              const IconComp = ICON_MAP[val.icon] || ShieldCheck;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: idx * 0.08 }}
                  whileHover={{ y: -8 }}
                  className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all flex flex-col justify-between group cursor-default"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-xs">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                      {val.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 mt-2.5 leading-relaxed">
                      {val.desc}
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs font-semibold text-blue-600">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Quality Guaranteed</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ── 6. Our Leadership Team (Dynamic Profiles & Images) ── */}
      <section id="our-leadership" className="py-16 sm:py-24 bg-gradient-to-b from-[#F3F7FD] via-[#EEF5FD] to-[#F0F6FD] border-t border-blue-100/50 relative">
        <span id="leadership" className="sr-only" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
            <div>
              <span className="text-xs font-bold tracking-wider text-blue-600 uppercase block mb-1">
                EXPERT LEADERSHIP
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Meet Our Leadership Team
              </h2>
              <p className="text-slate-500 text-sm sm:text-base mt-1.5 max-w-xl">
                Decades of combined experience in global higher-ed admissions, embassy visa compliance, and overseas workforce deployment.
              </p>
            </div>
            <button
              onClick={() => handleOpenConsultation('Canada')}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 transition-all self-start sm:self-auto group cursor-pointer"
            >
              <span>Schedule 1-on-1 Advisory</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ y: -8 }}
                className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-2xl hover:border-blue-400 transition-all duration-300 flex flex-col"
              >
                <div className="relative h-64 w-full overflow-hidden bg-slate-100">
                  <img
                    src={member.image || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'}
                    alt={member.name}
                    className="w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
                  
                  {member.specialty && (
                    <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md text-[10px] font-bold text-blue-700 px-3 py-1 rounded-full shadow-md">
                      {member.specialty}
                    </div>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-1 justify-between bg-white">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-xs font-semibold text-blue-600 mt-0.5">
                      {member.role}
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium mt-1">
                      {member.experience}
                    </p>
                    <p className="text-xs text-slate-500 mt-2.5 leading-relaxed line-clamp-3">
                      {member.bio}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600">
                    <span className="text-blue-600">Verified Leader</span>
                    <BadgeCheck className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ── 7. Recognitions & Awards (Dynamic Accolades) ── */}
      <section id="recognitions" className="py-16 sm:py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-blue-600 uppercase mb-1">
              <Trophy className="w-3.5 h-3.5" />
              <span>INDUSTRY RECOGNITION</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Awards & Verified Accolades
            </h2>
            <p className="text-slate-500 text-sm sm:text-base mt-2">
              Recognized internationally for exceptional visa outcomes, counseling ethics, and university partnership standards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recognitions.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                whileHover={{ y: -6 }}
                className="p-6 rounded-2xl bg-gradient-to-b from-white to-blue-50/40 border border-slate-200/90 hover:border-blue-400 hover:shadow-xl transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-700">
                      {item.badge}
                    </span>
                    <span className="text-xs font-bold text-slate-400">{item.year}</span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs font-semibold text-blue-600 mt-1">
                    {item.issuedBy}
                  </p>

                  <p className="text-xs text-slate-500 mt-2.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200/60 flex items-center gap-1.5 text-[11px] font-bold text-slate-600">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span>Verified Credential</span>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ── 8. Partner With Us (Dynamic Collaborations) ── */}
      <section id="partner-with-us" className="py-16 sm:py-24 bg-gradient-to-b from-[#EDF4FC] via-[#F4F8FD] to-[#E9F2FC] relative overflow-hidden border-y border-blue-100/60">
        <span id="partner" className="sr-only" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold tracking-wider text-blue-600 uppercase block mb-1">
              {partners.tag || 'GLOBAL COLLABORATIONS'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {partners.title || 'Partner With YTC Global Education'}
            </h2>
            <p className="text-slate-500 text-sm sm:text-base mt-2">
              {partners.subtitle || 'Cultivating mutually prosperous global partnerships across universities, employers, and affiliates.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {(partners.categories || []).map((cat, idx) => {
              const IconComp = ICON_MAP[cat.icon] || Building2;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-3xl p-7 sm:p-8 border border-slate-200/90 shadow-md hover:shadow-2xl hover:border-blue-400 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-xs">
                      <IconComp className="w-6 h-6" />
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {cat.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                      {cat.description}
                    </p>

                    <div className="pt-2 space-y-2">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Key Advantages
                      </p>
                      {(cat.perks || []).map((perk, pi) => (
                        <div key={pi} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                          <span className="leading-snug">{perk}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100">
                    <Link
                      href="/contact"
                      className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-50 group-hover:bg-blue-600 text-blue-700 group-hover:text-white text-xs sm:text-sm font-bold transition-all shadow-xs"
                    >
                      <span>{cat.ctaText || 'Learn More'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ── 9. Our Global Offices Section (Dynamic Locations) ── */}
      <section id="our-offices" className="py-16 sm:py-24 bg-white relative">
        <span id="offices" className="sr-only" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
            <div>
              <span className="text-xs font-bold tracking-wider text-blue-600 uppercase block mb-1">
                WORLDWIDE PRESENCE
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Our Global Offices
              </h2>
              <p className="text-slate-500 text-sm sm:text-base mt-1.5 max-w-xl">
                Visit our physical counseling lounges and international student support desks across the globe.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 transition-all self-start sm:self-auto group"
            >
              <span>View Full Contact Directory</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {offices.map((office, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ y: -8 }}
                className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-2xl hover:border-blue-400 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                    <img
                      src={office.image || 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=500&q=80'}
                      alt={`${office.city} Office - YTC Global Education`}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    {office.badge && (
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-[10px] font-bold text-slate-800 px-2.5 py-0.5 rounded-full shadow-md">
                        {office.badge}
                      </div>
                    )}

                    <div className="absolute bottom-3 left-3 text-white">
                      <p className="text-lg font-black leading-tight">{office.city}</p>
                      <p className="text-xs text-blue-200 font-medium">{office.country}</p>
                    </div>
                  </div>

                  <div className="p-5 space-y-3.5 text-xs text-slate-600">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span className="leading-snug text-slate-800 font-medium">{office.address}</span>
                    </div>

                    {office.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                        <a href={`tel:${office.phone}`} className="hover:text-blue-600 transition-colors font-medium">
                          {office.phone}
                        </a>
                      </div>
                    )}

                    {office.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                        <a href={`mailto:${office.email}`} className="hover:text-blue-600 transition-colors font-medium truncate">
                          {office.email}
                        </a>
                      </div>
                    )}

                    {office.timing && (
                      <div className="flex items-center gap-2 text-slate-500">
                        <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>{office.timing}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(office.mapQuery || office.address || office.city)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-50 hover:bg-blue-600 hover:text-white text-slate-700 text-xs font-bold transition-all"
                  >
                    <span>Get Directions</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ── 10. Accreditations & Certifications Strip (Dynamic Badges) ── */}
      <section className="py-14 bg-gradient-to-b from-[#F4F8FD] to-[#EDF4FC] border-y border-blue-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
            OFFICIAL CERTIFICATIONS & ACCREDITATIONS
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
            {accreditations.map((acc, i) => (
              <div
                key={i}
                className="px-4 py-2.5 bg-white rounded-xl border border-slate-200/90 shadow-xs flex items-center gap-2 text-xs font-bold text-slate-700 hover:border-blue-400 hover:text-blue-600 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span>{acc.name}</span>
                <span className="ml-1 text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                  {acc.badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 11. Final Call To Action Banner ── */}
      <section className="py-16 sm:py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl bg-gradient-to-r from-[#0E4DA4] via-[#125ec9] to-[#0A3D85] text-white p-8 sm:p-14 overflow-hidden shadow-2xl"
          >
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-3 max-w-2xl text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-blue-200 text-xs font-bold tracking-widest uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                  <span>START YOUR GLOBAL JOURNEY</span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                  Ready to Turn Your Dream Into Reality?
                </h2>
                <p className="text-blue-100 text-sm sm:text-base leading-relaxed max-w-xl">
                  Book a free one-on-one session with our senior education counselors or connect with our international corporate team today.
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
                  <span>Contact Our Office</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 12. Consultation Modal Integration ── */}
      <ConsultationModal
        isOpen={isConsultationModalOpen}
        onClose={handleCloseConsultation}
        initialDestination={selectedDestination}
        onSubmit={(data) => {
          console.log('Consultation requested from About page:', data);
        }}
      />

    </div>
  );
}
