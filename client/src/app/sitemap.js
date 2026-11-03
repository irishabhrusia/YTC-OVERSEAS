export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ytcglobal.com';
  const now = new Date();

  const staticRoutes = [
    { url: `${baseUrl}/`, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/about`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/partner-universities`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/study-abroad`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/study-abroad/usa`, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/study-abroad/uk`, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/study-abroad/canada`, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/study-abroad/australia`, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/study-abroad/germany`, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/study-abroad/ireland`, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/study-abroad/new-zealand`, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/study-abroad/uae`, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/services`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/services/university-selection`, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${baseUrl}/services/visa-guidance`, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${baseUrl}/services/ielts-preparation`, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${baseUrl}/services/accommodation-assistance`, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${baseUrl}/services/overseas-recruitment`, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${baseUrl}/services/talent-sourcing`, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${baseUrl}/services/employer-partnerships`, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${baseUrl}/overseas-recruitment`, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/blog`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/contact`, changeFrequency: 'monthly', priority: 0.7 },
  ];

  return staticRoutes.map((route) => ({
    ...route,
    lastModified: now,
  }));
}

