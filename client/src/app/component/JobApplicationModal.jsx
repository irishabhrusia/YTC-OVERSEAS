'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CheckCircle2,
  Briefcase,
  Send,
  UploadCloud,
  FileText,
  Trash2,
  Loader2,
  ShieldCheck
} from 'lucide-react';
import {
  JOB_CATEGORIES,
  PREFERRED_COUNTRIES,
  EXPERIENCE_LEVELS
} from '../data/recruitmentFormOptions';
import { submitLead, submitJobApplication } from '../lib/api';

function JobApplicationDialog({ onClose, job = null }) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    currentCity: '',
    jobCategory: job?.category || '',
    preferredCountry: job?.country || '',
    yearsOfExperience: '',
    message: '',
  });

  const [cvFile, setCvFile] = useState(null);
  const [cvFileName, setCvFileName] = useState('');
  const [cvFileSize, setCvFileSize] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const modalRef = useRef(null);
  const fileInputRef = useRef(null);

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

  // Handle File Upload
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > MAX_SIZE) {
      setErrors((prev) => ({
        ...prev,
        cv: 'File size exceeds 5MB limit. Please upload a smaller file.',
      }));
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Check extension
    const validExtensions = ['.pdf', '.doc', '.docx'];
    const lowerName = file.name.toLowerCase();
    const isValidExtension = validExtensions.some((ext) => lowerName.endsWith(ext));

    if (!isValidExtension) {
      setErrors((prev) => ({
        ...prev,
        cv: 'Please upload a valid PDF or Word document (.pdf, .doc, .docx).',
      }));
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Clear CV error if valid
    setErrors((prev) => ({ ...prev, cv: '' }));
    setCvFile(file);
    setCvFileName(file.name);
    setCvFileSize((file.size / (1024 * 1024)).toFixed(2) + ' MB');
  };

  const handleRemoveFile = () => {
    setCvFile(null);
    setCvFileName('');
    setCvFileSize('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    setErrors((prev) => ({ ...prev, cv: '' }));
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone Number is required';
    } else {
      const phoneDigits = formData.phone.replace(/[^0-9]/g, '');
      if (phoneDigits.length < 7 || phoneDigits.length > 15) {
        newErrors.phone = 'Please enter a valid phone number (7-15 digits)';
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email Address is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    if (!formData.currentCity.trim()) {
      newErrors.currentCity = 'Current City is required';
    }

    if (!formData.jobCategory) {
      newErrors.jobCategory = 'Please select a job category';
    }

    if (!formData.preferredCountry) {
      newErrors.preferredCountry = 'Please select a preferred country';
    }

    if (!formData.yearsOfExperience) {
      newErrors.yearsOfExperience = 'Please select years of experience';
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

    // Map form fields to backend Application / Lead API fields
    const leadPayload = {
      name: formData.fullName.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim() || undefined,
      currentCity: formData.currentCity.trim(),
      jobCategory: formData.jobCategory || job?.category || undefined,
      preferredCountry: formData.preferredCountry || job?.country || undefined,
      experience: formData.yearsOfExperience,
      message: formData.message ? formData.message.trim() : undefined,
      job: job?._id || undefined,
      website: honeypot || undefined,
    };

    const result = await submitJobApplication(leadPayload, cvFile || null);

    setIsLoading(false);

    if (result.success) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          fullName: '',
          phone: '',
          email: '',
          currentCity: '',
          jobCategory: '',
          preferredCountry: '',
          yearsOfExperience: '',
          message: '',
        });
        setCvFile(null);
        setCvFileName('');
        setCvFileSize('');
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
        aria-labelledby="job-application-modal-title"
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
              Application Submitted!
            </h3>
            <p className="text-sm sm:text-base text-slate-600 max-w-sm mx-auto leading-relaxed">
              Thank you, our team will contact you soon.
            </p>
            <p className="text-xs text-slate-400">
              Our overseas recruitment desk reviews applications within 24–48 hours.
            </p>
          </motion.div>
        ) : (
          <div>
            {/* Header Section */}
            <div className="mb-6 pr-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold mb-2">
                <Briefcase className="w-3.5 h-3.5 text-orange-600" />
                <span>Overseas Career Application</span>
              </div>
              <h3
                id="job-application-modal-title"
                className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight"
              >
                {job?.title ? `Apply for ${job.title}` : 'Apply for Overseas Jobs'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Fill out the form below. Our recruitment talent scouts will match your profile with verified international employers.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Hidden Honeypot field for spam bots */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="job_website_hp">Leave this field blank</label>
                <input
                  type="text"
                  id="job_website_hp"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              {/* Row 1: Full Name & Current City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="e.g. Rahul Sharma"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                      errors.fullName
                        ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                        : 'border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100'
                    }`}
                  />
                  {errors.fullName && (
                    <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Current City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="currentCity"
                    placeholder="e.g. Mumbai, Dubai, London"
                    value={formData.currentCity}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                      errors.currentCity
                        ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                        : 'border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100'
                    }`}
                  />
                  {errors.currentCity && (
                    <p className="text-xs text-red-500 mt-1">{errors.currentCity}</p>
                  )}
                </div>
              </div>

              {/* Row 2: Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="e.g. rahul@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                      errors.email
                        ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                        : 'border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="e.g. +91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                      errors.phone
                        ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                        : 'border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100'
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Row 3: Job Category & Preferred Country */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Job Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="jobCategory"
                    value={formData.jobCategory}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none bg-white cursor-pointer transition-all ${
                      errors.jobCategory
                        ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                        : 'border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100'
                    }`}
                  >
                    <option value="">Select Category...</option>
                    {JOB_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {errors.jobCategory && (
                    <p className="text-xs text-red-500 mt-1">{errors.jobCategory}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Preferred Country <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="preferredCountry"
                    value={formData.preferredCountry}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none bg-white cursor-pointer transition-all ${
                      errors.preferredCountry
                        ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                        : 'border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100'
                    }`}
                  >
                    <option value="">Select Destination...</option>
                    {PREFERRED_COUNTRIES.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                  {errors.preferredCountry && (
                    <p className="text-xs text-red-500 mt-1">{errors.preferredCountry}</p>
                  )}
                </div>
              </div>

              {/* Row 4: Years of Experience */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Years of Experience <span className="text-red-500">*</span>
                </label>
                <select
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none bg-white cursor-pointer transition-all ${
                    errors.yearsOfExperience
                      ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                      : 'border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100'
                  }`}
                >
                  <option value="">Select Experience Level...</option>
                  {EXPERIENCE_LEVELS.map((exp) => (
                    <option key={exp} value={exp}>
                      {exp}
                    </option>
                  ))}
                </select>
                {errors.yearsOfExperience && (
                  <p className="text-xs text-red-500 mt-1">{errors.yearsOfExperience}</p>
                )}
              </div>

              {/* Row 5: CV Upload (Optional, PDF/DOC, max 5MB) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Upload CV / Resume <span className="text-slate-400 font-normal">(Optional — PDF or DOC, max 5MB)</span>
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  id="cv-upload-input"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {cvFile ? (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-orange-50 border border-orange-200 text-xs text-slate-800">
                    <div className="flex items-center gap-2 truncate pr-2">
                      <FileText className="w-4 h-4 text-orange-600 shrink-0" />
                      <span className="font-semibold truncate">{cvFileName}</span>
                      <span className="text-slate-500 text-[11px] shrink-0">({cvFileSize})</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      aria-label="Remove CV file"
                      className="p-1 rounded-lg hover:bg-orange-200/60 text-slate-600 hover:text-red-600 transition-colors cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="cv-upload-input"
                    className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 hover:border-orange-400 rounded-2xl bg-slate-50/70 hover:bg-orange-50/30 transition-all cursor-pointer text-center group"
                  >
                    <UploadCloud className="w-5 h-5 text-slate-400 group-hover:text-orange-500 transition-colors mb-1" />
                    <span className="text-xs font-semibold text-slate-700 group-hover:text-orange-600">
                      Click to browse or attach resume
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">
                      Supported formats: PDF, DOC, DOCX up to 5MB
                    </span>
                  </label>
                )}

                {errors.cv && (
                  <p className="text-xs text-red-500 mt-1">{errors.cv}</p>
                )}
              </div>

              {/* Row 6: Message (Optional) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Message / Specializations <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  name="message"
                  rows={2}
                  placeholder="Share your specific licenses, preferred job roles, or availability..."
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 text-sm outline-none transition-all resize-none"
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
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-[#FF7A18] via-[#FF6A00] to-[#FF4E00] hover:from-[#ff882b] hover:to-[#ff5c14] text-white font-bold text-sm shadow-md shadow-orange-500/25 transition-all cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting Application...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Job Application</span>
                    </>
                  )}
                </motion.button>
              </div>

              <p className="text-[11px] text-center text-slate-400 pt-1 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-500 inline" />
                <span>Strict confidentiality guaranteed. We never share your data without consent.</span>
              </p>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function JobApplicationModal({ isOpen, onClose, job = null }) {
  return (
    <AnimatePresence>
      {isOpen && <JobApplicationDialog onClose={onClose} job={job} />}
    </AnimatePresence>
  );
}
