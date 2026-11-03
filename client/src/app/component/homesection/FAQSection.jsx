'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FAQSection({
  items = [],
  tag = 'GOT QUESTIONS?',
  title = 'Frequently Asked Questions',
  subtitle =
    'Everything you need to know about studying or working abroad — answered by our experts.',
}) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (idx) => setOpenIndex(openIndex === idx ? null : idx);

  // JSON-LD FAQ structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <section
      id="faq"
      className="py-20 bg-gradient-to-b from-[#F4F8FD] via-[#EBF3FC] to-[#F1F6FD] relative overflow-hidden"
    >
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Ambient orb */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl pointer-events-none -ml-32" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-blue-600 uppercase mb-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{tag}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {title}
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-2 max-w-xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        {/* Accordion */}
        <dl className="space-y-3">
          {items.map((faq, idx) => {
            const isOpen = openIndex === idx;
            const panelId = `faq-panel-${idx}`;
            const triggerId = `faq-trigger-${idx}`;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'border-blue-400 shadow-lg shadow-blue-500/10 bg-white'
                    : 'border-slate-200/80 bg-white hover:border-blue-200 shadow-sm'
                }`}
              >
                {/* Question button */}
                <dt>
                  <button
                    id={triggerId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggle(idx)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4.5 sm:py-5 text-left cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 rounded-2xl"
                  >
                    <span
                      className={`font-semibold text-sm sm:text-base leading-snug transition-colors ${
                        isOpen ? 'text-blue-600' : 'text-slate-900 group-hover:text-blue-600'
                      }`}
                    >
                      {faq.question}
                    </span>
                    <span
                      className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isOpen
                          ? 'bg-blue-600 text-white rotate-180'
                          : 'bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600'
                      }`}
                      aria-hidden="true"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>
                </dt>

                {/* Answer panel */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.dd
                      id={panelId}
                      role="region"
                      aria-labelledby={triggerId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-sm text-slate-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.dd>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </dl>

      </div>
    </section>
  );
}
