'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Briefcase,
  ShieldCheck,
  Building2,
  Users,
  CheckCircle2,
  ArrowRight,
  Globe,
  Award,
  Sparkles,
  PhoneCall,
  Clock,
  MapPin,
  DollarSign
} from 'lucide-react';
import PageHeader from '../../component/PageHeader';
import { pageHeaders } from '../../data/pageHeaders';
import JobApplicationModal from '../../component/JobApplicationModal';
import EmployerInquiryModal from '../../component/EmployerInquiryModal';
import { fetchJobs } from '../../lib/api';

const SECTORS = [
  {
    title: 'Healthcare & Nursing',
    desc: 'Registered nurses, care assistants, medical lab technicians, and healthcare support for UK NHS and UAE hospitals.',
    demand: 'Critical Demand',
    countries: ['United Kingdom', 'UAE', 'Germany'],
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Information Technology & Software',
    desc: 'Cloud engineers, full-stack developers, cybersecurity specialists, and DevOps architects for European tech hubs.',
    demand: 'High Demand',
    countries: ['Germany', 'Ireland', 'UK', 'UAE'],
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Hospitality & Culinary Arts',
    desc: 'Executive chefs, F&B managers, guest service leaders, and luxury hotel personnel across Dubai and Gulf luxury resorts.',
    demand: 'Continuous Hiring',
    countries: ['UAE', 'Qatar', 'Saudi Arabia'],
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Engineering & Construction',
    desc: 'Civil, mechanical, MEP engineers, project managers, and heavy equipment supervisors for multi-million dollar infrastructure.',
    demand: 'High Demand',
    countries: ['UAE', 'Oman', 'Bahrain'],
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80',
  },
];

const RECRUITMENT_STEPS = [
  {
    step: '01',
    title: 'Profile Screening & Assessment',
    desc: 'Submit your resume, certifications, and experience letters for technical credential verification.',
  },
  {
    step: '02',
    title: 'Employer Interview & Shortlisting',
    desc: 'Participate in structured virtual interviews with vetted multinational corporate employers.',
  },
  {
    step: '03',
    title: 'Official Offer & Contract Issuance',
    desc: 'Receive transparent employment contracts adhering strictly to Ministry of Labor standards.',
  },
  {
    step: '04',
    title: 'Work Visa & Deployment',
    desc: 'Complete medical testing, police clearance, and embassy visa stamping with our expedited support.',
  },
];

