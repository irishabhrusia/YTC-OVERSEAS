'use client';

import React, { useState, useRef, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  GraduationCap,
  FileText,
  BookOpen,
  Home,
  Globe,
  Users,
  Building2,
  Compass,
  Video,
} from 'lucide-react';
import navLinks, { CONTACT_ROUTE } from '../navLinks';
import { fetchCountries } from '../../lib/api';

// ─────────────────────────────────────────────
// Icon map  (resolved from navLinks icon strings)
// ─────────────────────────────────────────────
const ICON_MAP = {
  GraduationCap,
  FileText,
  BookOpen,
  Home,
  Globe,
  Users,
  Building2,
  Compass,
  Video,
};

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function useIsActive(pathname) {
  return (href) => {
    if (href === '/') return pathname === '/';
    return (
      pathname === href ||
      pathname.startsWith(href + '/') ||
      pathname.startsWith(href + '#')
    );
  };
}

// ─────────────────────────────────────────────
// DestinationsMegaContent (KC Overseas Mega-Menu style)
// ─────────────────────────────────────────────
function DestinationsMegaContent({ close, countries = [] }) {
  const displayList = Array.isArray(countries) && countries.length > 0 ? countries : [
    { name: 'USA', shortName: 'USA', slug: 'usa', flagPath: '/flags/usa.svg', flag: '🇺🇸' },
    { name: 'United Kingdom', shortName: 'UK', slug: 'uk', flagPath: '/flags/uk.svg', flag: '🇬🇧' },
    { name: 'Canada', shortName: 'Canada', slug: 'canada', flagPath: '/flags/canada.svg', flag: '🇨🇦' },
    { name: 'Australia', shortName: 'Australia', slug: 'australia', flagPath: '/flags/australia.svg', flag: '🇦🇺' },
    { name: 'Germany', shortName: 'Germany', slug: 'germany', flagPath: '/flags/germany.svg', flag: '🇩🇪' },
    { name: 'Ireland', shortName: 'Ireland', slug: 'ireland', flagPath: '/flags/ireland.svg', flag: '🇮🇪' },
    { name: 'New Zealand', shortName: 'New Zealand', slug: 'new-zealand', flagPath: '/flags/new-zealand.svg', flag: '🇳🇿' },
    { name: 'United Arab Emirates', shortName: 'UAE', slug: 'uae', flagPath: '/flags/uae.svg', flag: '🇦🇪' },
  ];

  return (
    <div className="grid grid-cols-12 gap-8 lg:gap-12 items-start text-left">
      {/* Left: Study Destinations (9 cols) */}
      <div className="col-span-8 lg:col-span-9 space-y-5">
        {/* Header with icon */}
        <div className="flex items-center gap-2.5 text-slate-900 font-extrabold text-base">
          <Globe className="w-5 h-5 text-slate-800" />
          <span>Study Destinations</span>
        </div>

        {/* Dynamic grid of destinations */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-3.5 pt-1">
          {displayList.map((c) => (
            <Link
              key={c.slug}
              href={`/study-abroad/${c.slug}`}
              onClick={close}
              className="text-sm text-slate-700 hover:text-blue-600 font-medium transition-colors flex items-center gap-2.5 py-0.5 group"
            >
              {c.flagPath ? (
                <img
                  src={c.flagPath}
                  alt={c.name}
                  className="w-5 h-3.5 object-cover rounded-xs border border-slate-200/90 shadow-2xs shrink-0"
                />
              ) : (
                <span className="text-base leading-none">{c.flag || '🌍'}</span>
              )}
              <span className="group-hover:translate-x-0.5 transition-transform">{c.name || c.shortName}</span>
            </Link>
          ))}

          <Link
            href="/destinations"
            onClick={close}
            className="text-sm text-blue-600 hover:text-blue-800 font-bold transition-colors flex items-center gap-2 py-0.5 group"
          >
            <span>Explore All Destinations</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Right: Quick Tools (3 cols) */}
      <div className="col-span-4 lg:col-span-3 border-l border-slate-100 pl-8 space-y-4">
        <Link
          href="/partner-universities"
          onClick={close}
          className="flex items-center gap-3 text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors group"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-50 group-hover:bg-blue-50 text-slate-600 group-hover:text-blue-600 flex items-center justify-center transition-colors shrink-0">
            <Search className="w-4 h-4" />
          </div>
          <span>Search Partner Universities</span>
        </Link>

        <Link
          href="/destinations"
          onClick={close}
          className="flex items-center gap-3 text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors group"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-50 group-hover:bg-blue-50 text-slate-600 group-hover:text-blue-600 flex items-center justify-center transition-colors shrink-0">
            <Compass className="w-4 h-4" />
          </div>
          <span>Destination-wise Listing</span>
        </Link>

        <Link
          href="/contact"
          onClick={close}
          className="flex items-center gap-3 text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors group"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-50 group-hover:bg-blue-50 text-slate-600 group-hover:text-blue-600 flex items-center justify-center transition-colors shrink-0">
            <Video className="w-4 h-4" />
          </div>
          <span>Book Online Counselling</span>
        </Link>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Mobile Accordion  (dropdown → accordion)
// ─────────────────────────────────────────────
function MobileAccordion({ item, isActive, closeMenu, countries = [] }) {
  const [open, setOpen] = useState(false);
  const active = isActive(item.href);

  const countryItems =
    item.variant === 'countries' && countries.length > 0
      ? countries.map((c) => ({
          label: c.name || c.shortName,
          href: `/study-abroad/${c.slug}`,
          flagImg: c.flagPath,
          flag: c.flag || '🌍',
        }))
      : item.countries || [];

  return (
    <div>
      <div className="flex items-center">
        <Link
          href={item.href}
          onClick={closeMenu}
          className={`flex-1 px-3 py-2.5 text-base font-semibold rounded-lg ${
            active ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:bg-slate-50'
          }`}
        >
          {item.label}
        </Link>
        <button
          aria-label={`Toggle ${item.label} submenu`}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="ml-1 p-2 rounded-lg text-slate-500 hover:bg-slate-100"
        >
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden pl-3 mt-1 space-y-2"
          >
            <div className="grid grid-cols-1 gap-0.5 pb-1">
              {countryItems.map((c, i) => (
                <Link
                  key={i}
                  href={c.href}
                  onClick={closeMenu}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-blue-50 transition-colors"
                >
                  {c.flagImg ? (
                    <img
                      src={c.flagImg}
                      alt={c.label}
                      className="w-5 h-3.5 object-cover rounded-xs border border-slate-200/90 shadow-2xs shrink-0"
                    />
                  ) : (
                    <span className="text-xl leading-none">{c.flag}</span>
                  )}
                  <span className="text-sm font-medium text-slate-700 hover:text-blue-600">
                    {c.label}
                  </span>
                </Link>
              ))}
              <Link
                href="/partner-universities"
                onClick={closeMenu}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-blue-600 font-bold text-sm hover:bg-blue-50"
              >
                <Search className="w-4 h-4" />
                <span>Search Partner Universities</span>
              </Link>
              <Link
                href="/destinations"
                onClick={closeMenu}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-slate-700 font-medium text-sm hover:bg-blue-50"
              >
                <Compass className="w-4 h-4 text-slate-400" />
                <span>Destination-wise Listing</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────
// Header Content (Inner Client Component)
// ─────────────────────────────────────────────
function HeaderContent() {
  const pathname = usePathname();
  const isActive = useIsActive(pathname);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [prevPathname, setPrevPathname]     = useState(pathname);
  const [liveCountries, setLiveCountries]   = useState([]);

  useEffect(() => {
    let ignore = false;
    fetchCountries().then((data) => {
      if (!ignore && Array.isArray(data) && data.length > 0) {
        setLiveCountries(data);
      }
    });
    return () => { ignore = true; };
  }, []);

  const headerRef = useRef(null);
  const timeoutRef = useRef(null);

  // Close mobile menu on route change
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
  }

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);

  const handleOpenDropdown = (id) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDropdownId(id);
  };

  const handleScheduleClose = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setOpenDropdownId(null);
    }, 160);
  };

  const handlePanelMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const handleCloseImmediate = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDropdownId(null);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Escape key and outside click handlers
  useEffect(() => {
    if (!openDropdownId) return;
    const onKey = (e) => {
      if (e.key === 'Escape') handleCloseImmediate();
    };
    const onClick = (e) => {
      if (!headerRef.current?.contains(e.target)) {
        handleCloseImmediate();
      }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [openDropdownId]);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs transition-all duration-300 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-24">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-3.5 group py-1 shrink-0">
            <img
              src="/images/logo.png"
              alt="YTC Global Education Logo"
              className="h-10 sm:h-12 md:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div className="flex flex-col" />
          </Link>

          {/* ── Desktop Navigation ── */}
          <nav
            aria-label="Main navigation"
            className="hidden lg:flex items-center gap-5 xl:gap-6"
          >
            {navLinks.map((item) => {
              const active = isActive(item.href);

              if (item.type === 'dropdown') {
                const isOpen = openDropdownId === item.id;
                return (
                  <div
                    key={item.id}
                    className="relative py-2"
                    onMouseEnter={() => handleOpenDropdown(item.id)}
                    onMouseLeave={handleScheduleClose}
                  >
                    <Link
                      href={item.href}
                      onFocus={() => handleOpenDropdown(item.id)}
                      onClick={handleCloseImmediate}
                      aria-haspopup="true"
                      aria-expanded={isOpen}
                      className={`flex items-center gap-1.5 text-[15px] font-semibold transition-colors relative py-1 whitespace-nowrap ${
                        isOpen
                          ? 'text-[#FF5C35]'
                          : active
                          ? 'text-blue-600'
                          : 'text-slate-800 hover:text-blue-600'
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-[#FF5C35]' : 'text-slate-500'
                        }`}
                      />
                    </Link>

                    {active && !isOpen && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"
                      />
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`text-[15px] font-semibold transition-colors relative py-1 whitespace-nowrap ${
                    active
                      ? 'text-blue-600'
                      : 'text-slate-800 hover:text-blue-600'
                  }`}
                >
                  {item.label}
                  {active && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ── Right Actions (desktop) ── */}
          <div className="hidden lg:flex items-center gap-4 shrink-0">
            <motion.a
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              href="/partner-universities"
              aria-label="Search universities"
              className="w-10 h-10 rounded-full flex items-center justify-center text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Search className="w-5 h-5" />
            </motion.a>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href={CONTACT_ROUTE}
                className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-md shadow-blue-500/25 transition-all duration-200"
              >
                Book a Consultation
              </Link>
            </motion.div>
          </div>

          {/* ── Hamburger (mobile) ── */}
          <div className="flex lg:hidden items-center gap-2">
            <a
              href="/partner-universities"
              aria-label="Search universities"
              className="w-9 h-9 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100"
            >
              <Search className="w-4 h-4" />
            </a>
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none cursor-pointer"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Full-Width Mega Menu Dropdown Panel (KC Overseas Style) ── */}
      <AnimatePresence>
        {openDropdownId && (
          <motion.div
            key={openDropdownId}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="absolute top-full left-0 right-0 w-full bg-white border-t border-slate-100 shadow-2xl z-50 overflow-hidden"
            onMouseEnter={handlePanelMouseEnter}
            onMouseLeave={handleScheduleClose}
          >
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
              {openDropdownId === 'study-destinations' && (
                <DestinationsMegaContent close={handleCloseImmediate} countries={liveCountries} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-label="Mobile navigation menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-1 shadow-lg overflow-hidden"
          >
            {navLinks.map((item) => {
              if (item.type === 'dropdown') {
                return (
                  <MobileAccordion
                    key={item.id}
                    item={item}
                    isActive={isActive}
                    closeMenu={closeMobileMenu}
                    countries={liveCountries}
                  />
                );
              }

              const active = isActive(item.href);
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={`block px-3 py-2.5 rounded-lg text-base font-semibold ${
                    active ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            {/* CTA */}
            <div className="pt-2">
              <Link
                href={CONTACT_ROUTE}
                onClick={closeMobileMenu}
                className="w-full flex items-center justify-center gap-2 py-3 text-center text-sm font-semibold text-white bg-blue-600 rounded-full shadow-md"
              >
                Book a Consultation
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// ─────────────────────────────────────────────
// Static Fallback Shell (zero CLS during prerender)
// ─────────────────────────────────────────────
function HeaderFallback() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-24">
          <Link href="/" className="flex items-center gap-3.5 py-1 shrink-0">
            <img
              src="/images/logo.png"
              alt="YTC Global Education Logo"
              className="h-10 sm:h-12 md:h-14 w-auto object-contain"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-5 xl:gap-6">
            {navLinks.map((item) => (
              <span
                key={item.id}
                className="text-[15px] font-semibold text-slate-700 py-1 whitespace-nowrap"
              >
                {item.label}
              </span>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <Link
              href={CONTACT_ROUTE}
              className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-full shadow-md shadow-blue-500/25"
            >
              Book a Consultation
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────
// Main Header Export Wrapped in Suspense Boundary
// Prevents usePathname() from blocking Next.js prerendering
// ─────────────────────────────────────────────
export default function Header() {
  return (
    <Suspense fallback={<HeaderFallback />}>
      <HeaderContent />
    </Suspense>
  );
}
