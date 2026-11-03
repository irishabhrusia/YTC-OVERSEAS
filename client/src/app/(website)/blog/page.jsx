'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Search,
  Calendar,
  Clock,
  ArrowRight,
  Tag,
  User,
  Sparkles,
  Share2
} from 'lucide-react';
import PageHeader from '../../component/PageHeader';
import { pageHeaders } from '../../data/pageHeaders';
import ConsultationModal from '../../component/homesection/ConsultationModal';
import { fetchBlogs } from '../../lib/api';

const DEFAULT_BLOGS = [
  {
    title: 'Top 10 Reasons to Study in Canada in 2026',
    slug: 'top-10-reasons-to-study-in-canada-2026',
    category: 'Study Abroad',
    excerpt: 'Discover why Canada remains the #1 choice for international students with 3-year PGWP, high quality of life, and straightforward PR pathways.',
    content: 'Full comprehensive guide...',
    coverImage: 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?auto=format&fit=crop&w=1200&q=80',
    author: 'YTC Editorial Team',
    createdAt: new Date().toISOString(),
    tags: ['Canada', 'PGWP', 'Study Abroad'],
    readTime: '4 min read',
  },
  {
    title: 'Complete Step-by-Step Guide to Student Visa Approval',
    slug: 'step-by-step-guide-student-visa-approval',
    category: 'Visa Guide',
    excerpt: 'Essential checklist for financial documentation, SOP drafting, biometric appointment scheduling, and common interview questions.',
    content: 'Full comprehensive visa guide...',
    coverImage: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=1200&q=80',
    author: 'Senior Visa Counselor',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    tags: ['Visa', 'SOP', 'Financial Proof'],
    readTime: '6 min read',
  },
  {
    title: 'UK One-Year Master’s Degrees: Costs, Scholarships & ROI',
    slug: 'uk-one-year-masters-degrees-costs-scholarships',
    category: 'University Life',
    excerpt: 'Learn how completing your Master’s degree in just 12 months in the UK saves tuition while granting a 2-year Graduate Route work visa.',
    content: 'UK degrees breakdown...',
    coverImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
    author: 'Academic Advisory Board',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    tags: ['UK', 'Graduate Route', 'Scholarships'],
    readTime: '5 min read',
  },
];

const CATEGORIES = [
  'All',
  'Study Abroad',
  'Visa Guide',
  'University Life',
  'Admissions',
  'Overseas Recruitment',
];

function formatPostDate(dateStr) {
  if (!dateStr) return 'Recent';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return 'Recent';
  }
}