export default function OverseasRecruitmentPage() {
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isEmployerModalOpen, setIsEmployerModalOpen] = useState(false);
  const [liveJobs, setLiveJobs] = useState([]);

  useEffect(() => {
    let ignore = false;
    fetchJobs().then((data) => {
      if (!ignore && Array.isArray(data) && data.length > 0) {
        setLiveJobs(data);
      }
    });
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F4F8FD] via-[#EDF4FC] to-[#F1F6FD] text-slate-900 overflow-x-hidden selection:bg-orange-500 selection:text-white">
      
      {/* ── 1. Reusable PageHeader (Variant: split with photo & warm orange accent) ── */}
      <PageHeader
        variant="split"
        data={pageHeaders['overseas-recruitment']}
        onApplyJobs={() => {
          setSelectedJob(null);
          setIsJobModalOpen(true);
        }}
        onEmployerInquiry={() => setIsEmployerModalOpen(true)}
      />

      {/* ── 2. Active International Job Openings (Dynamic from Backend CMS) ── */}
      {liveJobs.length > 0 && (
        <section className="py-12 sm:py-16 bg-white border-b border-slate-200/60 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <span className="text-xs font-bold tracking-wider text-orange-600 uppercase block mb-1">
                  CURRENT VACANCIES
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Active Overseas Job Openings
                </h2>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">
                  Verified job positions currently accepting CVs and candidate profiles
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedJob(null);
                  setIsJobModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs shadow-md transition-all self-start sm:self-auto cursor-pointer"
              >
                <span>Upload General CV</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveJobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-slate-50/80 rounded-2xl border border-slate-200/90 p-5 hover:bg-white hover:shadow-lg hover:border-orange-300 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-full uppercase">
                        {job.category || 'General'}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {job.type ? job.type.replace('_', ' ') : 'Full Time'}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-slate-900 group-hover:text-orange-600 transition-colors">
                      {job.title}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>

                    <div className="pt-2 space-y-1.5 text-xs text-slate-600">
                      {(job.location || job.country) && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{[job.location, job.country].filter(Boolean).join(', ')}</span>
                        </div>
                      )}
                      {job.salaryRange && (
                        <div className="flex items-center gap-2 text-emerald-600 font-semibold">
                          <DollarSign className="w-3.5 h-3.5" />
                          <span>{job.salaryRange}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-200/60 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Direct Employer Tie-up</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedJob(job);
                        setIsJobModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 cursor-pointer"
                    >
                      <span>Apply Now</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 3. Verified Job Sectors ── */}
      <section className="py-16 sm:py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold tracking-wider text-orange-600 uppercase block mb-1">
              HIGH-DEMAND DOMAINS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Featured Global Employment Sectors
            </h2>
            <p className="text-slate-500 text-sm sm:text-base mt-2">
              Browse industry disciplines where we partner with recognized employers for direct hiring.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {SECTORS.map((sec, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                whileHover={{ y: -6 }}
                className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:border-orange-300 transition-all flex flex-col sm:flex-row group"
              >
                <div className="relative sm:w-2/5 h-48 sm:h-auto overflow-hidden bg-slate-100 shrink-0">
                  <img
                    src={sec.image}
                    alt={sec.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-orange-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-md">
                    {sec.demand}
                  </div>
                </div>

                <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                  <div>
                    <h3 className="font-bold text-xl text-slate-900 group-hover:text-orange-600 transition-colors">
                      {sec.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      {sec.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Target Countries
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {sec.countries.map((c, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ── 3. Step-by-Step Recruitment Process ── */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-[#EDF4FC] via-[#F4F8FD] to-[#E9F2FC] border-y border-slate-200/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold tracking-wider text-orange-600 uppercase block mb-1">
              ETHICAL & TRANSPARENT
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Our 4-Step Recruitment Journey
            </h2>
            <p className="text-slate-500 text-sm sm:text-base mt-2">
              Structured hiring workflows ensuring full compliance with international labor laws.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {RECRUITMENT_STEPS.map((s, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <span className="text-3xl font-black text-orange-500 group-hover:scale-110 transition-transform block">
                    {s.step}
                  </span>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-orange-600 transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {s.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-emerald-600">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Procedure</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── 4. Final Consultation / Application CTA ── */}
      <section className="py-16 sm:py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-8 sm:p-14 overflow-hidden shadow-2xl border border-slate-700">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-3 max-w-2xl text-left">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-bold tracking-widest uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                  <span>DIRECT INTERNATIONAL CAREERS</span>
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                  Take the Next Leap in Your Professional Journey
                </h2>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
                  Register with our overseas recruitment desk today. Our talent scouts review your CV and match your skills to active vacancies worldwide.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedJob(null);
                    setIsJobModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-[#FF7A18] via-[#FF6A00] to-[#FF4E00] hover:from-[#ff882b] hover:to-[#ff5c14] text-white font-bold text-sm sm:text-base shadow-xl shadow-orange-600/35 transition-all cursor-pointer group"
                >
                  <span>Submit Your Profile</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm sm:text-base border border-white/25 backdrop-blur-md transition-all"
                >
                  <span>Contact Recruitment Desk</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Job Application Modal ── */}
      <JobApplicationModal
        isOpen={isJobModalOpen}
        job={selectedJob}
        onClose={() => {
          setIsJobModalOpen(false);
          setSelectedJob(null);
        }}
      />

      {/* ── 6. Employer Inquiry Modal ── */}
      <EmployerInquiryModal
        isOpen={isEmployerModalOpen}
        onClose={() => setIsEmployerModalOpen(false)}
      />

    </div>
  );
}
