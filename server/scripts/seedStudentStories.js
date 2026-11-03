// server/scripts/seedStudentStories.js
const mongoose = require('mongoose');

const STORIES_AND_TESTIMONIALS = [
  {
    studentName: 'Priya Sharma',
    country: 'Canada',
    university: 'University of Toronto',
    course: 'MSc Computer Science',
    result: 'Student Visa Approved — Fall 2026',
    text: 'YTC counselors guided me every single step from university shortlisting to SOP drafting and visa filing. Received my Canadian visa in just 3 weeks with zero hassles!',
    rating: 5,
    type: 'success_story',
    photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=200&q=80',
    order: 1,
    isActive: true,
  },
  {
    studentName: 'Aditya Verma',
    country: 'UK',
    university: 'University of Manchester',
    course: 'MBA — Business Analytics',
    result: '£8,000 Global Excellence Scholarship & Visa Stamped',
    text: 'The 1-on-1 counseling made all the difference. They helped me secure an £8,000 scholarship and prepared me thoroughly for the visa interview.',
    rating: 5,
    type: 'success_story',
    photo: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=200&q=80',
    order: 2,
    isActive: true,
  },
  {
    studentName: 'Sneha Patel',
    country: 'Australia',
    university: 'University of Melbourne',
    course: 'BEng Civil Engineering',
    result: 'Subclass 500 Visa Granted in 14 Days',
    text: 'Extremely grateful to the overseas recruitment and education team. Their guidance for the Australia Subclass 500 visa was flawless and transparent.',
    rating: 5,
    type: 'success_story',
    photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=200&q=80',
    order: 3,
    isActive: true,
  },
  {
    studentName: 'Rohan Mehra',
    country: 'Germany',
    university: 'Technical University of Munich',
    course: 'MSc Data Engineering',
    result: '100% Tuition-Free Admission + Sperrkonto Setup',
    text: 'Studying in Germany tuition-free seemed like a dream. YTC made it a reality by guiding my APS certification, blocked account, and university portal filing.',
    rating: 5,
    type: 'success_story',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    order: 4,
    isActive: true,
  },
  {
    studentName: 'Ananya Deshmukh',
    country: 'Ireland',
    university: 'Trinity College Dublin',
    course: 'MSc International Business',
    result: '€5,000 Dean’s Merit Award & 2-Yr Work Rights',
    text: 'The guidance on Ireland post-study work permits and critical skills list was eye-opening. Got admission into my dream university with a generous bursary!',
    rating: 5,
    type: 'success_story',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    order: 5,
    isActive: true,
  },
  {
    studentName: 'Karan Malhotra',
    country: 'USA',
    university: 'Northeastern University',
    course: 'MS in Information Systems',
    result: 'F-1 Visa Approved with 3-Year STEM OPT',
    text: 'My counselor conducted 4 mock visa interviews until I felt completely confident. Cleared my US consulate interview on the very first attempt!',
    rating: 5,
    type: 'success_story',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    order: 6,
    isActive: true,
  },
  {
    studentName: 'Ayesha Rahman',
    country: 'Canada',
    university: 'McGill University',
    course: 'Master of Management',
    result: 'Student Visa Approved',
    text: 'YTC made my study abroad journey so smooth and stress-free. Their guidance and support were excellent throughout the whole visa process!',
    rating: 5,
    type: 'testimonial',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    order: 7,
    isActive: true,
  },
  {
    studentName: 'Tanvir Hasan',
    country: 'UK',
    university: 'University of Edinburgh',
    course: 'MSc Artificial Intelligence',
    result: 'Full Admission Offer',
    text: 'From university selection to visa process, everything was handled professionally. Highly recommended to anyone looking to study in the UK!',
    rating: 5,
    type: 'testimonial',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    order: 8,
    isActive: true,
  },
  {
    studentName: 'Nusrat Jahan',
    country: 'Australia',
    university: 'University of Sydney',
    course: 'Master of Public Health',
    result: 'Visa Approved with OSHC Cover',
    text: 'The team was always there to support me. I am now studying in Australia, and it would not have been possible without their step-by-step guidance!',
    rating: 5,
    type: 'testimonial',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    order: 9,
    isActive: true,
  },
];

async function seed() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ytc';
  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB:', mongoUri);

  const Testimonial = require('../models/Testimonial');

  // Clear existing testimonials & stories to avoid duplicates
  await Testimonial.deleteMany({});

  for (const item of STORIES_AND_TESTIMONIALS) {
    await Testimonial.create(item);
  }

  console.log(`Successfully seeded ${STORIES_AND_TESTIMONIALS.length} Student Stories & Testimonials.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Error seeding student stories:', err);
  process.exit(1);
});

