'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Globe } from 'lucide-react';

export default function StudyDestinations({
  items = [],
  tag = 'STUDY ABROAD',
  title = 'Popular Study Destinations',
  subtitle =
    'Explore 8 top countries and find the perfect destination for your academic journey.',
  viewAllLink = '/study-abroad',
}) {
  return (
    <section
      id="study-destinations"
      className="py-20 bg-white relative overflow-hidden"
    >
      {/* Ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* Header Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12"
        >
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-blue-600 uppercase mb-1">
              <Globe className="w-3.5 h-3.5" />
              <span>{tag}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {title}
            </h2>
            <p className="text-slate-500 text-sm sm:text-base mt-1.5 max-w-xl">
              {subtitle}
            </p>
          </div>
          <Link
            href={viewAllLink}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 transition-all self-start sm:self-auto group"
          >
            <span>View All Countries</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* 8-card grid: 2 cols mobile → 4 cols lg */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-5">
          {items.map((item, idx) => (
            <motion.div
              key={item.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.07, ease: 'easeOut' }}
              whileHover={{ y: -8, transition: { duration: 0.22, ease: 'easeOut' } }}
              className="group relative bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-2xl hover:border-blue-400 transition-all duration-300 flex flex-col cursor-pointer"
            >
              {/* Image */}
              <Link href={item.href} className="block relative h-36 sm:h-44 w-full overflow-hidden bg-slate-100">
                <img
                  src={item.image}
                  alt={item.country}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-70 group-hover:opacity-40 transition-opacity duration-300" />

                {/* Badge */}
                {item.badge && (
                  <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-md text-[10px] font-bold text-slate-800 px-2.5 py-0.5 rounded-full shadow-md">
                    {item.badge}
                  </div>
                )}

                {/* Flag overlaid bottom-right on image */}
                <span className="absolute bottom-2.5 right-3 text-2xl drop-shadow-md" role="img" aria-label={item.country}>
                  {item.flag}
                </span>
              </Link>

              {/* Content */}
              <div className="p-4 flex flex-col flex-1 justify-between bg-white">
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                    {item.country}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                    {item.tagline}
                  </p>
                </div>

                {/* Explore link */}
                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={item.href}
                    className="text-[11px] font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0 duration-200"
                  >
                    Explore
                  </Link>
                  <div className="w-7 h-7 rounded-full bg-slate-50 group-hover:bg-blue-600 text-slate-600 group-hover:text-white flex items-center justify-center transition-all ml-auto shadow-sm group-hover:shadow-md group-hover:shadow-blue-500/30">
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
