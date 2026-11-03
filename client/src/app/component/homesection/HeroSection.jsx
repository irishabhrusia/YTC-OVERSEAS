'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  ArrowRight,
  Users,
  Building2,
  Globe,
  Star,
  Plane,
  Sparkles,
  Award,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

const ICON_MAP = {
  users: Users,
  building: Building2,
  globe: Globe,
  award: Award,
  shield: ShieldCheck,
  graduation: GraduationCap,
};

export default function HeroSection({
  data = {},
  onOpenConsultation,
  isPreview = false,
}) {
  const {
    tag = 'Study Abroad Consultancy',
    badgeText = 'Admissions Open 2026-2027',
    headline = {
      line1: 'Your Dream to Study',
      line2: 'Abroad, ',
      highlight: 'Our Priority',
    },
    description = 'YTC Global Education helps you explore overseas education opportunities, find top-ranked universities, and build a brighter future with expert guidance at every step.',
    primaryBtnText = 'Start Your Journey',
    primaryBtnAction = 'consultation',
    secondaryBtnText = 'Explore Universities',
    secondaryBtnLink = '/destinations',
    stats = [
      { label: 'Happy Students', value: '10K+', iconType: 'users' },
      { label: 'Partner Universities', value: '50+', iconType: 'building' },
      { label: 'Countries', value: '15+', iconType: 'globe' },
    ],
    heroImage = '/images/hero-student.jpg',
    reviewCardText = 'Better Education Brighter Future ✨',
    reviewCardStars = 5,
    achievementBadgeTitle = '99% Visa Success',
    achievementBadgeSub = 'Certified Counselors',
    brandBadgeText = 'YTC GLOBAL',
  } = data;

  const handlePrimaryClick = () => {
    if (primaryBtnAction === 'consultation' || !primaryBtnAction) {
      onOpenConsultation?.();
    }
  };

  return (
    <section
      className={`relative bg-gradient-to-br from-[#0c3ec7] via-[#1354ea] to-[#0a2f96] text-white overflow-hidden ${
        isPreview
          ? 'py-8 rounded-2xl shadow-xl'
          : 'pt-10 pb-28 sm:pb-36 lg:pt-14 lg:pb-40'
      }`}
    >
      {/* ── Background Architectural Dome Blueprint Silhouette ── */}
      <div className="absolute inset-0 pointer-events-none select-none opacity-10 flex items-center justify-end overflow-hidden">
        <svg
          className="w-[700px] lg:w-[950px] h-auto text-white fill-none stroke-current"
          viewBox="0 0 800 500"
          strokeWidth="1.2"
        >
          <path d="M400,100 C320,100 280,220 280,340 L520,340 C520,220 480,100 400,100 Z" />
          <path d="M400,30 L400,100" />
          <circle cx="400" cy="25" r="8" />
          <path d="M340,340 L340,180 C360,150 440,150 460,180 L460,340" />
          <path d="M370,340 L370,220 C380,200 420,200 430,220 L430,340" />
          <line x1="200" y1="200" x2="200" y2="400" />
          <line x1="240" y1="180" x2="240" y2="400" />
          <line x1="560" y1="180" x2="560" y2="400" />
          <line x1="600" y1="200" x2="600" y2="400" />
          <polygon points="200,200 220,120 240,180" />
          <polygon points="560,180 580,120 600,200" />
          <path d="M150,400 L650,400" />
          <path d="M160,400 C160,360 200,360 200,400" />
          <path d="M210,400 C210,360 250,360 250,400" />
          <path d="M260,400 C260,360 300,360 300,400" />
          <path d="M500,400 C500,360 540,360 540,400" />
          <path d="M550,400 C550,360 590,360 590,400" />
          <path d="M600,400 C600,360 640,360 640,400" />
        </svg>
      </div>

      {/* ── Dynamic Glowing Atmospheric Orbs ── */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.25, 0.45, 0.25],
        }}
        transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
        className="absolute -top-32 -right-32 w-[550px] h-[550px] rounded-full bg-cyan-400 blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{ repeat: Infinity, duration: 11, ease: 'easeInOut', delay: 1 }}
        className="absolute top-1/3 -left-32 w-[500px] h-[500px] rounded-full bg-blue-300 blur-3xl pointer-events-none"
      />

      <div className={`relative z-10 ${isPreview ? 'p-3 sm:p-5 max-w-full' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}`}>
        <div className={`grid grid-cols-1 ${isPreview ? 'lg:grid-cols-12 gap-4 lg:gap-5' : 'lg:grid-cols-12 gap-10 lg:gap-8'} items-center`}>

          {/* ════════ Left Content Column ════════ */}
          <div className={`${isPreview ? 'lg:col-span-7 space-y-4' : 'lg:col-span-7 space-y-6'} text-left`}>

            {/* Category Pill with Glowing Live Pulse */}
            <motion.div
              initial={isPreview ? false : { opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="inline-flex flex-wrap items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/15 border border-white/25 backdrop-blur-md text-white text-xs sm:text-sm font-semibold tracking-wide shadow-md"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-300 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400" />
              </span>
              <span>{tag}</span>
              {badgeText && (
                <>
                  <span className="text-white/40">•</span>
                  <span className="text-cyan-200 font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                    <span>{badgeText}</span>
                  </span>
                </>
              )}
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={isPreview ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1, ease: 'easeOut' }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12]"
            >
              {headline.line1} <br className="hidden sm:inline" />
              <span>{headline.line2} </span>
              <span className="relative inline-block text-white">
                <span className="bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
                  {headline.highlight}
                </span>
                {/* Hand-drawn Underline Graphic */}
                <motion.svg
                  initial={isPreview ? false : { pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.9, delay: 0.5, ease: 'easeInOut' }}
                  className="absolute -bottom-2.5 left-0 w-full h-3.5 text-cyan-300"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 6 Q 50 14, 100 6"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                  />
                </motion.svg>
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={isPreview ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-blue-100/90 text-sm sm:text-base lg:text-lg max-w-xl leading-relaxed font-normal"
            >
              {description}
            </motion.p>

            {/* Action CTA Buttons */}
            <motion.div
              initial={isPreview ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 pt-1"
            >
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={handlePrimaryClick}
                className="relative overflow-hidden inline-flex items-center gap-2.5 px-8 py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-[#FF7A18] via-[#FF6000] to-[#FF4500] hover:from-[#ff882b] hover:to-[#ff5c14] text-white font-bold text-sm sm:text-base shadow-xl shadow-orange-600/35 transition-all duration-300 cursor-pointer group"
              >
                {/* Continuous Shimmer Light Sheen */}
                <motion.div
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                  className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12 pointer-events-none"
                />
                <span className="relative z-10">{primaryBtnText}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5 relative z-10" />
              </motion.button>

              <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}>
                <Link
                  href={secondaryBtnLink || '/destinations'}
                  className="inline-flex items-center gap-2 px-7 py-3.5 sm:py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm sm:text-base border border-white/30 backdrop-blur-md shadow-sm transition-all duration-300"
                >
                  {secondaryBtnText}
                </Link>
              </motion.div>
            </motion.div>

            {/* Stats Counters: Modern Glassmorphic Cards */}
            <motion.div
              initial={isPreview ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className={`pt-5 sm:pt-7 border-t border-white/20 grid grid-cols-3 ${
                isPreview ? 'gap-2 max-w-full' : 'gap-3 sm:gap-3.5 max-w-2xl'
              } w-full`}
            >
              {stats.map((stat, idx) => {
                const StatIcon = ICON_MAP[stat.iconType] || ICON_MAP.users;
                return (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.03, y: -2 }}
                    className={`rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 cursor-default shadow-lg min-w-0 flex flex-col justify-between transition-all ${
                      isPreview
                        ? 'p-2.5 sm:p-3 min-h-[96px]'
                        : 'p-3.5 sm:p-4 min-h-[104px]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1.5 w-full">
                      <div className={`${isPreview ? 'text-base sm:text-lg' : 'text-xl sm:text-2xl'} font-black text-white leading-none tracking-tight whitespace-nowrap`}>
                        {stat.value}
                      </div>
                      <div className={`${isPreview ? 'w-6 h-6' : 'w-7 h-7 sm:w-8 sm:h-8'} rounded-lg sm:rounded-xl bg-white/15 flex items-center justify-center text-cyan-300 shrink-0 shadow-xs border border-white/10`}>
                        <StatIcon className={`${isPreview ? 'w-3 h-3' : 'w-3.5 h-3.5 sm:w-4 sm:h-4'}`} />
                      </div>
                    </div>
                    <div className={`${isPreview ? 'text-[11px] leading-snug mt-1.5' : 'text-xs text-blue-100/90 font-medium leading-snug mt-2'} text-blue-100/90 font-medium break-normal`}>
                      {stat.label}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

          </div>

          {/* ════════ Right Graphic Column ════════ */}
          <motion.div
            initial={isPreview ? false : { opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.25, ease: 'easeOut' }}
            className="lg:col-span-5 relative flex items-center justify-center"
          >
            <div className="relative w-full max-w-md sm:max-w-lg aspect-[4/4.3] flex items-end justify-center">

              {/* Glowing Aura Behind Student Container */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.35, 0.55, 0.35],
                }}
                transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
                className="absolute inset-4 rounded-full bg-gradient-to-tr from-cyan-400/40 via-blue-400/30 to-indigo-400/20 blur-2xl -z-10"
              />

              {/* Animated Flight Path with Moving Airplane */}
              <motion.div
                animate={{
                  x: [0, 14, 0],
                  y: [0, -6, 0],
                }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="absolute top-4 right-6 flex items-center gap-1.5 text-white z-20 pointer-events-none"
              >
                <motion.div
                  animate={{ rotate: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                >
                  <Plane className="w-5 h-5 text-cyan-300 drop-shadow-md transform rotate-45" />
                </motion.div>
                <div className="border-t-2 border-dashed border-cyan-300/80 w-14" />
              </motion.div>

              {/* Floating Top-Right 5-Star Review Card */}
              {reviewCardText && (
                <motion.div
                  animate={{
                    y: [-5, 5, -5],
                    rotate: [1, -1, 1],
                  }}
                  transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
                  className="absolute top-8 right-1 sm:-right-4 bg-white/95 backdrop-blur-md border border-white rounded-2xl p-3 shadow-2xl z-30 max-w-[180px] text-left cursor-default select-none text-slate-800"
                >
                  <div className="flex items-center gap-1 text-amber-500 mb-1">
                    {[...Array(reviewCardStars || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-[11px] font-bold text-slate-800 leading-tight">
                    {reviewCardText}
                  </p>
                </motion.div>
              )}

              {/* Floating Bottom-Left Achievement Card */}
              {achievementBadgeTitle && (
                <motion.div
                  animate={{
                    y: [5, -5, 5],
                    rotate: [-1, 1, -1],
                  }}
                  transition={{ repeat: Infinity, duration: 5.5, ease: 'easeInOut', delay: 0.5 }}
                  className="absolute bottom-6 left-1 sm:-left-4 bg-slate-900/90 backdrop-blur-md border border-white/20 rounded-2xl p-3 shadow-2xl z-30 max-w-[190px] text-left cursor-default select-none text-white flex items-center gap-2.5"
                >
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0 border border-cyan-400/30">
                    <CheckCircle2 className="w-4 h-4 text-cyan-300" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-white leading-tight">
                      {achievementBadgeTitle}
                    </p>
                    {achievementBadgeSub && (
                      <p className="text-[10px] text-slate-300 font-medium leading-tight mt-0.5">
                        {achievementBadgeSub}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Student Image Container */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative z-10 w-full h-full flex items-center justify-center overflow-hidden rounded-3xl shadow-2xl border-2 border-white/30 bg-white/10 backdrop-blur-xs"
              >
                <img
                  src={heroImage || '/images/hero-student.jpg'}
                  alt="Overseas Education Student"
                  className="w-full h-full object-cover object-center filter contrast-105"
                />

                {/* Brand Tag on Student Notebook */}
                {brandBadgeText && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-blue-900/90 backdrop-blur-md text-white px-3.5 py-1.5 rounded-lg text-xs font-bold tracking-wide shadow-xl flex items-center gap-1.5 whitespace-nowrap z-30 cursor-default border border-white/20"
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-cyan-300" />
                    <span>{brandBadgeText}</span>
                  </motion.div>
                )}
              </motion.div>

            </div>
          </motion.div>

        </div>
      </div>

      {/* ── Sleek Curved Wave Divider (disabled in preview mode) ── */}
      {!isPreview && (
        <div className="absolute -bottom-1 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none z-20">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="relative block w-full h-16 sm:h-24 md:h-32 lg:h-36 fill-current"
            preserveAspectRatio="none"
          >
            <path
              d="M 0,0 Q 720,115 1440,0 L 1440,120 L 0,120 Z"
              fill="#F4F8FD"
            />
          </svg>
        </div>
      )}
    </section>
  );
}
