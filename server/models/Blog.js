const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    excerpt: {
      type: String,
      default: '',
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Blog content is required'],
    },
    coverImage: {
      type: String,
      default: '',
    },
    author: {
      type: String,
      default: 'YTC Editorial Team',
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    category: {
      type: String,
      default: 'Study Abroad',
      trim: true,
      index: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    seoTitle: {
      type: String,
      default: '',
    },
    seoDescription: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

blogSchema.index({ title: 'text', content: 'text', excerpt: 'text' });
blogSchema.index({ publishedAt: -1 });

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;

