'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Globe,
  Sparkles,
  ExternalLink,
  Loader2
} from 'lucide-react';
import PageHeader from '../../component/PageHeader';
import { pageHeaders } from '../../data/pageHeaders';
import { offices as defaultOffices } from '../../data/aboutData';
import { submitLead, fetchContactSettings } from '../../lib/api';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    destination: 'Canada',
    serviceType: 'Study Abroad',
    message: '',
  });

  // Dynamic Contact & Liaison Lounge Settings
  const [contactSettings, setContactSettings] = useState({
    headquarters: {
      title: 'Corporate Headquarters',
      subtitle: 'Downtown Dubai, UAE',
      address: 'Level 14, Boulevard Plaza Tower 1, Downtown Dubai, United Arab Emirates',
      phone: '+971 4 800 9821',
      email: 'info@ytcglobal.com',
      hours: 'Sun - Thu: 9:00 AM - 6:00 PM (GMT +4)',
      photo: '',
    },
    regionalLoungesTitle: 'Regional Liaison Lounges',
    regionalLounges: [
      {
        city: 'New Delhi',
        country: 'India',
        badge: 'Admissions Hub',
        address: 'Suite 402, Connaught Place, Inner Circle, New Delhi',
        phone: '+91 11 4987 6500',
        email: 'delhi@ytcglobal.com',
      },
      {
        city: 'London',
        country: 'United Kingdom',
        badge: 'Student Support',
        address: '88 Kingsway, Holborn, London WC2B 6AA',
        phone: '+44 20 7946 0912',
        email: 'london@ytcglobal.com',
      },
      {
        city: 'Toronto',
        country: 'Canada',
        badge: 'Post Arrival Hub',
        address: '250 University Avenue, Suite 200, Toronto, ON M5H 3E5',
        phone: '+1 416 555 0194',
        email: 'toronto@ytcglobal.com',
      },
    ],
  });

  useEffect(() => {
    let ignore = false;
    fetchContactSettings().then((data) => {
      if (!ignore && data) {
        setContactSettings((prev) => ({
          ...prev,
          ...data,
          headquarters: {
            ...prev.headquarters,
            ...(data.headquarters || {}),
          },
          regionalLounges: Array.isArray(data.regionalLounges) && data.regionalLounges.length > 0
            ? data.regionalLounges
            : prev.regionalLounges,
        }));
      }
    });
    return () => {
      ignore = true;
    };
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (apiError) setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check honeypot spam protection
    if (honeypot) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
      }, 1500);
      return;
    }

    // Client-side phone validation
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      setApiError('Please enter a valid phone number (10 to 15 digits).');
      return;
    }

    setIsLoading(true);
    setApiError('');

    const composedMessage = formData.serviceType
      ? `[Service: ${formData.serviceType}] ${formData.message}`.trim()
      : formData.message.trim();

    const result = await submitLead('contact', {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      country: formData.destination,
      message: composedMessage || undefined,
      website: honeypot,
    });

    setIsLoading(false);

    if (result.success) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          destination: 'Canada',
          serviceType: 'Study Abroad',
          message: '',
        });
        setHoneypot('');
      }, 3500);
    } else {
      setApiError(result.message || 'Something went wrong, please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F4F8FD] via-[#EDF4FC] to-[#F1F6FD] text-slate-900 overflow-x-hidden selection:bg-blue-600 selection:text-white">
      
      {/* ── 1. Reusable PageHeader (Variant: light, compact) ── */}
      <PageHeader
        variant="light"
        data={pageHeaders.contact}
      />

      {/* ── 2. Contact Form & Global Support Hub ── */}
      <section className="py-14 sm:py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* Left: Interactive Inquiry Form */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-7 sm:p-10 border border-slate-200/90 shadow-xl space-y-6">
              <div>
                <span className="text-xs font-bold tracking-wider text-blue-600 uppercase block mb-1">
                  DIRECT CONSULTATION
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Send Us a Message
                </h2>
                <p className="text-slate-500 text-xs sm:text-sm mt-1.5 leading-relaxed">
                  Fill in your details below and an authorized senior counselor will reach out within 24 business hours.
                </p>
              </div>

              {submitted ? (
                <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h3 className="text-lg font-bold text-emerald-900">Thank You!</h3>
                  <p className="text-xs sm:text-sm text-emerald-700">
                    Your message has been received. One of our counselors will contact you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Honeypot anti-spam field */}
                  <input
                    type="text"
                    name="website"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                    className="hidden"
                    aria-hidden="true"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-900 placeholder:text-slate-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-900 placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 555 123 4567"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-900 placeholder:text-slate-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Preferred Destination
                      </label>
                      <select
                        name="destination"
                        value={formData.destination}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-900"
                      >
                        <option value="USA">USA</option>
                        <option value="UK">UK</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                        <option value="Germany">Germany</option>
                        <option value="Ireland">Ireland</option>
                        <option value="New Zealand">New Zealand</option>
                        <option value="UAE">UAE</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Service of Interest
                    </label>
                    <select
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-900"
                    >
                      <option value="Study Abroad">Study Abroad Admissions & Visa</option>
                      <option value="Overseas Recruitment">Overseas Job & Recruitment</option>
                      <option value="IELTS Coaching">IELTS / Test Preparation</option>
                      <option value="Partnership Inquiry">Institutional Partnership</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Your Message / Academic Background
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your highest educational qualification, target degree, and questions..."
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-900 placeholder:text-slate-400 resize-none"
                    />
                  </div>

                  {apiError && (
                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm">
                      {apiError}
                    </div>
                  )}

                  <button
                    disabled={isLoading}
                    type="submit"
                    className={`w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 ${
                      isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting Request...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Consultation Request</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Right: Regional Contact Directory */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* ── Dynamic Corporate Headquarters Card ── */}
              <div className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-md space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-base text-slate-900 truncate">
                      {contactSettings.headquarters?.title || 'Corporate Headquarters'}
                    </h3>
                    <p className="text-xs text-slate-500 truncate">
                      {contactSettings.headquarters?.subtitle || 'Downtown Dubai, UAE'}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-xs sm:text-sm text-slate-600">
                  {contactSettings.headquarters?.address && (
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{contactSettings.headquarters.address}</span>
                    </div>
                  )}

                  {contactSettings.headquarters?.phone && (
                    <div className="flex items-center gap-2.5">
                      <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                      <a
                        href={`tel:${contactSettings.headquarters.phone.replace(/\s+/g, '')}`}
                        className="hover:text-blue-600 font-semibold transition-colors"
                      >
                        {contactSettings.headquarters.phone}
                      </a>
                    </div>
                  )}

                  {contactSettings.headquarters?.email && (
                    <div className="flex items-center gap-2.5">
                      <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                      <a
                        href={`mailto:${contactSettings.headquarters.email}`}
                        className="hover:text-blue-600 font-semibold transition-colors"
                      >
                        {contactSettings.headquarters.email}
                      </a>
                    </div>
                  )}

                  {contactSettings.headquarters?.hours && (
                    <div className="flex items-center gap-2.5 text-slate-500">
                      <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{contactSettings.headquarters.hours}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Dynamic Regional Liaison Lounges ── */}
              <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200/80 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                  {contactSettings.regionalLoungesTitle || 'Regional Liaison Lounges'}
                </h4>

                {(contactSettings.regionalLounges || []).map((off, idx) => {
                  const locationTitle = [off.city, off.country].filter(Boolean).join(', ') || 'Regional Office';
                  return (
                    <div key={idx} className="p-3.5 rounded-2xl bg-white border border-slate-200/80 space-y-1.5 text-xs shadow-2xs">
                      <div className="flex justify-between items-center gap-2">
                        <span className="font-bold text-slate-900 truncate">{locationTitle}</span>
                        {off.badge && (
                          <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded shrink-0">
                            {off.badge}
                          </span>
                        )}
                      </div>
                      {off.address && (
                        <p className="text-slate-500 leading-snug">{off.address}</p>
                      )}
                      {off.phone && (
                        <p className="pt-0.5">
                          <a
                            href={`tel:${off.phone.replace(/\s+/g, '')}`}
                            className="text-blue-600 font-medium hover:underline inline-flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3 inline-block" />
                            <span>{off.phone}</span>
                          </a>
                        </p>
                      )}
                      {off.email && (
                        <p>
                          <a
                            href={`mailto:${off.email}`}
                            className="text-slate-500 hover:text-blue-600 transition-colors inline-flex items-center gap-1"
                          >
                            <Mail className="w-3 h-3 inline-block text-slate-400" />
                            <span>{off.email}</span>
                          </a>
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
