'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  FileCheck2, 
  ShieldCheck, 
  Languages, 
  Home as HomeIcon, 
  Coins, 
  Compass, 
  Plane, 
  Headset,
  Layers 
} from 'lucide-react';

const DEFAULT_SERVICES = [
  {
    title: 'University Selection & Application',
    icon: FileCheck2,
    desc: 'Expert help in choosing the right university and completing seamless applications.',
    href: '/services#university-selection',
  },
  {
    title: 'Visa Guidance & Documentation',
    icon: ShieldCheck,
    desc: 'High-success rate visa file preparation and mock embassy interview training.',
    href: '/services#visa-guidance',
  },
  {
    title: 'IELTS / Language Test Preparation',
    icon: Languages,
    desc: 'Comprehensive training with top scoring strategies for IELTS, TOEFL & PTE.',
    href: '/services#ielts-preparation',
  },
  {
    title: 'Accommodation Assistance',
    icon: HomeIcon,
    desc: 'Safe and budget-friendly student housing near your chosen campus.',
    href: '/services#accommodation-assistance',
  },
  {
    title: 'Financial Guidance & Scholarship Support',
    icon: Coins,
    desc: 'Assistance securing educational loans, bank proofs, and merit scholarships.',
    href: '/services#financial-advisory',
  },
  {
    title: 'Pre-Departure Orientation',
    icon: Compass,
    desc: 'Essential packing lists, currency exchange, and cultural adaptation sessions.',
    href: '/services#pre-departure',
  },
  {
    title: 'Travel Assistance',
    icon: Plane,
    desc: 'Discounted student air tickets, travel insurance, and baggage guidance.',
    href: '/services#travel-assistance',
  },
  {
    title: 'Post-Arrival Support',
    icon: Headset,
    desc: 'Airport pickup, local SIM cards, bank account setup, and 24/7 helpline.',
    href: '/services#post-arrival',
  }
];

export default function ServicesSection({
  services = DEFAULT_SERVICES,
  onExploreServices,
  tag = 'OUR SERVICES',
  title = {
    line1: 'Complete Support',
    line2: 'for Your Study',
    line3: 'Abroad Journey'
  },
  description = 'From university selection to visa assistance, we provide end-to-end support to make your dream a reality.'
}) {
  const displayTitle = typeof title === 'string'
    ? title
    : `${title.line1} ${title.line2} ${title.line3}`;

  return (
    <section id="services" className="py-20 sm:py-24 bg-gradient-to-b from-[#F1F6FD] via-[#E8F2FD]/80 to-[#F3F7FD] border-y border-blue-100/50 relative overflow-hidden">
      
      {/* Decorative ambient glowing orb */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Top Centered Header — Creates balanced symmetry & eliminates bottom-left void */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-14 sm:mb-16 space-y-3"
        >
          <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-blue-600 uppercase">
            <Layers className="w-3.5 h-3.5" />
            <span>{tag}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {displayTitle}
          </h2>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto pt-1">
            {description}
          </p>
        </motion.div>

        {/* Symmetrical 4x2 Grid (8 cards in perfect 2-row symmetry) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {services.map((item, idx) => {
            const ServiceIcon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.05 }}
                whileHover={{ 
                  y: -6, 
                  transition: { duration: 0.2 } 
                }}
                className="p-6 rounded-3xl bg-white border border-slate-200/80 hover:border-blue-400 hover:shadow-xl transition-all duration-300 shadow-xs flex flex-col justify-between group"
              >
                <div>
                  {/* Icon container */}
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-xs">
                    <ServiceIcon className="w-6 h-6 transition-transform group-hover:scale-110" />
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-500 mt-2.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* Direct Action Link */}
                <Link
                  href={item.href || '/services'}
                  className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:text-blue-700"
                >
                  <span>Learn more</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Centered Bottom CTA */}
        <div className="text-center mt-12 sm:mt-14">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all hover:scale-105 group"
          >
            <span>Explore All Services</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

      </div>
    </section>
  );
}
