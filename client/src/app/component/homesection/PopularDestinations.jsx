'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Globe } from 'lucide-react';

const DEFAULT_DESTINATIONS = [
  {
    country: 'Canada',
    flagSvg: (
      <svg className="w-5 h-5 rounded-full overflow-hidden shadow-xs shrink-0" viewBox="0 0 512 512">
        <rect width="512" height="512" fill="#d80027"/>
        <rect width="256" height="512" x="128" fill="#f0f0f0"/>
        <path fill="#d80027" d="m256 140 18 43 41-11-20 40 44 19-35 30 18 44-48-12-18 47-18-47-48 12 18-44-35-30 44-19-20-40 41 11z"/>
      </svg>
    ),
    image: 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?auto=format&fit=crop&w=600&q=80',
    subtitle: 'Quality Education, Better Opportunities',
    badge: 'High PR Chance'
  },
  {
    country: 'UK',
    flagSvg: (
      <svg className="w-5 h-5 rounded-full overflow-hidden shadow-xs shrink-0" viewBox="0 0 512 512">
        <path fill="#00247d" d="M0 0h512v512H0z"/>
        <path fill="#f0f0f0" d="M0 0v64l400 448h112v-64L112 0zm512 0h-64L0 448v64h64l448-448z"/>
        <path fill="#cf142b" d="m0 0 336 336h64L64 0zm512 0-336 336v64L512 64zM0 512l336-336h64L64 512zm512 0-336-336v64L512 448z"/>
        <path fill="#f0f0f0" d="M192 0h128v512H192zM0 192h512v128H0z"/>
        <path fill="#cf142b" d="M216 0h80v512h-80zM0 216h512v80H0z"/>
      </svg>
    ),
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80',
    subtitle: 'World-Class Universities, Global Recognition',
    badge: 'Fast Track 1-Yr Masters'
  },
  {
    country: 'Australia',
    flagSvg: (
      <svg className="w-5 h-5 rounded-full overflow-hidden shadow-xs shrink-0" viewBox="0 0 512 512">
        <path fill="#00247d" d="M0 0h512v512H0z"/>
        <path fill="#f0f0f0" d="M0 0v32l200 224h56v-32L56 0zm256 0h-32L0 224v32h32l224-224z"/>
        <path fill="#cf142b" d="m0 0 168 168h32L32 0zm256 0-168 168v32L256 32zM0 256l168-168h32L32 256zm256 0-168-168v32L256 224z"/>
        <path fill="#f0f0f0" d="M96 0h64v256H96zM0 96h256v64H0z"/>
        <path fill="#cf142b" d="M112 0h32v256h-32zM0 112h256v32H0z"/>
        <circle cx="128" cy="384" r="32" fill="#f0f0f0"/>
        <circle cx="384" cy="128" r="24" fill="#f0f0f0"/>
        <circle cx="448" cy="224" r="16" fill="#f0f0f0"/>
        <circle cx="384" cy="384" r="28" fill="#f0f0f0"/>
        <circle cx="320" cy="288" r="16" fill="#f0f0f0"/>
      </svg>
    ),
    image: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=600&q=80',
    subtitle: 'Innovative Learning, Bright Future',
    badge: 'Post-Study Work Visa'
  },
  {
    country: 'USA',
    flagSvg: (
      <svg className="w-5 h-5 rounded-full overflow-hidden shadow-xs shrink-0" viewBox="0 0 512 512">
        <path fill="#cf142b" d="M0 0h512v512H0z"/>
        <path fill="#f0f0f0" d="M0 39.38h512v39.38H0zm0 78.77h512v39.38H0zm0 78.77h512v39.38H0zm0 78.77h512v39.38H0zm0 78.77h512v39.38H0zm0 78.77h512v39.38H0z"/>
        <path fill="#00247d" d="M0 0h256v275.69H0z"/>
        <circle cx="64" cy="64" r="12" fill="#f0f0f0"/>
        <circle cx="128" cy="64" r="12" fill="#f0f0f0"/>
        <circle cx="192" cy="64" r="12" fill="#f0f0f0"/>
        <circle cx="96" cy="128" r="12" fill="#f0f0f0"/>
        <circle cx="160" cy="128" r="12" fill="#f0f0f0"/>
        <circle cx="64" cy="192" r="12" fill="#f0f0f0"/>
        <circle cx="128" cy="192" r="12" fill="#f0f0f0"/>
        <circle cx="192" cy="192" r="12" fill="#f0f0f0"/>
      </svg>
    ),
    image: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=600&q=80',
    subtitle: 'Top-Ranked Universities, Endless Possibilities',
    badge: 'STEM Extension'
  },
  {
    country: 'Germany',
    flagSvg: (
      <svg className="w-5 h-5 rounded-full overflow-hidden shadow-xs shrink-0" viewBox="0 0 512 512">
        <path fill="#000" d="M0 0h512v170.67H0z"/>
        <path fill="#d80027" d="M0 170.67h512v170.67H0z"/>
        <path fill="#ffda44" d="M0 341.33h512V512H0z"/>
      </svg>
    ),
    image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=600&q=80',
    subtitle: 'Affordable Education, Strong Career Opportunities',
    badge: 'Zero Tuition Fees'
  }
];

