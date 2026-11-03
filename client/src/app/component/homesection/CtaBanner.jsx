'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Send, Rocket } from 'lucide-react';

export default function CtaBanner({
  onOpenConsultation,
  tag = 'TAKE THE FIRST STEP',
  title = 'Let’s Build Your Global Future',
  subtitle = 'Get expert advice, personalized guidance, and start your study abroad journey today.',
  buttonText = 'Book a Free Consultation'
}) {
  return (
    <section id="consultation" className="py-16 bg-gradient-to-b from-[#F4F8FD] to-[#EDF4FC] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl bg-gradient-to-r from-[#0E4DA4] via-[#125ec9] to-[#0A3D85] text-white p-8 sm:p-14 overflow-hidden shadow-2xl"
        >
          {/* Animated gradient light pulse */}
          <motion.div 
            animate={{ 
              scale: [1, 1.25, 1],
              opacity: [0.15, 0.35, 0.15]
            }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-cyan-300 blur-3xl pointer-events-none"
          />

          {/* Flying Paper Plane background decoration with float animation */}
          <motion.div 
            animate={{ 
              x: [0, 15, 0],
              y: [0, -10, 0],
              rotate: [12, 16, 12]
            }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="absolute top-6 right-10 text-white/15 pointer-events-none select-none hidden sm:block"
          >
            <Send className="w-36 h-36" />
          </motion.div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            
            <div className="space-y-3 max-w-2xl text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-blue-200 text-xs font-bold tracking-widest uppercase">
                <Rocket className="w-3.5 h-3.5 text-cyan-300" />
                <span>{tag}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                {title}
              </h2>

              <p className="text-blue-100 text-sm sm:text-base leading-relaxed max-w-xl">
                {subtitle}
              </p>
            </div>

            <div className="shrink-0">
              <motion.button
                whileHover={{ scale: 1.06, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onOpenConsultation?.()}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm sm:text-base shadow-xl hover:shadow-2xl hover:shadow-black/20 transition-all duration-200 cursor-pointer whitespace-nowrap group"
              >
                <span>{buttonText}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </motion.button>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
