'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  UserCheck, 
  Building2, 
  Target, 
  Award 
} from 'lucide-react';

const DEFAULT_POINTS = [
  {
    title: 'Expert Guidance',
    desc: 'Experienced counselors with in-depth knowledge of global admission systems.',
    icon: UserCheck
  },
  {
    title: 'Trusted Partnerships',
    desc: 'Direct tie-ups with 50+ top universities and colleges worldwide.',
    icon: Building2
  },
  {
    title: 'Personalized Approach',
    desc: 'Every student’s dream is unique. So is our customized profile strategy.',
    icon: Target
  },
  {
    title: 'High Visa Success Rate',
    desc: 'Proven 98% track record of successful student visa approvals.',
    icon: Award
  }
];

export default function WhyChooseUs({
  points = DEFAULT_POINTS,
  onLearnMore,
  tag = 'WHY CHOOSE YTC GLOBAL',
  title = {
    line1: 'Your Success is',
    line2: 'Our Commitment'
  },
  description = 'We go beyond consultancy — we become your study abroad partner, offering personalized guidance, trusted support, and real opportunities.',
  studentImage = '/images/why-choose-student.jpg',
  badgeText = 'Global Opportunities Awaits ✈️'
}) {
  return (
    <section id="about" className="py-16 sm:py-24 bg-gradient-to-b from-[#F3F7FD] via-[#EEF5FD] to-[#F0F6FD] relative overflow-hidden">
      
      {/* Ambient background light */}
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-4 space-y-4 text-left"
          >
            <span className="text-xs font-bold tracking-wider text-blue-600 uppercase block">
              {tag}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {title.line1} <br className="hidden sm:inline" />
              {title.line2}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {description}
            </p>
            <div className="pt-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onLearnMore?.()}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>

          {/* Center Features Stacked List */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {points.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  whileHover={{ x: 6 }}
                  className="p-4 rounded-xl border border-slate-100 bg-white hover:bg-blue-50/60 hover:border-blue-200 transition-all duration-200 shadow-2xs flex items-start gap-3.5 cursor-default group"
                >
                  <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right Graphic: Student with backpack & blob */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-4 relative flex items-center justify-center"
          >
            <div className="relative w-full max-w-sm aspect-[4/4.5] flex items-end justify-center">
              
              {/* Organic Sky Blue Blob */}
              <motion.div 
                animate={{
                  borderRadius: [
                    "42% 58% 55% 45% / 45% 48% 52% 55%",
                    "55% 45% 48% 52% / 52% 55% 45% 48%",
                    "42% 58% 55% 45% / 45% 48% 52% 55%"
                  ]
                }}
                transition={{ repeat: Infinity, duration: 9, ease: "easeInOut" }}
                className="absolute inset-0 bg-[#E5F0FC] -z-10" 
              />

              {/* Floating playful text label matching screenshot: "Global Opportunities Awaits" */}
              <motion.div 
                animate={{ 
                  y: [-4, 4, -4],
                  rotate: [3, 1, 3]
                }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute top-6 right-2 sm:-right-4 bg-white/95 backdrop-blur-xs border border-blue-200 rounded-xl px-3.5 py-1.5 shadow-md text-left z-20 cursor-default select-none"
              >
                <p className="text-xs font-extrabold text-blue-700 font-sans flex items-center gap-1">
                  <span>{badgeText}</span>
                </p>
              </motion.div>

              {/* Male Student Image */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative z-10 w-full h-full overflow-hidden rounded-3xl shadow-lg border border-blue-100"
              >
                <img
                  src={studentImage}
                  alt="Student smiling"
                  className="w-full h-full object-cover object-center filter contrast-105"
                />
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

