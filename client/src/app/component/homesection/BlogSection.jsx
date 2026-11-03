'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, BookOpen } from 'lucide-react';

const DEFAULT_POSTS = [
  {
    title: 'Top 10 Reasons to Study in Canada in 2025',
    category: 'Study Tips',
    date: 'May 10, 2025',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?auto=format&fit=crop&w=600&q=80',
    link: '/blog'
  },
  {
    title: 'Step-by-Step Guide to Getting a Student Visa Fast',
    category: 'Visa Guide',
    date: 'May 08, 2025',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=600&q=80',
    link: '/blog'
  },
  {
    title: 'Life as an International Student in the UK & Budgeting',
    category: 'University Life',
    date: 'May 05, 2025',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80',
    link: '/blog'
  }
];

export default function BlogSection({
  posts = DEFAULT_POSTS,
  tag = 'LATEST UPDATES',
  title = 'Insights & Study Abroad Tips',
  subtitle = 'Get the latest news, tips, and guides to help you make the right decisions for your future.',
  viewAllLink = '/blog'
}) {
  return (
    <section id="blog" className="py-16 sm:py-24 bg-gradient-to-b from-[#EDF4FC] via-[#F4F8FD] to-[#E9F2FC] relative overflow-hidden">
      
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-blue-100/35 rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Row */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12"
        >
          <div>
            <span className="text-xs font-bold tracking-wider text-blue-600 uppercase block mb-1">
              {tag}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {title}
            </h2>
            <p className="text-slate-500 text-sm sm:text-base mt-1.5 max-w-xl">
              {subtitle}
            </p>
          </div>

          <Link 
            href={viewAllLink} 
            className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 transition-all self-start sm:self-auto group"
          >
            <span>View All Articles</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* 3 Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {posts.map((post, idx) => (
            <motion.article
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
              whileHover={{ y: -8 }}
              className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-2xl hover:border-blue-400 transition-all duration-300 flex flex-col"
            >
              <Link href={post.link || '/blog'} className="block flex flex-col flex-1">
                {/* Image Container */}
                <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Category Pill Tag */}
                  <div className="absolute top-3 left-3 bg-blue-600/90 backdrop-blur-xs text-white text-[11px] font-semibold px-3 py-1 rounded-full shadow-xs">
                    {post.category}
                  </div>

                  {/* Read time badge */}
                  <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2.5 py-0.5 rounded-md flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                      {post.title}
                    </h3>
                  </div>

                  {/* Date & Read more button */}
                  <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {post.date}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-blue-600 text-slate-600 group-hover:text-white flex items-center justify-center transition-all shadow-xs">
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

      </div>
    </section>
  );
}