export default function BlogListingPage() {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);

  useEffect(() => {
    let ignore = false;
    fetchBlogs().then((data) => {
      if (!ignore) {
        if (Array.isArray(data) && data.length > 0) {
          setBlogs(data);
        } else {
          setBlogs(DEFAULT_BLOGS);
        }
        setIsLoading(false);
      }
    }).catch(() => {
      if (!ignore) {
        setBlogs(DEFAULT_BLOGS);
        setIsLoading(false);
      }
    });
    return () => {
      ignore = true;
    };
  }, []);

  const displayBlogs = blogs.length > 0 ? blogs : DEFAULT_BLOGS;

  const filteredBlogs = useMemo(() => {
    return displayBlogs.filter((item) => {
      const cat = item.category || 'Study Abroad';
      const matchesCategory =
        selectedCategory === 'All' ||
        cat.toLowerCase() === selectedCategory.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.excerpt && item.excerpt.toLowerCase().includes(q)) ||
        (item.tags &&
          (Array.isArray(item.tags)
            ? item.tags.join(' ')
            : String(item.tags)
          ).toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [displayBlogs, selectedCategory, searchQuery]);

  const featuredPost = displayBlogs[0];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 1. Page Header */}
      <PageHeader {...pageHeaders.blog} />

      {/* 2. Main Content Container */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search articles, topics, visas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all shadow-xs"
            />
          </div>
        </div>

        {/* 3. Featured Article Banner (Visible when no specific search query) */}
        {!searchQuery && selectedCategory === 'All' && featuredPost && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-14"
          >
            <div className="group relative bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-0">
              <div className="lg:col-span-7 relative h-64 sm:h-80 lg:h-full overflow-hidden bg-slate-900">
                <img
                  src={featuredPost.coverImage || featuredPost.image || 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?auto=format&fit=crop&w=1200&q=80'}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-95"
                />
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/90 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider shadow-md">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Featured Article</span>
                </div>
              </div>

              <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mb-3">
                    <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 font-semibold">
                      {featuredPost.category || 'Study Abroad'}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {formatPostDate(featuredPost.createdAt)}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug tracking-tight mb-3">
                    {featuredPost.title}
                  </h2>

                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed line-clamp-3">
                    {featuredPost.excerpt || featuredPost.summary || featuredPost.content || ''}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{featuredPost.author || 'YTC Editorial'}</span>
                  </div>

                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all group-hover:gap-3"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 4. Blog Posts Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
              {searchQuery ? `Search Results for "${searchQuery}"` : selectedCategory === 'All' ? 'Latest Publications' : `${selectedCategory} Articles`}
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Showing {filteredBlogs.length} {filteredBlogs.length === 1 ? 'article' : 'articles'}
            </span>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs animate-pulse">
                  <div className="h-52 bg-slate-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-slate-200 rounded-md w-1/3" />
                    <div className="h-6 bg-slate-200 rounded-md w-5/6" />
                    <div className="h-4 bg-slate-200 rounded-md w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-800 mb-1">No articles found</h4>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-5">
                We could not find any articles matching your search criteria. Try a different keyword or category.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs shadow-md"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {filteredBlogs.map((post, idx) => (
                <motion.article
                  key={post._id || post.slug || idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: idx * 0.08 }}
                  whileHover={{ y: -6 }}
                  className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col"
                >
                  <Link href={`/blog/${post.slug}`} className="block relative h-52 w-full overflow-hidden bg-slate-100">
                    <img
                      src={post.coverImage || post.image || 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?auto=format&fit=crop&w=600&q=80'}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-blue-600/90 backdrop-blur-xs text-white text-[11px] font-semibold px-3 py-1 rounded-full shadow-xs">
                      {post.category || 'Study Abroad'}
                    </div>
                  </Link>

                  <div className="p-6 flex flex-col flex-1 justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatPostDate(post.createdAt)}</span>
                        <span>•</span>
                        <span>{post.readTime || '4 min read'}</span>
                      </div>

                      <Link href={`/blog/${post.slug}`}>
                        <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2 mb-2">
                          {post.title}
                        </h3>
                      </Link>

                      <p className="text-slate-500 text-xs sm:text-sm leading-relaxed line-clamp-3">
                        {post.excerpt || post.summary || post.content || ''}
                      </p>
                    </div>

                    <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-blue-600 group-hover:underline flex items-center gap-1">
                        Read Story
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                      <span className="text-xs text-slate-400">
                        {post.author || 'YTC Team'}
                      </span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>

        {/* 5. Free Counseling CTA Banner */}
        <div className="mt-16 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
              Have Questions About Your Study Abroad Journey?
            </h3>
            <p className="text-blue-100 text-sm sm:text-base">
              Book a 1-on-1 personalized profile evaluation with our expert overseas education advisors today.
            </p>
          </div>
          <button
            onClick={() => setIsConsultationModalOpen(true)}
            className="px-7 py-3.5 rounded-xl bg-white hover:bg-blue-50 text-blue-700 font-bold text-sm sm:text-base shadow-lg transition-all shrink-0 cursor-pointer"
          >
            Book Free Consultation
          </button>
        </div>
      </section>

      {/* Interactive Consultation Modal */}
      <ConsultationModal
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
        initialDestination="Canada"
      />
    </div>
  );
}
