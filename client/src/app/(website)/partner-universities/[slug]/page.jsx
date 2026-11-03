import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { fetchUniversityBySlug, fetchUniversities } from '../../../lib/api';
import UniversityDetailClient from './UniversityDetailClient';

export async function generateStaticParams() {
  try {
    const list = await fetchUniversities({ limit: 100 });
    if (Array.isArray(list) && list.length > 0) {
      return list.map((u) => ({ slug: u.slug }));
    }
  } catch (err) {
    console.warn('generateStaticParams error for universities:', err.message);
  }
  return [];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const university = await fetchUniversityBySlug(slug);

  if (!university) {
    notFound();
  }

  const countryName = university.country?.name || 'Overseas';
  const tuition = university.tuitionFrom ? `$${university.tuitionFrom.toLocaleString()} / Year` : 'Tuition varies';

  return {
    title: `${university.name} - Admissions, Rankings & Fees | YTC Global`,
    description: `Explore admissions at ${university.name} in ${university.city ? `${university.city}, ` : ''}${countryName}. QS Ranking: #${university.ranking || 'Top'}. Average fees: ${tuition}. Apply through certified counselors.`,
    openGraph: {
      title: `${university.name} | Study in ${countryName}`,
      description: university.description || `Study at ${university.name} with YTC Global Education guidance.`,
      images: university.image ? [{ url: university.image }] : [],
    },
  };
}

async function UniversityContent({ params }) {
  const { slug } = await params;
  const university = await fetchUniversityBySlug(slug);

  if (!university) {
    notFound();
  }

  // Fetch sibling universities in the same country for recommendations
  const countryId = university.country?._id || university.country?.slug || '';
  const relatedUnis = await fetchUniversities({ country: countryId, limit: 4 }).catch(() => []);
  const filteredRelated = (relatedUnis || []).filter((u) => u.slug !== slug && u._id !== university._id).slice(0, 3);

  return (
    <UniversityDetailClient
      university={university}
      relatedUniversities={filteredRelated}
    />
  );
}

export default function UniversityDetailPage({ params }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
          <div className="w-10 h-10 rounded-full border-3 border-white/20 border-t-blue-500 animate-spin mb-3" />
          <p className="text-xs text-slate-400 font-medium">Loading university profile...</p>
        </div>
      }
    >
      <UniversityContent params={params} />
    </Suspense>
  );
}
