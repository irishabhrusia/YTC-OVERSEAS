'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CheckCircle2,
  Building2,
  Send,
  Loader2,
  ShieldCheck
} from 'lucide-react';
import {
  EMPLOYER_COUNTRIES,
  WORKER_COUNT_OPTIONS
} from '../data/recruitmentFormOptions';
import { submitLead } from '../lib/api';

function EmployerInquiryDialog({ onClose }) {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    country: '',
    positionsNeeded: '',
    numberOfWorkers: '',
    message: '',
  });

  const [honeypot, setHoneypot] = useState('');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const modalRef = useRef(null);

  // Lock body scroll while modal is mounted
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Focus trap for accessibility
  useEffect(() => {
    const modalElement = modalRef.current;
    if (!modalElement) return;

    const focusableSelector =
      'button:not([disabled]), [href], input:not([type="hidden"]):not([disabled]):not([tabindex="-1"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const focusableElements = modalElement.querySelectorAll(focusableSelector);
    if (!focusableElements.length) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Auto focus first interactive element
    const initialFocusTimer = setTimeout(() => {
      const firstInput = modalElement.querySelector('input:not([type="hidden"]):not([disabled])');
      if (firstInput) {
        firstInput.focus();
      } else if (firstElement) {
        firstElement.focus();
      }
    }, 50);

    const handleTab = (e) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    modalElement.addEventListener('keydown', handleTab);
    return () => {
      clearTimeout(initialFocusTimer);
      modalElement.removeEventListener('keydown', handleTab);
    };
  }, []);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company Name is required';
    }

    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = 'Contact Person name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Work email address is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone Number is required';
    } else {
      const phoneDigits = formData.phone.replace(/[^0-9]/g, '');
      if (phoneDigits.length < 7 || phoneDigits.length > 15) {
        newErrors.phone = 'Please enter a valid phone number (7-15 digits)';
      }
    }

    if (!formData.country) {
      newErrors.country = 'Company country/location is required';
    }

    if (!formData.positionsNeeded.trim()) {
      newErrors.positionsNeeded = 'Please specify the positions needed';
    }

    if (!formData.numberOfWorkers) {
      newErrors.numberOfWorkers = 'Please select the number of workers needed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
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

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setApiError('');

    // Map fields strictly to backend Lead API schema
    const leadPayload = {
      name: formData.contactPerson.trim(),
      companyName: formData.companyName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      country: formData.country.trim(),
      positionsNeeded: formData.positionsNeeded.trim(),
      workersCount: formData.numberOfWorkers,
      message: formData.message ? formData.message.trim() : undefined,
      website: honeypot || undefined,
    };

    const result = await submitLead('employer_inquiry', leadPayload);

    setIsLoading(false);

    if (result.success) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          companyName: '',
          contactPerson: '',
          email: '',
          phone: '',
          country: '',
          positionsNeeded: '',
          numberOfWorkers: '',
          message: '',
        });
        setHoneypot('');
        onClose();
      }, 2400);
    } else {
      setApiError(result.message || 'Something went wrong, please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 sm:py-6 overflow-y-auto">
      {/* Backdrop Blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm cursor-pointer"
      />

      {/* Modal Container */}
      <motion.div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="employer-inquiry-modal-title"
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="relative z-10 w-full max-w-xl max-h-[92vh] bg-white rounded-3xl shadow-2xl border border-slate-100 p-5 sm:p-8 overflow-y-auto my-auto text-left"
      >
        {/* Close Button */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </motion.button>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-10 sm:py-14 space-y-4"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20 animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Inquiry Received!
            </h3>
            <p className="text-sm sm:text-base text-slate-600 max-w-sm mx-auto leading-relaxed">
              Thank you, our team will contact you soon.
            </p>
            <p className="text-xs text-slate-400">
              Our enterprise talent acquisition manager will review your hiring requirements shortly.
            </p>
          </motion.div>
        ) : (
          <div>
            {/* Header Section */}
            <div className="mb-6 pr-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold mb-2">
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Employer Hiring Solutions</span>
              </div>
              <h3
                id="employer-inquiry-modal-title"
                className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight"
              >
                Employer Workforce Inquiry
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Connect with our global manpower deployment team to hire pre-screened professionals for your projects.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Hidden Honeypot field for spam bots */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="emp_website_hp">Leave this field blank</label>
                <input
                  type="text"
                  id="emp_website_hp"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              {/* Row 1: Company Name & Contact Person */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    placeholder="e.g. Apex Health Group"
                    value={formData.companyName}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                      errors.companyName
                        ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                        : 'border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                    }`}
                  />
                  {errors.companyName && (
                    <p className="text-xs text-red-500 mt-1">{errors.companyName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Contact Person <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    placeholder="e.g. Sarah Jenkins (HR Director)"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                      errors.contactPerson
                        ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                        : 'border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                    }`}
                  />
                  {errors.contactPerson && (
                    <p className="text-xs text-red-500 mt-1">{errors.contactPerson}</p>
                  )}
                </div>
              </div>

              {/* Row 2: Work Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Work Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="e.g. hr@apexhealth.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                      errors.email
                        ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                        : 'border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone / WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="e.g. +971 50 123 4567"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                      errors.phone
                        ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                        : 'border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Row 3: Country Location & Number of Workers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Company Country / Base <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none bg-white cursor-pointer transition-all ${
                      errors.country
                        ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                        : 'border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                    }`}
                  >
                    <option value="">Select Country...</option>
                    {EMPLOYER_COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  {errors.country && (
                    <p className="text-xs text-red-500 mt-1">{errors.country}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Number of Workers <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="numberOfWorkers"
                    value={formData.numberOfWorkers}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none bg-white cursor-pointer transition-all ${
                      errors.numberOfWorkers
                        ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                        : 'border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                    }`}
                  >
                    <option value="">Select Quantity...</option>
                    {WORKER_COUNT_OPTIONS.map((count) => (
                      <option key={count} value={count}>
                        {count}
                      </option>
                    ))}
                  </select>
                  {errors.numberOfWorkers && (
                    <p className="text-xs text-red-500 mt-1">{errors.numberOfWorkers}</p>
                  )}
                </div>
              </div>

              {/* Row 4: Positions Needed */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Positions Needed <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="positionsNeeded"
                  placeholder="e.g. Registered ICU Nurses, Heavy Equipment Operators, DevOps Specialists"
                  value={formData.positionsNeeded}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                    errors.positionsNeeded
                      ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                      : 'border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                  }`}
                />
                {errors.positionsNeeded && (
                  <p className="text-xs text-red-500 mt-1">{errors.positionsNeeded}</p>
                )}
              </div>

              {/* Row 5: Message */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Hiring Details / Project Timeline <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  name="message"
                  rows={3}
                  placeholder="Share salary brackets, visa quota availability, required certifications, or intended deployment start date..."
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm outline-none transition-all resize-none"
                />
              </div>

              {/* API Error Display */}
              {apiError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm">
                  {apiError}
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <motion.button
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition-all cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting Inquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Employer Inquiry</span>
                    </>
                  )}
                </motion.button>
              </div>

              <p className="text-[11px] text-center text-slate-400 pt-1 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3 text-blue-500 inline" />
                <span>Compliant with international recruitment regulations &amp; MEA standards.</span>
              </p>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function EmployerInquiryModal({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && <EmployerInquiryDialog onClose={onClose} />}
    </AnimatePresence>
  );
}
