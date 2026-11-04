import React, { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  Share2,
  Tag,
  BookOpen,
  Sparkles,
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import { fetchBlogBySlug, fetchBlogs } from '../../../lib/api';

export async function generateStaticParams() {
  const blogs = await fetchBlogs();
  if (Array.isArray(blogs) && blogs.length > 0) {
    return blogs.map((b) => ({ slug: b.slug }));
  }
  return [{ slug: 'hello' }];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = await fetchBlogBySlug(slug);

  if (!blog) {
    return {
      title: 'Blog Article Not Found | YTC Global Education',
    };
  }

  return {
    title: blog.seoTitle || `${blog.title} | YTC Global Education`,
    description:
      blog.seoDescription ||
      blog.excerpt ||
      `Read ${blog.title} on YTC Global Education insights and overseas study advice.`,
  };
}

async function BlogContent({ params }) {
  const { slug } = await params;
  const blog = await fetchBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  // Fetch related blogs for recommendation sidebar
  const allBlogs = (await fetchBlogs()) || [];
  const relatedBlogs = allBlogs
    .filter((b) => b.slug !== slug)
    .slice(0, 3);

  const formattedDate = blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recent Post';

  const tags = Array.isArray(blog.tags)
    ? blog.tags
    : typeof blog.tags === 'string' && blog.tags.length > 0
    ? blog.tags.split(',').map((t) => t.trim()).filter(Boolean)
    : ['Study Abroad', 'Education'];

  return (
    <div className="min-h-screen bg-slate-50 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back Link & Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Articles</span>
          </Link>
          <span>/</span>
          <span className="text-slate-400 capitalize">{blog.category || 'Insights'}</span>
          <span>/</span>
          <span className="text-slate-700 font-medium truncate max-w-xs sm:max-w-md">
            {blog.title}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* Main Article Content */}
          <article className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xs">

            {/* Category & Date Metadata */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium mb-4">
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold uppercase tracking-wider text-[11px]">
                {blog.category || 'Study Abroad'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {formattedDate}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {blog.readTime || '4 min read'}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-[1.18] tracking-tight mb-6">
              {blog.title}
            </h1>

            {/* Author info pill */}
            <div className="flex items-center justify-between pb-6 mb-8 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm shadow-xs">
                  {blog.author ? blog.author.charAt(0).toUpperCase() : 'Y'}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{blog.author || 'YTC Editorial Team'}</div>
                  <div className="text-xs text-slate-400">Overseas Education Specialist</div>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            {(blog.coverImage || blog.image) && (
              <div className="relative rounded-2xl overflow-hidden mb-8 shadow-sm aspect-[16/9] bg-slate-100">
                <img
                  src={blog.coverImage || blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Excerpt / Lead Intro */}
            {blog.excerpt && (
              <div className="text-base sm:text-lg font-medium text-slate-700 leading-relaxed p-5 bg-blue-50/60 rounded-2xl border-l-4 border-blue-600 mb-8">
                {blog.excerpt}
              </div>
            )}

            {/* Body Content */}
            <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm sm:text-base space-y-4">
              {blog.content ? (
                blog.content.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))
              ) : (
                <p>Stay tuned for detailed analysis and step-by-step guidance on this topic.</p>
              )}
            </div>

            {/* Tags Footer */}
            {tags.length > 0 && (
              <div className="pt-8 mt-10 border-t border-slate-100 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 mr-2 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" /> Tags:
                </span>
                {tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8">

            {/* Free Counseling Card */}
            <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white rounded-3xl p-7 shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Want to Study Abroad?</h3>
              <p className="text-blue-100 text-xs sm:text-sm leading-relaxed mb-6">
                Get free 1-on-1 counseling from our certified advisors on university selection, scholarships, and visa processing.
              </p>
              <Link
                href="/contact"
                className="w-full inline-flex items-center justify-center py-3 px-4 rounded-xl bg-white hover:bg-blue-50 text-blue-700 font-bold text-xs sm:text-sm shadow-md transition-all text-center"
              >
                Book Free Consultation
              </Link>
            </div>

            {/* Related Articles */}
            {relatedBlogs.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
                <h4 className="text-base font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span>Related Articles</span>
                </h4>
                <div className="space-y-4">
                  {relatedBlogs.map((rel) => (
                    <Link
                      key={rel.slug}
                      href={`/blog/${rel.slug}`}
                      className="group flex gap-3.5 items-center hover:bg-slate-50 p-2 rounded-xl transition-colors"
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                        <img
                          src={rel.coverImage || rel.image || 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?auto=format&fit=crop&w=200&q=80'}
                          alt={rel.title}
                          className="w-full h-full object-cover group-hover:scale-108 transition-transform"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-semibold text-blue-600 uppercase mb-0.5">
                          {rel.category || 'Study Abroad'}
                        </div>
                        <h5 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                          {rel.title}
                        </h5>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Study Destinations */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
              <h4 className="text-base font-bold text-slate-900 mb-3 pb-3 border-b border-slate-100">
                Top Destinations
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { name: 'Canada', slug: 'canada', flag: '🇨🇦' },
                  { name: 'United Kingdom', slug: 'uk', flag: '🇬🇧' },
                  { name: 'USA', slug: 'usa', flag: '🇺🇸' },
                  { name: 'Australia', slug: 'australia', flag: '🇦🇺' },
                  { name: 'Germany', slug: 'germany', flag: '🇩🇪' },
                  { name: 'Ireland', slug: 'ireland', flag: '🇮🇪' },
                ].map((d) => (
                  <Link
                    key={d.slug}
                    href={`/study-abroad/${d.slug}`}
                    className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-medium transition-colors"
                  >
                    <span>{d.flag}</span>
                    <span className="truncate">{d.name}</span>
                  </Link>
                ))}
              </div>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
}

export default function BlogDetailPage({ params }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-3 border-slate-200 border-t-blue-600 animate-spin" />
        </div>
      }
    >
      <BlogContent params={params} />
    </Suspense>
  );
}
