import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import CountryDetailView from '../../../component/study-abroad/CountryDetailView';
import { fetchCountryBySlug, fetchCountries } from '../../../lib/api';

// Generate static routes dynamically from backend
export async function generateStaticParams() {
  const list = await fetchCountries();
  if (Array.isArray(list) && list.length > 0) {
    return list.map((c) => ({ country: c.slug }));
  }
  return [
    { country: 'usa' },
    { country: 'uk' },
    { country: 'canada' },
    { country: 'australia' },
    { country: 'germany' },
    { country: 'ireland' },
    { country: 'new-zealand' },
    { country: 'uae' },
  ];
}

// Generate dynamic SEO metadata for each study destination
export async function generateMetadata({ params }) {
  const { country: slug } = await params;
  const country = await fetchCountryBySlug(slug);

  if (!country) {
    return {
      title: 'Study Destination Not Found | YTC Global Education',
    };
  }

  return {
    title: country.seoTitle || `Study in ${country.name} | Top Universities, Visas & Scholarships | YTC Global`,
    description: country.seoDescription || `Complete guide to studying in ${country.name}. Explore top universities, admission requirements, tuition fees, post-study work permits, and scholarships with YTC Global Education.`,
  };
}

async function CountryContent({ params }) {
  const { country: slug } = await params;
  const country = await fetchCountryBySlug(slug);

  if (!country) {
    notFound();
  }

  const allCountries = (await fetchCountries()) || [];

  return (
    <CountryDetailView
      country={country}
      allCountries={allCountries}
    />
  );
}

export default function StudyDestinationPage({ params }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-3 border-white/20 border-t-blue-500 animate-spin" />
        </div>
      }
    >
      <CountryContent params={params} />
    </Suspense>
  );
}
