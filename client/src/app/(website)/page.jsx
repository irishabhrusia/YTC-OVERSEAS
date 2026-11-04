'use client';

import React, { useState, useEffect, useCallback } from 'react';
import HeroSection from '../component/homesection/HeroSection';
import StudyDestinations from '../component/homesection/StudyDestinations';
import PopularDestinations from '../component/homesection/PopularDestinations';
import PartnerUniversities from '../component/homesection/PartnerUniversities';
import ServicesSection from '../component/homesection/ServicesSection';
import HowItWorks from '../component/homesection/HowItWorks';
import WhyChooseUs from '../component/homesection/WhyChooseUs';
import OverseasRecruitment from '../component/homesection/OverseasRecruitment';
import SuccessStories from '../component/homesection/SuccessStories';
import TestimonialsSection from '../component/homesection/TestimonialsSection';
import CtaBanner from '../component/homesection/CtaBanner';
import FAQSection from '../component/homesection/FAQSection';
import BlogSection from '../component/homesection/BlogSection';
import ConsultationModal from '../component/homesection/ConsultationModal';
import { fetchFaqs, fetchTestimonials, fetchBlogs, fetchUniversities, fetchCountries, fetchHeroContent } from '../lib/api';

export default function HomePage() {
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState('Canada');

  // Dynamic CMS content state
  const [dynamicHero, setDynamicHero] = useState(null);
  const [dynamicFaqs, setDynamicFaqs] = useState(null);
  const [dynamicTestimonials, setDynamicTestimonials] = useState(null);
  const [dynamicSuccessStories, setDynamicSuccessStories] = useState(null);
  const [dynamicBlogs, setDynamicBlogs] = useState(null);
  const [dynamicUniversities, setDynamicUniversities] = useState(null);
  const [dynamicDestinations, setDynamicDestinations] = useState(null);

  // Per-section loading states to avoid full-page blocking
  const [heroLoading, setHeroLoading] = useState(true);
  const [destinationsLoading, setDestinationsLoading] = useState(true);
  const [faqsLoading, setFaqsLoading] = useState(true);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);
  const [storiesLoading, setStoriesLoading] = useState(true);
  const [blogsLoading, setBlogsLoading] = useState(true);
  const [universitiesLoading, setUniversitiesLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    // Fetch live Hero Section settings
    fetchHeroContent()
      .then((data) => {
        if (!ignore) {
          setDynamicHero(data || null);
          setHeroLoading(false);
        }
      })
      .catch(() => { if (!ignore) setHeroLoading(false); });

    // Fetch live Destinations
    fetchCountries()
      .then((data) => {
        if (!ignore) {
          if (Array.isArray(data) && data.length > 0) {
            setDynamicDestinations(
              data.map((c) => ({
                slug: c.slug,
                country: c.name,
                flag: c.flag || '🌍',
                tagline: c.headline || 'World-class universities & career pathways',
                badge: c.badge || 'Top Choice',
                image: c.heroImage || '/destinations/usa.webp',
                href: `/study-abroad/${c.slug}`,
              }))
            );
          }
          setDestinationsLoading(false);
        }
      })
      .catch(() => { if (!ignore) setDestinationsLoading(false); });

    // Fetch live FAQs
    fetchFaqs()
      .then((data) => {
        if (!ignore) {
          if (Array.isArray(data) && data.length > 0) setDynamicFaqs(data);
          setFaqsLoading(false);
        }
      })
      .catch(() => { if (!ignore) setFaqsLoading(false); });

    // Fetch live Testimonials & Success Stories
    fetchTestimonials()
      .then((data) => {
        if (!ignore) {
          if (Array.isArray(data) && data.length > 0) {
            // Split into Success Stories (entries with result or type='success_story')
            const successStories = data.filter((t) => t.type === 'success_story' || t.result);
            if (successStories.length > 0) {
              setDynamicSuccessStories(successStories);
            }

            // Split into Reviews / Testimonials (entries with quote or text)
            const reviews = data.filter((t) => t.type === 'testimonial' || t.quote || t.text);
            if (reviews.length > 0) {
              setDynamicTestimonials(
                reviews.map((t) => ({
                  name: t.studentName || t.name,
                  country: t.country || 'International',
                  quote: t.quote || t.text,
                  image: t.photo || t.image || t.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
                  university: t.university || 'Overseas University',
                  rating: t.rating || 5,
                }))
              );
            }
          }
          setTestimonialsLoading(false);
          setStoriesLoading(false);
        }
      })
      .catch(() => {
        if (!ignore) {
          setTestimonialsLoading(false);
          setStoriesLoading(false);
        }
      });

    // Fetch live Blogs
    fetchBlogs()
      .then((data) => {
        if (!ignore) {
          if (Array.isArray(data) && data.length > 0) {
            setDynamicBlogs(
              data.map((b) => ({
                title: b.title,
                category: b.category ? b.category.replace('_', ' ') : 'Insights',
                date: b.createdAt ? new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent',
                readTime: '4 min read',
                image: b.coverImage || b.image || 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?auto=format&fit=crop&w=600&q=80',
                link: `/blog/${b.slug || ''}`,
              }))
            );
          }
          setBlogsLoading(false);
        }
      })
      .catch(() => { if (!ignore) setBlogsLoading(false); });

    // Fetch live Partner Universities
    fetchUniversities({ limit: 100 })
      .then((data) => {
        if (!ignore) {
          const list = Array.isArray(data) ? data : (data?.universities || []);
          if (list.length > 0) {
            setDynamicUniversities(
              list.map((u) => ({
                name: u.name,
                logo: u.logo || u.image,
                country: u.country?.name || 'Global',
                ranking: u.ranking ? `#${u.ranking}` : undefined,
                
              }))
            );
          }
          setUniversitiesLoading(false);
        }
      })
      .catch(() => { if (!ignore) setUniversitiesLoading(false); });

    return () => {
      ignore = true;
    };
  }, []);

  // Helper to open modal with a specific pre-selected destination
  const handleOpenConsultation = (destination = 'Canada') => {
    setSelectedDestination(destination);
    setIsConsultationModalOpen(true);
  };

  const handleCloseConsultation = () => {
    setIsConsultationModalOpen(false);
  };

  const handleConsultationSubmit = (formData) => {
    console.log('Consultation requested:', formData);
    // Future API endpoint connection (e.g. POST /api/consultations)
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F4F8FD] via-[#EDF4FC] to-[#F1F6FD] text-slate-900 overflow-x-hidden selection:bg-blue-600 selection:text-white">

      {/* 1. Hero */}
      <HeroSection
        data={dynamicHero || undefined}
        isLoading={heroLoading}
        onOpenConsultation={() => handleOpenConsultation('Canada')}
      />

      {/* 2. Study Destinations */}
      <StudyDestinations items={dynamicDestinations || undefined} isLoading={destinationsLoading} />

      {/* 3. Popular Destinations */}
      {/* <PopularDestinations
        destinations={dynamicDestinations || undefined}
        isLoading={destinationsLoading}
        onSelectDestination={(country) => handleOpenConsultation(country)}
      /> */}

      {/* 4. Partner Universities */}
      <PartnerUniversities items={dynamicUniversities || undefined} isLoading={universitiesLoading} />

      {/* 5. Services Section */}
      <ServicesSection
        onExploreServices={() => handleOpenConsultation('Canada')}
      />

      {/* 6. How It Works */}
      <HowItWorks />

      {/* 7. Why Choose Us */}
      <WhyChooseUs
        onLearnMore={() => handleOpenConsultation('Canada')}
      />

      {/* 8. Overseas Recruitment */}
      <OverseasRecruitment />

      {/* 9. Success Stories */}
      <SuccessStories
        stories={dynamicSuccessStories || undefined}
        isLoading={storiesLoading}
      />

      {/* 10. Student Testimonials */}
      <TestimonialsSection testimonials={dynamicTestimonials || undefined} isLoading={testimonialsLoading} />

      {/* 11. Call To Action Banner */}
      <CtaBanner
        onOpenConsultation={() => handleOpenConsultation('Canada')}
      />

      {/* 12. FAQ */}
      <FAQSection items={dynamicFaqs || undefined} isLoading={faqsLoading} />

      {/* 13. Blog / Tips Section */}
      <BlogSection posts={dynamicBlogs || undefined} isLoading={blogsLoading} />

      {/* 14. Interactive Consultation Modal */}
      <ConsultationModal
        isOpen={isConsultationModalOpen}
        onClose={handleCloseConsultation}
        initialDestination={selectedDestination}
        onSubmit={handleConsultationSubmit}
      />
    </div>
  );
}
