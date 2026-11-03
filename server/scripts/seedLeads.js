const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('../config/db');
const Lead = require('../models/Lead');

const sampleLeads = [
  {
    type: 'job_application',
    name: 'Aarav Sharma',
    phone: '+91 98765 43210',
    email: 'aarav.sharma@example.com',
    currentCity: 'Pune',
    jobCategory: 'IT and Engineering',
    preferredCountry: 'Germany',
    experience: '4 years',
    message: 'Senior Frontend Developer with experience in React and TypeScript.',
    sourcePage: '/overseas-recruitment',
    status: 'new',
  },
  {
    type: 'job_application',
    name: 'Maria Santos',
    phone: '+971 50 123 4567',
    email: 'maria.santos@example.com',
    currentCity: 'Dubai',
    jobCategory: 'Healthcare',
    preferredCountry: 'UK',
    experience: '6 years',
    message: 'Registered ICU Nurse looking for NHS hospital openings.',
    sourcePage: '/overseas-recruitment',
    status: 'contacted',
  },
  {
    type: 'employer_inquiry',
    name: 'Alexander Weber',
    phone: '+49 30 901820',
    email: 'a.weber@berlintech-solutions.de',
    country: 'Germany',
    companyName: 'Berlin Tech Solutions GmbH',
    positionsNeeded: 'Cloud DevOps Engineers',
    workersCount: '5-10',
    message: 'Seeking healthcare and IT manpower placement partnership.',
    sourcePage: '/overseas-recruitment',
    status: 'in_progress',
  },
  {
    type: 'consultation',
    name: 'Rohan Patel',
    phone: '+91 98234 56789',
    email: 'rohan.patel22@gmail.com',
    country: 'Canada',
    course: 'Master of Computer Science',
    message: 'Interested in Fall 2026 intake in Ontario or British Columbia.',
    sourcePage: '/study-destinations/canada',
    status: 'converted',
  },
  {
    type: 'contact',
    name: 'Sunita Deshmukh',
    phone: '+91 94220 11223',
    email: 'sunita.d@gmail.com',
    message: 'Inquiring about consultation fees and student visa guidance.',
    sourcePage: '/contact',
    status: 'closed',
  },
];

const seedLeads = async () => {
  try {
    await connectDB();
    for (const lead of sampleLeads) {
      await Lead.findOneAndUpdate(
        { email: lead.email, type: lead.type },
        lead,
        { upsert: true, returnDocument: 'after' }
      );
    }
    console.log(`✓ Seeded ${sampleLeads.length} sample leads into database.`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding leads:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedLeads();

