'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  FileText,
  BookOpen,
  Home as HomeIcon,
  Globe,
  Users,
  Building2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Award,
  ChevronDown,
  Coins,
  Compass,
  Plane,
  Headset,
  Briefcase,
  HelpCircle,
  Clock,
  PhoneCall,
  Loader2
} from 'lucide-react';
import PageHeader from '../../component/PageHeader';
import { pageHeaders } from '../../data/pageHeaders';
import { fetchServices } from '../../lib/api';
import ConsultationModal from '../../component/homesection/ConsultationModal';

const ICON_MAP = {
  GraduationCap,
  FileText,
  BookOpen,
  Home: HomeIcon,
  Globe,
  Users,
  Building2,
};

const ADDON_SERVICES = [
  {
    id: 'financial-advisory',
    icon: Coins,
    title: 'Financial Guidance & Scholarship Support',
    tagline: 'Merit-based scholarships, collateral-free loans, and blocked account setup.',
    perks: [
      'Institutional fee waiver and bursary applications',
      'Tie-ups with leading nationalized & private student loan banks',
      'German Sperrkonto (Blocked Account) & Canadian GIC setup assistance',
      'Forex card and foreign currency wire transfer at discounted rates',
    ],
  },
  {
    id: 'pre-departure',
    icon: Compass,
    title: 'Pre-Departure Orientation',
    tagline: 'Customs regulations, packing checklists, and cultural adaptation sessions.',
    perks: [
      'In-depth briefing on destination culture, laws, and student visa compliance',
      'Essential packing lists & mandatory document portfolios',
      'Academic expectations and syllabus orientation for overseas universities',
      'Networking with fellow students traveling to the same intake city',
    ],
  },
  {
    id: 'travel-assistance',
    icon: Plane,
    title: 'Discounted Air Ticketing & Travel Aid',
    tagline: 'Exclusive student airfares with extra baggage allowances & travel insurance.',
    perks: [
      'Special discounted student airfare with extra baggage allowances (up to 40kg)',
      'Comprehensive overseas medical & travel insurance policies',
      'Connecting flight coordination & transit visa guidance',
      'Flexible flight rescheduling & cancellation support for students',
    ],
  },
  {
    id: 'post-arrival',
    icon: Headset,
    title: 'Post-Arrival Settlement & Support',
    tagline: 'Airport transfer, local SIM cards, student bank accounts, and 24/7 helpline.',
    perks: [
      'Airport pickup and direct transit to student accommodation',
      'Local telecommunication SIM card setup & activation on arrival',
      'Student bank account opening assistance (Chase, Barclays, RBC, ANZ)',
      '24/7 international emergency support hotline throughout your stay',
    ],
  },
];

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [openFaq, setOpenFaq] = useState({});
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState('Canada');

  useEffect(() => {
    let ignore = false;
    fetchServices()
      .then((data) => {
        if (!ignore && Array.isArray(data) && data.length > 0) {
          setServices(data);
        }
        if (!ignore) setIsLoading(false);
      })
      .catch(() => {
        if (!ignore) setIsLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  const toggleFaq = (serviceSlug, faqIdx) => {
    const key = `${serviceSlug}-${faqIdx}`;
    setOpenFaq((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleOpenConsultation = (dest = 'Canada') => {
    setSelectedDestination(dest);
    setIsConsultationModalOpen(true);
  };

  const allServicesList = services;
  const studyServicesList = services.filter(
    (s) => s.categorySlug === 'study-abroad' || s.group === 'study'
  );
  const recruitmentServicesList = services.filter(
    (s) =>
      s.categorySlug === 'recruitment' ||
      s.categorySlug === 'overseas-recruitment' ||
      s.group === 'recruitment'
  );

  const visibleServices =
    activeTab === 'all'
      ? allServicesList
      : activeTab === 'study-abroad'
      ? studyServicesList
      : recruitmentServicesList;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F4F8FD] via-[#EDF4FC] to-[#F1F6FD] text-slate-900 overflow-x-hidden selection:bg-blue-600 selection:text-white">
      
      {/* ── 1. Page Header ── */}
      <PageHeader
        variant="light"
        data={{
          ...pageHeaders.services,
          title: 'Comprehensive Global Education & Career Services',
          description:
            'From university shortlisting and visa processing to overseas recruitment and post-arrival settlement, explore all end-to-end services provided by YTC Global on a single comprehensive page.',
        }}
        onOpenConsultation={() => handleOpenConsultation('Canada')}
      />

      {/* ── 2. Interactive Category Filter & Quick Jump Bar ── */}
      <section className="sticky top-20 z-30 bg-white/90 backdrop-blur-md border-y border-slate-200/90 py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200/80 overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Services ({allServicesList.length})
            </button>
            <button
              onClick={() => setActiveTab('study-abroad')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'study-abroad'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Study Abroad ({studyServicesList.length})
            </button>
            <button
              onClick={() => setActiveTab('recruitment')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'recruitment'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Enterprise Staffing ({recruitmentServicesList.length})
            </button>
          </div>

          {/* Quick Jump Dropdown / Pill Links */}
          <div className="flex items-center gap-2 overflow-x-auto max-w-full text-xs font-semibold text-slate-500">
            <span className="hidden sm:inline uppercase tracking-wider text-[11px] font-bold text-slate-400">
              Jump To:
            </span>
            <a
              href="#university-selection"
              className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 transition-colors whitespace-nowrap"
            >
              University Selection
            </a>
            <a
              href="#visa-guidance"
              className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 transition-colors whitespace-nowrap"
            >
              Visa Guidance
            </a>
            <a
              href="#ielts-preparation"
              className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 transition-colors whitespace-nowrap"
            >
              IELTS Prep
            </a>
            <a
              href="#accommodation-assistance"
              className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 transition-colors whitespace-nowrap"
            >
              Accommodation
            </a>
            <a
              href="#overseas-recruitment"
              className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 transition-colors whitespace-nowrap"
            >
              Recruitment
            </a>
            <a
              href="#value-added-services"
              className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 font-bold border border-blue-200 hover:bg-blue-100 transition-colors whitespace-nowrap"
            >
              Add-on Services
            </a>
          </div>

        </div>
      </section>

      {/* ── 3. Main Services Deep-Dive List ── */}
      <section className="py-14 sm:py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
              <p className="text-sm font-semibold text-slate-500">Loading comprehensive services catalogue...</p>
            </div>
          ) : visibleServices.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
              <p className="text-slate-500 font-medium">No services found in this category.</p>
            </div>
          ) : (
            visibleServices.map((service, sIndex) => {
            const IconComp = ICON_MAP[service.iconName] || GraduationCap;
            const isRecruitment = service.categorySlug === 'recruitment';

            return (
              <div
                key={service.slug || sIndex}
                id={service.slug}
                className="scroll-mt-36 bg-white rounded-3xl border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Top Accent Color Bar */}
                <div
                  className="h-2 w-full"
                  style={{ backgroundColor: service.accentColor || '#2563EB' }}
                />

                <div className="p-6 sm:p-10 space-y-8">
                  
                  {/* Service Header Bar */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider text-white"
                          style={{ backgroundColor: service.accentColor || '#2563EB' }}
                        >
                          {service.badge || service.category}
                        </span>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                          {isRecruitment ? 'Corporate & Workforce' : 'Student Pathway'}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-sm"
                          style={{ backgroundColor: service.accentColor || '#2563EB' }}
                        >
                          <IconComp className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                          {service.title}
                        </h2>
                      </div>

                      <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
                        {service.tagline}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 shrink-0">
                      <button
                        onClick={() => handleOpenConsultation(isRecruitment ? 'UAE' : 'Canada')}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                      >
                        <PhoneCall className="w-4 h-4" />
                        <span>Book Advisory for This</span>
                      </button>
                    </div>
                  </div>

                  {/* 4 Stats Highlights Strip */}
                  {service.stats && service.stats.length > 0 && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {service.stats.map((stat, sIdx) => (
                        <div
                          key={sIdx}
                          className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/30 border border-slate-200/70"
                        >
                          <span
                            className="text-2xl sm:text-3xl font-black block"
                            style={{ color: service.accentColor || '#2563EB' }}
                          >
                            {stat.value}
                          </span>
                          <span className="text-xs font-bold text-slate-600 mt-1 block">
                            {stat.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Two-Column Overview & Deliverables vs Process */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                    
                    {/* Left: Overview & Key Inclusions (6 cols) */}
                    <div className="lg:col-span-6 space-y-6">
                      <div className="space-y-3">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          About This Service
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {service.overview || service.description}
                        </p>
                      </div>

                      {service.deliverables && service.deliverables.length > 0 && (
                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
                            <CheckCircle2
                              className="w-4 h-4"
                              style={{ color: service.accentColor || '#2563EB' }}
                            />
                            <span>What Is Included (Deliverables)</span>
                          </div>
                          <div className="grid grid-cols-1 gap-2.5">
                            {service.deliverables.map((item, dIdx) => (
                              <div key={dIdx} className="flex items-start gap-2.5 text-xs text-slate-700">
                                <span
                                  className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                                  style={{ backgroundColor: service.accentColor || '#2563EB' }}
                                />
                                <span className="leading-snug">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right: 4-Step Process Roadmap (6 cols) */}
                    <div className="lg:col-span-6 space-y-4">
                      {service.process && service.process.length > 0 && (
                        <>
                          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Our Proven 4-Step Roadmap
                          </h3>
                          <div className="space-y-3">
                            {service.process.map((step, idx) => (
                              <div
                                key={step.step || idx}
                                className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-blue-300 transition-colors flex items-start gap-3.5"
                              >
                                <span
                                  className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 text-white shadow-2xs"
                                  style={{ backgroundColor: service.accentColor || '#2563EB' }}
                                >
                                  {step.step || idx + 1}
                                </span>
                                <div className="space-y-0.5">
                                  <h4 className="font-bold text-sm text-slate-900">
                                    {step.title}
                                  </h4>
                                  <p className="text-xs text-slate-500 leading-relaxed">
                                    {step.desc}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                  </div>

                  {/* Service FAQs Accordion */}
                  {service.faqs && service.faqs.length > 0 && (
                    <div className="pt-6 border-t border-slate-100 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                        <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                        <span>Frequently Asked Questions About {service.title}</span>
                      </div>
                      <div className="grid grid-cols-1 gap-2.5">
                        {service.faqs.map((faq, fIdx) => {
                          const isOpen = !!openFaq[`${service.slug}-${fIdx}`];
                          return (
                            <div
                              key={fIdx}
                              className="rounded-2xl border border-slate-200/90 overflow-hidden bg-slate-50/50"
                            >
                              <button
                                onClick={() => toggleFaq(service.slug, fIdx)}
                                className="w-full px-5 py-3.5 text-left flex items-center justify-between gap-4 text-xs sm:text-sm font-bold text-slate-800 hover:text-blue-600 transition-colors cursor-pointer"
                              >
                                <span>{faq.question || faq.q}</span>
                                <ChevronDown
                                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                                    isOpen ? 'rotate-180 text-blue-600' : ''
                                  }`}
                                />
                              </button>
                              {isOpen && (
                                <div className="px-5 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-white pt-3">
                                  {faq.answer || faq.a}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            );
          }))}

        </div>
      </section>

      {/* ── 4. Value-Added Complementary Support Services ── */}
      <section id="value-added-services" className="scroll-mt-24 py-16 sm:py-24 bg-gradient-to-b from-[#EDF4FC] via-[#F4F8FD] to-[#E9F2FC] border-y border-blue-100/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold tracking-wider text-blue-600 uppercase block mb-1">
              END-TO-END STUDENT CARE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Value-Added &amp; Settlement Services
            </h2>
            <p className="text-slate-500 text-sm sm:text-base mt-2">
              Beyond university applications and visa filing, we provide complete pre-departure, travel, financial, and post-arrival support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {ADDON_SERVICES.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  id={item.id}
                  className="scroll-mt-36 p-7 rounded-3xl bg-white border border-slate-200/90 shadow-md hover:shadow-xl transition-all space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-lg text-slate-900">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {item.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 space-y-2 border-t border-slate-100">
                    {item.perks.map((perk, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-snug">{perk}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3">
                    <button
                      onClick={() => handleOpenConsultation('Canada')}
                      className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-blue-600 hover:text-white text-slate-700 font-bold text-xs border border-slate-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Inquire About {item.title.split('&')[0].trim()}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ── 5. Trust & Quality Standards Strip ── */}
      <section className="py-12 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block">
            Globally Certified Standards Across All Services
          </span>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-bold text-slate-600">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
              <ShieldCheck className="w-4 h-4 text-cyan-600" />
              <span>AIRC Accredited</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>ICEF Quality Certified</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>British Council Trained</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
              <Globe className="w-4 h-4 text-purple-600" />
              <span>Education New Zealand Recognized</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
              <GraduationCap className="w-4 h-4 text-amber-600" />
              <span>PIER QEAC Qualified</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Final Consultation CTA Banner ── */}
      <section className="py-16 sm:py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-r from-[#0E4DA4] via-[#125ec9] to-[#0A3D85] text-white p-8 sm:p-14 overflow-hidden shadow-2xl">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-3 max-w-2xl text-left">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-bold tracking-widest uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                  <span>CUSTOMIZED ROADMAP</span>
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                  Discuss Your Study or Career Plans Today
                </h2>
                <p className="text-blue-100 text-sm sm:text-base leading-relaxed max-w-xl">
                  Connect with our certified education counselors and corporate staffing team. We will evaluate your profile and craft a personalized action plan.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  onClick={() => handleOpenConsultation('Canada')}
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm sm:text-base shadow-xl hover:shadow-2xl transition-all cursor-pointer group"
                >
                  <span>Book Free Consultation</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Consultation Modal */}
      <ConsultationModal
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
        initialDestination={selectedDestination}
      />
    </div>
  );
}