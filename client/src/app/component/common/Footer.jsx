'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Globe,
  Building2,
  Search,
  Compass,
  Video,
  ShieldCheck,
  CheckCircle2,
  Award,
  ArrowRight,
  Mail,
  Send,
  FileCheck,
  Users,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { subscribeNewsletter, fetchFooterSettings } from '../../lib/api';

const RECOGNITION_ICON_MAP = {
  ShieldCheck: { icon: ShieldCheck, color: 'text-cyan-400' },
  Award: { icon: Award, color: 'text-emerald-400' },
  CheckCircle2: { icon: CheckCircle2, color: 'text-blue-400' },
  Globe: { icon: Globe, color: 'text-purple-400' },
  GraduationCap: { icon: GraduationCap, color: 'text-amber-400' },
  Building2: { icon: Building2, color: 'text-indigo-400' },
};

export default function Footer() {
  const [email, setEmail] = useState('');
  const [interest, setInterest] = useState('all');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [feedbackError, setFeedbackError] = useState('');

  // Dynamic Footer Settings (Social links, Recognitions, Trust Badge)
  const [footerSettings, setFooterSettings] = useState({
    socialLinks: {
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com',
      youtube: 'https://youtube.com',
      twitter: 'https://x.com',
      whatsapp: '',
    },
    recognitions: [
      { name: 'AIRC Accredited', badge: 'Accredited', icon: 'ShieldCheck', url: 'https://www.airc.education' },
      { name: 'ICEF Quality Agent', badge: 'Certified', icon: 'Award', url: 'https://www.icef.com' },
      { name: 'British Council Trained', badge: 'Trained', icon: 'CheckCircle2', url: 'https://www.britishcouncil.org' },
      { name: 'Education New Zealand Recognized', badge: 'Recognized', icon: 'Globe', url: 'https://www.enz.govt.nz' },
      { name: 'PIER QEAC Certified', badge: 'Certified', icon: 'GraduationCap', url: 'https://pieronline.org' },
    ],
    agencyBadge: {
      title: 'AIRC & ICEF CERTIFIED',
      subtitle: 'Global Trusted Agency',
      url: '',
    },
    copyrightText: '© 2026 YTC Global Education. Developed with ❤️ by Goatlabs. All rights reserved.',
  });

  useEffect(() => {
    fetchFooterSettings().then((data) => {
      if (data) {
        setFooterSettings((prev) => ({
          ...prev,
          ...data,
          socialLinks: { ...prev.socialLinks, ...(data.socialLinks || {}) },
          agencyBadge: { ...prev.agencyBadge, ...(data.agencyBadge || {}) },
          recognitions: Array.isArray(data.recognitions) && data.recognitions.length > 0
            ? data.recognitions
            : prev.recognitions,
        }));
      }
    });
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || submitting) return;
    setSubmitting(true);
    setFeedbackError('');

    const res = await subscribeNewsletter({ email, interest });
    setSubmitting(false);

    if (res.success) {
      setIsSubscribed(true);
      setFeedbackMsg(res.message);
      setTimeout(() => {
        setEmail('');
        setIsSubscribed(false);
        setFeedbackMsg('');
      }, 5000);
    } else {
      setFeedbackError(res.message);
      setTimeout(() => setFeedbackError(''), 5000);
    }
  };

  return (
    <footer className="relative bg-[#0A111E] text-white overflow-hidden pt-12 sm:pt-16 pb-8 border-t border-slate-800/80">
      
      {/* Decorative ambient glowing radial gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-600/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── 1. Top Stay Updated / Newsletter Ribbon (KC Overseas Style) ── */}
        <div className="pb-14 border-b border-slate-800/80">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Stay updated with YTC Global Education
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm">
              Receive timely notifications on university application deadlines, intake dates, and exclusive international scholarship opportunities.
            </p>

            {isSubscribed ? (
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{feedbackMsg || 'Thank you for subscribing! Check your inbox for updates.'}</span>
              </div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-2xl mx-auto"
              >
                <div className="relative w-full sm:w-64">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    disabled={submitting}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your Email ID"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium shadow-xs disabled:opacity-70"
                  />
                </div>

                <div className="w-full sm:w-56">
                  <select
                    value={interest}
                    disabled={submitting}
                    onChange={(e) => setInterest(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium cursor-pointer shadow-xs disabled:opacity-70"
                  >
                    <option value="all">I&apos;m Interested in...</option>
                    <option value="usa">Study in USA</option>
                    <option value="uk">Study in UK</option>
                    <option value="canada">Study in Canada</option>
                    <option value="australia">Study in Australia</option>
                    <option value="germany">Study in Germany</option>
                    <option value="ireland">Study in Ireland</option>
                    <option value="new-zealand">Study in New Zealand</option>
                    <option value="uae">Study in UAE</option>
                    <option value="recruitment">Overseas Recruitment &amp; Jobs</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-[#FF7A18] via-[#FF6A00] to-[#FF4E00] hover:from-[#ff882b] hover:to-[#ff5c14] text-white font-bold text-sm shadow-lg shadow-orange-600/30 transition-all cursor-pointer whitespace-nowrap group shrink-0 disabled:opacity-75"
                >
                  <span className="flex items-center justify-center gap-1.5">
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Subscribing...</span>
                      </>
                    ) : (
                      <>
                        <span>Subscribe Now</span>
                        <Send className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                      </>
                    )}
                  </span>
                </button>
              </form>
            )}

            {feedbackError && (
              <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{feedbackError}</span>
              </div>
            )}
          </div>
        </div>

        {/* ── 2. Main 4-Column Footer Navigation ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 py-14 border-b border-slate-800/80 text-left">
          
          {/* Column 1: Brand & Certification (3 cols) */}
          <div className="lg:col-span-3 space-y-5">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <img
                src="/images/logo.png"
                alt="YTC Global Education Logo"
                className="h-14 sm:h-16 w-auto object-contain rounded-2xl bg-white p-2 shadow-md border border-white/10 hover:shadow-lg transition-transform group-hover:scale-105"
              />
              <div className="flex flex-col">
                <span className="font-black text-xl tracking-tight text-white group-hover:text-blue-400 transition-colors">
                  YTC Global
                </span>
                <span className="text-[10px] tracking-widest font-bold text-slate-400 uppercase">
                  Education &amp; Careers
                </span>
              </div>
            </Link>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                About YTC Global
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                We are a premier international education and cross-border recruitment consultancy facilitating global pathways across 8 leading destinations with certified counselors and vetted partner institutions.
              </p>
            </div>

            {/* Certification / Trust Badge (Dynamic) */}
            <div className="pt-2">
              <div className="inline-flex items-center gap-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 max-w-full">
                <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-400/30 flex items-center justify-center text-cyan-400 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400 block leading-tight">
                    {footerSettings.agencyBadge?.title || 'AIRC & ICEF CERTIFIED'}
                  </span>
                  <span className="text-xs font-semibold text-slate-300 block">
                    {footerSettings.agencyBadge?.subtitle || 'Global Trusted Agency'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Company Links (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <li>
                <Link href="/about" className="hover:text-white transition-colors block">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/about#history" className="hover:text-white transition-colors flex items-center gap-2">
                  <span>Our History</span>
                  <span className="px-1.5 py-0.2 rounded-sm text-[9px] font-bold bg-blue-600 text-white uppercase">
                    10+ Yrs
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/about#leadership" className="hover:text-white transition-colors block">
                  Leadership Team
                </Link>
              </li>
              <li>
                <Link href="/about#recognitions" className="hover:text-white transition-colors block">
                  Accreditations &amp; Recognitions
                </Link>
              </li>
              <li>
                <Link href="/about#partner" className="hover:text-white transition-colors block">
                  Partner With Us
                </Link>
              </li>
              <li>
                <Link href="/about#offices" className="hover:text-white transition-colors block">
                  Our Global Offices
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors block">
                  Blog &amp; Insights
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors block">
                  Contact Us
                </Link>
              </li>
            </ul>

            <div className="pt-3 border-t border-slate-800/60 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Quick Access
              </span>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
                <li>
                  <Link href="/partner-universities" className="hover:text-blue-400 transition-colors flex items-center gap-1.5 font-semibold text-slate-300">
                    <Search className="w-3.5 h-3.5 text-blue-400" />
                    <span>Search Universities</span>
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-blue-400 transition-colors flex items-center gap-1.5 font-semibold text-slate-300">
                    <Video className="w-3.5 h-3.5 text-blue-400" />
                    <span>Book Online Counselling</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 3: Services in our project (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200">
              Services for Students
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <li>
                <Link href="/services#university-selection" className="hover:text-white transition-colors block">
                  University Selection &amp; Application
                </Link>
              </li>
              <li>
                <Link href="/services#visa-guidance" className="hover:text-white transition-colors block">
                  Visa Guidance &amp; Documentation
                </Link>
              </li>
              <li>
                <Link href="/services#ielts-preparation" className="hover:text-white transition-colors block">
                  IELTS / Language Test Preparation
                </Link>
              </li>
              <li>
                <Link href="/services#accommodation-assistance" className="hover:text-white transition-colors block">
                  Accommodation Assistance
                </Link>
              </li>
              <li>
                <Link href="/partner-universities" className="hover:text-white transition-colors block">
                  Search Partner Universities
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-blue-400 text-blue-400 font-semibold transition-colors flex items-center gap-1">
                  <span>Explore All Services</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>

            <div className="pt-3 border-t border-slate-800/60 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Services for Enterprises &amp; Recruitment
              </span>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
                <li>
                  <Link href="/services#overseas-recruitment" className="hover:text-white transition-colors block">
                    Overseas Recruitment Solutions
                  </Link>
                </li>
                <li>
                  <Link href="/services#talent-sourcing" className="hover:text-white transition-colors block">
                    Talent Sourcing &amp; Screening
                  </Link>
                </li>
                <li>
                  <Link href="/services#employer-partnerships" className="hover:text-white transition-colors block">
                    Employer &amp; Institute Partnerships
                  </Link>
                </li>
                <li>
                  <Link href="/overseas-recruitment" className="hover:text-white transition-colors block">
                    Global Recruitment Wing
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 4: Study Destinations in our project (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200">
              Study Destinations
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <li>
                <Link href="/study-abroad/usa" className="hover:text-white transition-colors flex items-center gap-2">
                  <span>🇺🇸</span>
                  <span>United States</span>
                </Link>
              </li>
              <li>
                <Link href="/study-abroad/uk" className="hover:text-white transition-colors flex items-center gap-2">
                  <span>🇬🇧</span>
                  <span>United Kingdom</span>
                </Link>
              </li>
              <li>
                <Link href="/study-abroad/canada" className="hover:text-white transition-colors flex items-center gap-2">
                  <span>🇨🇦</span>
                  <span>Canada</span>
                </Link>
              </li>
              <li>
                <Link href="/study-abroad/australia" className="hover:text-white transition-colors flex items-center gap-2">
                  <span>🇦🇺</span>
                  <span>Australia</span>
                </Link>
              </li>
              <li>
                <Link href="/study-abroad/germany" className="hover:text-white transition-colors flex items-center gap-2">
                  <span>🇩🇪</span>
                  <span>Germany</span>
                </Link>
              </li>
              <li>
                <Link href="/study-abroad/ireland" className="hover:text-white transition-colors flex items-center gap-2">
                  <span>🇮🇪</span>
                  <span>Ireland</span>
                </Link>
              </li>
              <li>
                <Link href="/study-abroad/new-zealand" className="hover:text-white transition-colors flex items-center gap-2">
                  <span>🇳🇿</span>
                  <span>New Zealand</span>
                </Link>
              </li>
              <li>
                <Link href="/study-abroad/uae" className="hover:text-white transition-colors flex items-center gap-2">
                  <span>🇦🇪</span>
                  <span>United Arab Emirates</span>
                </Link>
              </li>
            </ul>

            <div className="pt-3 border-t border-slate-800/60 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Destination Portals
              </span>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
                <li>
                  <Link href="/destinations" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-blue-400" />
                    <span>Destination-wise Listing</span>
                  </Link>
                </li>
                <li>
                  <Link href="/partner-universities" className="hover:text-white transition-colors flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                    <span>Partner Universities Portal</span>
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-slate-400" />
                    <span>Book Online Counselling</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* ── 3. Industry Recognitions Strip (Dynamic) ── */}
        {Array.isArray(footerSettings.recognitions) && footerSettings.recognitions.length > 0 && (
          <div className="py-8 border-b border-slate-800/80">
            <div className="text-center space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block">
                Industry Recognitions &amp; Certifications
              </span>
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs font-bold text-slate-400">
                {footerSettings.recognitions.map((rec, idx) => {
                  const iconConfig = RECOGNITION_ICON_MAP[rec.icon] || RECOGNITION_ICON_MAP.ShieldCheck;
                  const IconComp = iconConfig.icon;
                  const colorClass = iconConfig.color;

                  if (rec.url) {
                    return (
                      <a
                        key={idx}
                        href={rec.url}
                        target="_blank"
                        rel="noreferrer"
                        title={`Verify accreditation: ${rec.name}`}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-blue-500/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-all group"
                      >
                        <IconComp className={`w-4 h-4 ${colorClass} group-hover:scale-110 transition-transform`} />
                        <span>{rec.name}</span>
                        {rec.badge && (
                          <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                            {rec.badge}
                          </span>
                        )}
                      </a>
                    );
                  }

                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800"
                    >
                      <IconComp className={`w-4 h-4 ${colorClass}`} />
                      <span>{rec.name}</span>
                      {rec.badge && (
                        <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          {rec.badge}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── 4. Bottom Bar: Copyright, Socials & Project Links ── */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-5 text-xs text-slate-400">
          <p className="text-center md:text-left">
            {footerSettings.copyrightText || (
              <>
                &copy; 2026 YTC Global Education. Developed with ❤️ by{' '}
                <span className="text-slate-200 font-semibold">Goatlabs</span>. All rights reserved.
              </>
            )}
          </p>

          {/* Social Icons (Dynamic) */}
          <div className="flex items-center gap-3">
            {footerSettings.socialLinks?.facebook && (
              <a 
                href={footerSettings.socialLinks.facebook} 
                target="_blank" 
                rel="noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-slate-900 hover:bg-blue-600 text-slate-400 hover:text-white flex items-center justify-center border border-slate-800 transition-all hover:scale-110"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
            )}
            {footerSettings.socialLinks?.instagram && (
              <a 
                href={footerSettings.socialLinks.instagram} 
                target="_blank" 
                rel="noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-slate-900 hover:bg-pink-600 text-slate-400 hover:text-white flex items-center justify-center border border-slate-800 transition-all hover:scale-110"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            )}
            {footerSettings.socialLinks?.linkedin && (
              <a 
                href={footerSettings.socialLinks.linkedin} 
                target="_blank" 
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-full bg-slate-900 hover:bg-blue-500 text-slate-400 hover:text-white flex items-center justify-center border border-slate-800 transition-all hover:scale-110"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            )}
            {footerSettings.socialLinks?.youtube && (
              <a 
                href={footerSettings.socialLinks.youtube} 
                target="_blank" 
                rel="noreferrer"
                aria-label="YouTube"
                className="w-8 h-8 rounded-full bg-slate-900 hover:bg-red-600 text-slate-400 hover:text-white flex items-center justify-center border border-slate-800 transition-all hover:scale-110"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            )}
            {footerSettings.socialLinks?.twitter && (
              <a 
                href={footerSettings.socialLinks.twitter} 
                target="_blank" 
                rel="noreferrer"
                aria-label="X (Twitter)"
                className="w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center border border-slate-800 transition-all hover:scale-110"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            )}
            {footerSettings.socialLinks?.whatsapp && (
              <a 
                href={footerSettings.socialLinks.whatsapp.startsWith('http') ? footerSettings.socialLinks.whatsapp : `https://wa.me/${footerSettings.socialLinks.whatsapp.replace(/[^0-9]/g, '')}`} 
                target="_blank" 
                rel="noreferrer"
                aria-label="WhatsApp"
                className="w-8 h-8 rounded-full bg-slate-900 hover:bg-emerald-600 text-slate-400 hover:text-white flex items-center justify-center border border-slate-800 transition-all hover:scale-110"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.299.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.144.39-.086s1.011.477 1.184.564.289.13.332.202c.043.073.043.419-.101.824z" />
                </svg>
              </a>
            )}
          </div>

          {/* Project Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <Link href="/about" className="hover:text-slate-200 transition-colors">
              About YTC
            </Link>
            <Link href="/services" className="hover:text-slate-200 transition-colors">
              All Services
            </Link>
            <Link href="/destinations" className="hover:text-slate-200 transition-colors">
              Study Destinations
            </Link>
            <Link href="/partner-universities" className="hover:text-slate-200 transition-colors">
              Partner Universities
            </Link>
            <Link href="/contact" className="hover:text-slate-200 transition-colors">
              Contact &amp; Support
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}