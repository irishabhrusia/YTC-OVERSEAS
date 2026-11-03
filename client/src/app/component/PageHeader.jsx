'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ChevronRight,
  ArrowRight,
  Sparkles,
  Search,
  Building2,
  Calendar,
  CreditCard,
  Clock,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Filter,
  Globe
} from 'lucide-react';

export default function PageHeader({
  variant = 'light',
  data = {},
  onOpenConsultation,
  onApplyJobs,
  onEmployerInquiry,
  // Optional search bar props for search variants
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search...',
  filterOptions = [],
  activeFilter = 'all',
  onFilterChange,
  children,
}) {
  const {
    breadcrumbs = [],
    badge,
    title,
    description,
    image,
    imageAlt = 'Page Header Image',
    accentColor,
    accentBg,
    accentText,
    accentBorder,
    // For country / landmark variant
    heroImage,
    heroAlt,
    flagPath,
    flagEmoji,
    countryName,
    quickFacts,
    primaryBtnText,
    secondaryBtnText,
    secondaryBtnHref,
    chips = [],
  } = data;

  // Track image load error to gracefully show dark neutral fallback
  const [imgError, setImgError] = React.useState(false);
  const [prevHeroImage, setPrevHeroImage] = React.useState(heroImage);

  if (prevHeroImage !== heroImage) {
    setPrevHeroImage(heroImage);
    setImgError(false);
  }

  // Render breadcrumbs
  const renderBreadcrumbs = (isDark = false, customAccent) => {
    if (!breadcrumbs || breadcrumbs.length === 0) return null;
    return (
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <li key={idx} className="flex items-center gap-1.5">
                {idx > 0 && (
                  <ChevronRight
                    className={`w-3.5 h-3.5 ${
                      isDark ? 'text-white/40' : 'text-slate-400'
                    }`}
                  />
                )}
                {isLast ? (
                  <span
                    className={`font-semibold ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                    style={customAccent ? { color: customAccent } : undefined}
                  >
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href || '/'}
                    className={`transition-colors ${
                      isDark
                        ? 'text-white/70 hover:text-white'
                        : 'text-slate-500 hover:text-blue-600'
                    }`}
                  >
                    {crumb.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  };

  // ════════════════════════════════════════════════════════════════════
  // VARIANT 1: FLAG HEADER (Study Abroad Country Pages)
  // ════════════════════════════════════════════════════════════════════
  if (variant === 'flag') {
    return (
      <header className="relative w-full min-h-[520px] lg:min-h-[580px] bg-slate-950 text-white overflow-hidden flex items-center">
        {/* Full-width Landmark Photo Background with dark neutral fallback */}
        <div className="absolute inset-0 z-0">
          {heroImage && !imgError ? (
            <Image
              src={heroImage}
              alt={heroAlt || `${countryName || 'Country'} Landmark`}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
              onError={() => setImgError(true)}
            />
          ) : (
            /* Dark neutral gradient fallback (neutral slate/zinc, not bright blue) */
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-950">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(51,65,85,0.35),transparent_70%)] pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(30,41,59,0.45),transparent_65%)] pointer-events-none" />
            </div>
          )}

          {/* Dark overlay: ~50% black over the photo, with a slightly darker area on the left where the text sits.
              The landmark must stay clearly visible and recognisable, especially on the right side. */}
          <div className="absolute inset-0 bg-black/50" />

          {/* Directional gradient on desktop: darker on the left for text readability, fading to transparent on the right */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent hidden lg:block" />

          {/* Mobile overlay: stronger dark overlay across the entire view so text pops */}
          <div className="absolute inset-0 bg-black/60 lg:hidden" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 w-full">
          {renderBreadcrumbs(true, accentColor)}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Details & Headings */}
            <div className="lg:col-span-7 space-y-5 text-left">
              
              {/* Badge with Country Theme Color */}
              {badge && (
                <div
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border text-xs sm:text-sm font-bold tracking-wide shadow-lg"
                  style={{ borderColor: accentColor || 'rgba(255,255,255,0.2)' }}
                >
                  {flagEmoji && <span className="text-base leading-none">{flagEmoji}</span>}
                  <span>{badge}</span>
                </div>
              )}

              {/* Single H1 Title */}
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]">
                  {title}
                </h1>
                {/* Thin Flag Accent Underline */}
                <div
                  className="h-1.5 w-24 rounded-full mt-3.5"
                  style={{ backgroundColor: accentColor || '#2563EB' }}
                />
              </div>

              {/* Description */}
              <p className="text-slate-200 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl font-normal drop-shadow-xs">
                {description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onOpenConsultation?.(countryName)}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#FF7A18] via-[#FF6A00] to-[#FF4E00] hover:from-[#ff882b] hover:to-[#ff5c14] text-white font-bold text-sm sm:text-base shadow-xl shadow-orange-600/35 transition-all cursor-pointer group"
                >
                  <span>{primaryBtnText || 'Book Free Consultation'}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>

                {secondaryBtnHref && (
                  <a
                    href={secondaryBtnHref}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-sm sm:text-base border border-white/30 backdrop-blur-md transition-all shadow-sm"
                  >
                    <span>{secondaryBtnText || 'Explore Universities'}</span>
                  </a>
                )}
              </div>
            </div>

            {/* Right Column: Glassmorphic Quick Facts Card */}
            {quickFacts && (
              <div className="lg:col-span-5">
                <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-3.5 text-white text-left">
                  <div className="flex items-center justify-between pb-3 border-b border-white/15">
                    <h3 className="font-extrabold text-base sm:text-lg text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4" style={{ color: accentColor || '#38BDF8' }} />
                      <span>{countryName} Quick Facts</span>
                    </h3>
                    {flagEmoji && <span className="text-2xl leading-none">{flagEmoji}</span>}
                  </div>

                  <div className="space-y-2.5 text-xs sm:text-sm">
                    {quickFacts.capital && (
                      <div className="flex justify-between py-1 border-b border-white/10">
                        <span className="text-slate-300">Capital</span>
                        <span className="font-bold text-white">{quickFacts.capital}</span>
                      </div>
                    )}
                    {quickFacts.currency && (
                      <div className="flex justify-between py-1 border-b border-white/10">
                        <span className="text-slate-300">Currency</span>
                        <span className="font-bold text-white">{quickFacts.currency}</span>
                      </div>
                    )}
                    {quickFacts.intakes && (
                      <div className="flex justify-between py-1 border-b border-white/10">
                        <span className="text-slate-300">Major Intakes</span>
                        <span className="font-bold text-white text-right max-w-[190px]">{quickFacts.intakes}</span>
                      </div>
                    )}
                    {quickFacts.avgTuition && (
                      <div className="flex justify-between py-1 border-b border-white/10">
                        <span className="text-slate-300">Average Tuition</span>
                        <span className="font-bold text-white">{quickFacts.avgTuition}</span>
                      </div>
                    )}
                    {quickFacts.avgLivingCost && (
                      <div className="flex justify-between py-1 border-b border-white/10">
                        <span className="text-slate-300">Living Expenses</span>
                        <span className="font-bold text-white">{quickFacts.avgLivingCost}</span>
                      </div>
                    )}
                    {quickFacts.processingTime && (
                      <div className="flex justify-between py-1 border-b border-white/10">
                        <span className="text-slate-300">Visa Processing</span>
                        <span className="font-bold text-white">{quickFacts.processingTime}</span>
                      </div>
                    )}
                    {quickFacts.visaType && (
                      <div className="flex justify-between pt-1">
                        <span className="text-slate-300">Visa Category</span>
                        <span className="font-bold" style={{ color: accentColor || '#38BDF8' }}>
                          {quickFacts.visaType}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </header>
    );
  }

  // ════════════════════════════════════════════════════════════════════
  // VARIANT 3: SPLIT HEADER (Overseas Recruitment)
  // ════════════════════════════════════════════════════════════════════
  if (variant === 'split') {
    return (
      <header className="relative w-full bg-gradient-to-b from-slate-50 via-white to-slate-50 border-b border-slate-200/80 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {renderBreadcrumbs(false)}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-5 text-left">
              {badge && (
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                  <span>{badge}</span>
                </div>
              )}

              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
                  {title}
                </h1>
                <div className="h-1.5 w-20 bg-orange-500 rounded-full mt-3.5" />
              </div>

              <p className="text-slate-600 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl font-normal">
                {description}
              </p>

              {/* Category Chips */}
              {chips.length > 0 && (
                <div className="space-y-2 pt-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Featured Sectors
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {chips.map((chip, idx) => (
                      <span
                        key={idx}
                        className="px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold shadow-xs"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-3">
                <button
                  type="button"
                  onClick={() => (onApplyJobs ? onApplyJobs() : onOpenConsultation?.('Recruitment'))}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#FF7A18] via-[#FF6A00] to-[#FF4E00] hover:from-[#ff882b] hover:to-[#ff5c14] text-white font-bold text-sm sm:text-base shadow-xl shadow-orange-600/30 transition-all cursor-pointer group"
                >
                  <span>Apply for Overseas Jobs</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
                {onEmployerInquiry ? (
                  <button
                    type="button"
                    onClick={onEmployerInquiry}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-slate-300 hover:border-orange-500 text-slate-800 font-semibold text-sm sm:text-base shadow-xs transition-all cursor-pointer"
                  >
                    <span>Employer Inquiry</span>
                  </button>
                ) : (
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-slate-300 hover:border-blue-500 text-slate-800 font-semibold text-sm sm:text-base shadow-xs transition-all"
                  >
                    <span>Employer Inquiry</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Right Photo Column */}
            {image && (
              <div className="lg:col-span-5 relative">
                <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
                  <img
                    src={image}
                    alt={imageAlt}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  
                  {/* Floating Highlight Pill */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-lg flex items-center justify-between border border-slate-100 text-xs">
                    <div>
                      <p className="font-extrabold text-slate-900">5,000+ Placements</p>
                      <p className="text-slate-500 text-[11px]">UAE, UK & Europe Deployment</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                      Verified Jobs
                    </span>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </header>
    );
  }

  // ════════════════════════════════════════════════════════════════════
  // VARIANT 4: SEARCH HEADER (Destination-wise Listing)
  // ════════════════════════════════════════════════════════════════════
  if (variant === 'search') {
    return (
      <header className="relative w-full bg-gradient-to-b from-slate-50 via-white to-slate-50 border-b border-slate-200/80 py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          {renderBreadcrumbs(false)}

          <div className="space-y-4 max-w-3xl">
            {badge && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
                <Globe className="w-3.5 h-3.5" />
                <span>{badge}</span>
              </div>
            )}

            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
                {title}
              </h1>
              <div className="h-1.5 w-20 bg-blue-600 rounded-full mt-3 sm:mx-0 mx-auto" />
            </div>

            <p className="text-slate-600 text-sm sm:text-base lg:text-lg leading-relaxed font-normal">
              {description}
            </p>
          </div>

          {/* Children / Custom Filter Search Injection */}
          {children && <div className="mt-8">{children}</div>}
        </div>
      </header>
    );
  }

  // ════════════════════════════════════════════════════════════════════
  // VARIANT 2: LIGHT HEADER (About, Services, Contact, Study Abroad Listing)
  // ════════════════════════════════════════════════════════════════════
  return (
    <header className="relative w-full bg-gradient-to-b from-slate-50 via-white to-slate-50 border-b border-slate-200/80 py-10 lg:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {renderBreadcrumbs(false)}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Title & Description */}
          <div className={`${image ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-4 text-left`}>
            {badge && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{badge}</span>
              </div>
            )}

            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
                {title}
              </h1>
              <div className="h-1.5 w-20 bg-blue-600 rounded-full mt-3" />
            </div>

            <p className="text-slate-600 text-sm sm:text-base lg:text-lg leading-relaxed max-w-3xl font-normal">
              {description}
            </p>

            {/* Embedded Search Bar (e.g. For Study Abroad Main Listing) */}
            {data.hasSearch && children && (
              <div className="pt-2">{children}</div>
            )}
          </div>

          {/* Optional Right Side Image for About/Services */}
          {image && (
            <div className="lg:col-span-4 hidden lg:flex justify-end">
              <div className="relative w-72 h-44 rounded-2xl overflow-hidden shadow-lg border-2 border-white bg-slate-100">
                <img
                  src={image}
                  alt={imageAlt}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
            </div>
          )}

        </div>
      </div>
    </header>
  );
}
