'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Briefcase,
  ShieldCheck,
  Building2,
  Headset,
} from 'lucide-react';
import { recruitmentData } from '../../data/recruitment';

const ICON_MAP = { Briefcase, ShieldCheck, Building2, Headset };

export default function OverseasRecruitment({ data = recruitmentData }) {
  return (
    <section
      id="overseas-recruitment"
      className="py-16 sm:py-24 bg-gradient-to-b from-[#F3F7FD] via-[#EEF5FD] to-[#F0F6FD] relative overflow-hidden"
    >
      {/* Ambient orb */}
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-6"
          >
            <div>
              <span className="text-xs font-bold tracking-wider text-blue-600 uppercase block mb-1">
                {data.tag}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {data.heading}
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-3 max-w-lg">
                {data.subtext}
              </p>
            </div>

            {/* Highlights grid */}
            <div className="grid grid-cols-2 gap-3">
              {data.highlights.map((h, i) => {
                const Icon = ICON_MAP[h.icon] || Briefcase;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-slate-100 shadow-sm hover:border-blue-200 hover:shadow-md transition-all group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {h.label}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            {/* Job category chips */}
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Job Categories
              </p>
              <div className="flex flex-wrap gap-2">
                {data.jobCategories.map((cat) => (
                  <span
                    key={cat}
                    className="px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all cursor-default"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            {/* Country chips */}
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Hiring Countries
              </p>
              <div className="flex flex-wrap gap-2">
                {data.countries.map((c) => (
                  <span
                    key={c}
                    className="px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-all cursor-default"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 pt-1">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href={data.exploreLink}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all group"
                >
                  <span>Explore Jobs</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href={data.applyLink}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-slate-200 hover:border-blue-400 text-slate-800 font-semibold text-sm shadow-sm transition-all group"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-blue-600" />
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Right — image card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.93 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 relative flex items-center justify-center"
          >
            <div className="relative w-full max-w-lg aspect-[4/3.5] rounded-3xl overflow-hidden shadow-2xl border border-blue-100">
              <img
                src={data.image}
                alt="Overseas recruitment — professionals working abroad"
                className="w-full h-full object-cover object-center"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent" />

              {/* Floating badge */}
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md border border-blue-100 rounded-2xl px-4 py-3 shadow-xl select-none"
              >
                <p className="text-xs text-slate-500 font-medium">Placements in 2025</p>
                <p className="text-xl font-extrabold text-blue-700 leading-tight">5,000+</p>
                <p className="text-[11px] text-slate-400">Candidates placed globally</p>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
