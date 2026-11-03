'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, ShieldCheck, Send, Loader2 } from 'lucide-react';
import { submitLead } from '../../lib/api';

export default function ConsultationModal({ 
  isOpen, 
  onClose, 
  initialDestination = 'Canada',
  onSubmit 
}) {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    destination: initialDestination,
    course: 'Undergraduate'
  });
  const [prevDestination, setPrevDestination] = useState(initialDestination);

  if (prevDestination !== initialDestination) {
    setPrevDestination(initialDestination);
    if (initialDestination) {
      setFormData((prev) => ({ ...prev, destination: initialDestination }));
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check honeypot spam protection
    if (honeypot) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
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

    const result = await submitLead('consultation', {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      country: formData.destination,
      course: formData.course,
      website: honeypot,
    });

    setIsLoading(false);

    if (result.success) {
      if (onSubmit) {
        onSubmit(formData);
      }
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          destination: initialDestination,
          course: 'Undergraduate',
        });
        setHoneypot('');
        onClose();
      }, 2200);
    } else {
      setApiError(result.message || 'Something went wrong, please try again.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8 overflow-hidden"
          >
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              aria-label="Close modal"
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </motion.button>

            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10 space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto shadow-md shadow-green-500/20 animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900">Consultation Booked!</h3>
                <p className="text-sm text-slate-600 max-w-xs mx-auto leading-relaxed">
                  Thank you! An expert counselor from <span className="font-semibold text-blue-600">YTC Global Education</span> will reach out within 24 hours.
                </p>
              </motion.div>
            ) : (
              <div>
                <div className="mb-6">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold mb-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Free 1-on-1 Guidance Session</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Book Your Consultation
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Fill out the quick form below and speak with our global education experts.
                  </p>
                </div>

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

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (apiError) setApiError('');
                      }}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (apiError) setApiError('');
                        }}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        required
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={(e) => {
                          setFormData({ ...formData, phone: e.target.value });
                          if (apiError) setApiError('');
                        }}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Country</label>
                      <select
                        value={formData.destination}
                        onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm outline-none bg-white cursor-pointer transition-all"
                      >
                        <option value="Canada">Canada 🇨🇦</option>
                        <option value="UK">United Kingdom 🇬🇧</option>
                        <option value="Australia">Australia 🇦🇺</option>
                        <option value="USA">United States 🇺🇸</option>
                        <option value="Germany">Germany 🇩🇪</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Degree Level</label>
                      <select
                        value={formData.course}
                        onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm outline-none bg-white cursor-pointer transition-all"
                      >
                        <option value="Undergraduate">Bachelor&apos;s Degree</option>
                        <option value="Postgraduate">Master&apos;s Degree</option>
                        <option value="Diploma">Diploma / Certificate</option>
                        <option value="PhD">PhD / Doctorate</option>
                      </select>
                    </div>
                  </div>

                  {apiError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm">
                      {apiError}
                    </div>
                  )}

                  <div className="pt-2">
                    <motion.button
                      whileHover={!isLoading ? { scale: 1.02 } : {}}
                      whileTap={!isLoading ? { scale: 0.98 } : {}}
                      disabled={isLoading}
                      type="submit"
                      className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition-all ${
                        isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Request Free Call Now</span>
                        </>
                      )}
                    </motion.button>
                  </div>

                  <p className="text-[11px] text-center text-slate-400">
                    🔒 We respect your privacy. No spam guaranteed.
                  </p>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
