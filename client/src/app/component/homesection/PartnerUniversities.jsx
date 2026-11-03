'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';

export default function PartnerUniversities({
  items = [],
  tag = 'TRUSTED PARTNERSHIPS',
  title = 'Our Partner Universities',
  subtitle =
    'We have direct tie-ups with 50+ top-ranked universities and colleges across the globe.',
}) {
  // Duplicate the list so the seamless loop never runs out of tiles
  const loopItems = [...items, ...items];

  return (
    <section
      id="partner-universities"
      className="py-20 bg-gradient-to-b from-[#F4F8FD] via-[#EBF3FC] to-[#F1F6FD] relative overflow-hidden border-y border-blue-100/50"
    >
      {/* Ambient orb */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-blue-600 uppercase mb-1">
            <Building2 className="w-3.5 h-3.5" />
            <span>{tag}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {title}
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-2 max-w-xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

      </div>

      {/* Full-bleed marquee strip */}
      <div
        className="relative overflow-hidden"
        // pause on hover via CSS custom property trick
      >
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 z-10 bg-gradient-to-r from-[#EBF3FC] to-transparent pointer-events-none" />
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 z-10 bg-gradient-to-l from-[#EBF3FC] to-transparent pointer-events-none" />

        {/* Marquee track */}
        <div
          className="flex gap-4 w-max partner-marquee"
          style={{ animation: 'marquee 38s linear infinite' }}
          onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = 'paused')}
          onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = 'running')}
        >
          {loopItems.map((uni, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-52 sm:w-60 px-5 py-4 bg-white rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 flex flex-col items-center justify-center text-center gap-1.5 cursor-default"
            >
              {/* Logo / Campus Image: Cloudinary photo or initials circle fallback */}
              {uni.image || uni.logo ? (
                <img
                  src={uni.image || uni.logo}
                  alt={uni.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0 shadow-2xs"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 font-extrabold text-sm flex items-center justify-center border border-blue-100 shrink-0">
                  {uni.name.split(' ').slice(0, 2).map((w) => w[0]).join('')}
                </div>
              )}
              <p className="text-xs font-bold text-slate-800 leading-tight line-clamp-2">
                {uni.name}
              </p>
              <p className="text-[10px] text-slate-400 font-medium">{uni.country}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Keyframe injected inline — avoids globals.css */}
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
