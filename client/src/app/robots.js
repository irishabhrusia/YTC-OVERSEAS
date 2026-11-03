export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ytcglobal.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/*', '/login'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

