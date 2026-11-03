'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  MessageCircle,
  GraduationCap,
  FileText,
  ShieldCheck,
  Plane,
  Layers,
} from 'lucide-react';
import steps from '../../data/steps';

// Map icon strings from data file → lucide components
const ICON_MAP = {
  MessageCircle,
  GraduationCap,
  FileText,
  ShieldCheck,
  Plane,
};

export default function HowItWorks({
  items = steps,
  tag = 'SIMPLE PROCESS',
  title = 'How It Works',
  subtitle =
    'From your first conversation to boarding the plane — we are with you at every step.',
}) {
  return (
    <section
      id="how-it-works"
      className="py-20 bg-gradient-to-b from-[#F1F6FD] via-[#E8F2FD]/80 to-[#F3F7FD] relative overflow-hidden"
    >
      {/* Ambient orb */}
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-blue-200/25 rounded-full blur-3xl pointer-events-none -mr-32" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-blue-600 uppercase mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>{tag}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {title}
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-2 max-w-xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        {/* Steps */}
        {/* Desktop: horizontal row with connecting line. Mobile: vertical stack. */}
        <div className="relative">

          {/* Horizontal connector line — visible only on lg+ */}
          <div
            className="hidden lg:block absolute top-[52px] left-[calc(10%+28px)] right-[calc(10%+28px)] h-0.5 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 z-0"
            aria-hidden="true"
          />

          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-4 relative z-10">
            {items.map((step, idx) => {
              const StepIcon = ICON_MAP[step.icon] || GraduationCap;
              return (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="flex flex-col items-center text-center lg:items-center group"
                >
                  {/* Mobile: left-aligned with vertical line */}
                  {/* We use a wrapper that re-arranges on mobile */}
                  <div className="flex lg:flex-col items-start lg:items-center gap-4 lg:gap-3 w-full">

                    {/* Step number + icon bubble */}
                    <div className="relative shrink-0">
                      {/* Outer ring */}
                      <div className="w-14 h-14 rounded-full bg-white border-2 border-blue-200 group-hover:border-blue-600 shadow-md flex items-center justify-center transition-all duration-300 group-hover:shadow-blue-500/20 group-hover:shadow-lg">
                        <div className="w-10 h-10 rounded-full bg-blue-50 group-hover:bg-blue-600 flex items-center justify-center transition-colors duration-300">
                          <StepIcon className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors duration-300" />
                        </div>
                      </div>
                      {/* Step number badge */}
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-extrabold flex items-center justify-center shadow">
                        {idx + 1}
                      </span>
                    </div>

                    {/* Mobile vertical connector */}
                    {idx < items.length - 1 && (
                      <div className="lg:hidden absolute left-7 top-14 w-0.5 h-8 bg-blue-200" aria-hidden="true" />
                    )}

                    <div className="text-left lg:text-center pt-1 lg:pt-0 flex-1">
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-[12px] sm:text-xs text-slate-500 mt-1 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>

      </div>
    </section>
  );
}