export default function PopularDestinations({
  destinations = DEFAULT_DESTINATIONS,
  onSelectDestination,
  tag = 'STUDY ABROAD',
  title = 'Popular Destinations',
  subtitle = 'Explore top study destinations and find the perfect country for your academic journey.',
  viewAllLink = '/destinations'
}) {
  return (
    <section id="destinations" className="py-20 bg-gradient-to-b from-[#F4F8FD] via-[#EBF3FC] to-[#F1F6FD] relative overflow-hidden">
      
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-blue-200/25 rounded-full blur-3xl pointer-events-none" />

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

        {/* 5 Destination Cards Grid with Staggered Entrance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {destinations.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
              whileHover={{ 
                y: -10, 
                transition: { duration: 0.25, ease: "easeOut" } 
              }}
              whileTap={{ scale: 0.98 }}
              className="group relative bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-2xl hover:border-blue-400 transition-all duration-300 flex flex-col cursor-pointer"
              onClick={() => onSelectDestination?.(item.country)}
            >
              {/* Image Container with zoom and sheen effect */}
              <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                <img
                  src={item.image}
                  alt={item.country}
                  className="w-full h-full object-cover group-hover:scale-112 transition-transform duration-600 ease-out"
                />
                
                {/* Dynamic Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-70 group-hover:opacity-40 transition-opacity duration-300" />

                {/* Country Badge on Image */}
                {item.badge && (
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-[10px] font-bold text-slate-800 px-2.5 py-0.5 rounded-full shadow-md">
                    {item.badge}
                  </div>
                )}
              </div>

              {/* Content Area */}
              <div className="p-4 flex flex-col flex-1 justify-between bg-white">
                <div>
                  {/* Country Name + Flag with micro-bounce */}
                  <div className="flex items-center gap-2 mb-1.5">
                    <motion.div 
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      className="shrink-0"
                    >
                      {item.flagSvg || <span className="text-xl leading-none">{item.flag || '🌍'}</span>}
                    </motion.div>
                    <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                      {item.country}
                    </h3>
                  </div>

                  {/* Subtitle / Description */}
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {item.subtitle || item.tagline}
                  </p>
                </div>

                {/* Interactive Arrow Action Button */}
                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-all transform -translate-x-1 group-hover:translate-x-0 duration-200">
                    Apply Now
                  </span>
                  <div className="w-7 h-7 rounded-full bg-slate-50 group-hover:bg-blue-600 text-slate-600 group-hover:text-white flex items-center justify-center transition-all ml-auto shadow-xs group-hover:shadow-md group-hover:shadow-blue-500/30">
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
