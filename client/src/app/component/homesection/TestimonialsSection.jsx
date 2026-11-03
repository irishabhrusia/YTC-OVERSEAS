'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Star, Quote, MessageSquareQuote } from 'lucide-react';

const DEFAULT_TESTIMONIALS = [
  {
    name: 'Ayesha Rahman',
    country: 'Canada',
    quote: '“ YTC made my study abroad journey so smooth and stress-free. Their guidance and support were excellent throughout the whole visa process!”',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    university: 'University of Toronto',
    rating: 5
  },
  {
    name: 'Tanvir Hasan',
    country: 'UK',
    quote: '“From university selection to visa process, everything was handled professionally. Highly recommended to anyone looking to study in the UK!”',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    university: 'University of Manchester',
    rating: 5
  },
  {
    name: 'Nusrat Jahan',
    country: 'Australia',
    quote: '“The team was always there to support me. I’m now studying in Australia, and it wouldn’t have been possible without their step-by-step guidance!”',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    university: 'University of Sydney',
    rating: 5
  }
];

export default function TestimonialsSection({
  testimonials = DEFAULT_TESTIMONIALS,
  tag = 'STUDENT REVIEWS',
  title = 'What Our Students Say',
  subtitle = 'Real experiences. Real achievements. Hear directly from students who fulfilled their global education dreams with YTC Global.'
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance every 5.5 seconds, pauses when hovered
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev < testimonials.length - 1 ? prev + 1 : 0));
    }, 5500);

    return () => clearInterval(timer);
  }, [isPaused, testimonials.length]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : testimonials.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < testimonials.length - 1 ? prev + 1 : 0));
  };

  return (
    <section
      className="py-20 bg-gradient-to-b from-[#F0F6FD] via-[#EAF2FC]/70 to-[#F4F8FD] border-t border-blue-100/50 relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Subtle ambient blur */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none -mr-40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* Header Row with Navigation Arrows */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12"
        >
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-blue-600 uppercase mb-1">
              <MessageSquareQuote className="w-3.5 h-3.5" />
              <span>{tag}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {title}
            </h2>
            <p className="text-slate-500 text-sm sm:text-base mt-1.5 max-w-xl">
              {subtitle}
            </p>
          </div>

          {/* Left / Right Nav Arrows */}
          <div className="flex items-center gap-2.5">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.92 }}
              onClick={handlePrev}
              aria-label="Previous Testimonials"
              className="w-10 h-10 rounded-full bg-white border border-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 text-slate-700 flex items-center justify-center transition-all shadow-xs cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleNext}
              aria-label="Next Testimonials"
              className="w-10 h-10 rounded-full bg-white border border-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 text-slate-700 flex items-center justify-center transition-all shadow-xs cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>

        {/* 3 Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, idx) => {
            const isCurrent = activeIndex === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
                whileHover={{ y: -8, transition: { duration: 0.25 } }}
                onClick={() => setActiveIndex(idx)}
                className={`relative bg-white rounded-2xl p-7 border transition-all duration-300 flex flex-col justify-between shadow-xs hover:shadow-2xl cursor-pointer ${isCurrent
                    ? 'border-blue-500 ring-4 ring-blue-500/15 shadow-lg'
                    : 'border-slate-200/90 hover:border-blue-300'
                  }`}
              >
                {/* Decorative Quote Icon with subtle rotation */}
                <div className="absolute top-6 right-6 text-blue-100 group-hover:text-blue-200 transition-colors pointer-events-none">
                  <Quote className="w-9 h-9 rotate-180 opacity-50" />
                </div>

                {/* Rating Stars with Shimmer */}
                <div className="flex items-center gap-1 mb-4 text-amber-400">
                  {[...Array(item.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Quote Text */}
                <p className="text-slate-600 text-sm sm:text-[15px] italic leading-relaxed mb-6 relative z-10">
                  {item.quote}
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-3.5 pt-4 border-t border-slate-100 mt-auto">
                  <motion.img
                    whileHover={{ scale: 1.12 }}
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-500/30 shadow-xs"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{item.name}</h4>
                    <p className="text-xs text-blue-600 font-semibold">{item.university}</p>
                    <span className="text-[11px] text-slate-400 font-medium">{item.country}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Carousel Pagination Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${activeIndex === idx ? 'w-8 bg-blue-600' : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
