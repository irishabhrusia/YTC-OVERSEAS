// server/scripts/syncFrontendDataToBackend.js
// Transfers all rich frontend datasets directly into the MongoDB backend.

const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const connectDB = require('../config/db');

// Models
const Country = require('../models/Country');
const University = require('../models/University');
const Service = require('../models/Service');
const Faq = require('../models/Faq');

async function syncAllData() {
  await connectDB();
  console.log('Connected to MongoDB: mongodb://127.0.0.1:27017/ytc');

  // Dynamically import client data files
  const countriesModule = await import('../../client/src/app/data/countries.js');
  const faqsModule = await import('../../client/src/app/data/faqs.js');
  const universitiesModule = await import('../../client/src/app/data/universities.js');
  const servicesModule = await import('../../client/src/app/data/servicesData.js');

  const { countries, allCountriesList } = countriesModule;
  const faqsList = faqsModule.default || [];
  const unisList = universitiesModule.default || [];
  const servicesMap = servicesModule.servicesData || {};

  console.log(`\n1. Storing ${allCountriesList.length} Countries in Backend...`);
  const countryIdMap = {};

  for (let i = 0; i < allCountriesList.length; i++) {
    const c = allCountriesList[i];
    const countryDoc = await Country.findOneAndUpdate(
      { slug: c.slug },
      {
        slug: c.slug,
        name: c.name,
        shortName: c.shortName || c.name,
        code: c.code || '',
        flag: c.flag || '',
        flagPath: c.flagPath || '',
        heroImage: c.heroImage || '',
        heroAlt: c.heroAlt || '',
        accentColor: c.accentColor || '#2563EB',
        badge: c.badge || '',
        headline: c.headline || '',
        description: c.description || '',
        quickFacts: {
          capital: c.quickFacts?.capital || '',
          currency: c.quickFacts?.currency || '',
          intakes: c.quickFacts?.intakes || '',
          majorIntakes: c.quickFacts?.intakes || c.quickFacts?.majorIntakes || '',
          avgTuition: c.quickFacts?.avgTuition || '',
          averageTuition: c.quickFacts?.avgTuition || c.quickFacts?.averageTuition || '',
          livingExpenses: c.quickFacts?.avgLivingCost || c.quickFacts?.livingExpenses || '',
          visaProcessing: c.quickFacts?.processingTime || c.quickFacts?.visaProcessing || '',
          visaType: c.quickFacts?.visaType || '',
        },
        stats: c.stats || [],
        whyStudy: c.whyStudy || [],
        topUniversities: (c.topUniversities || []).map((u) => ({
          name: u.name,
          qsRank: u.qsRank || '',
          city: u.city || '',
          popularFor: u.popularFor || '',
          acceptanceRate: u.acceptanceRate || '',
          avgTuition: u.avgTuition || '',
        })),
        popularPrograms: c.popularPrograms || [],
        visaRequirements: c.visaRequirements || [],
        scholarships: c.scholarships || [],
        faqs: c.faqs || [],
        order: i + 1,
        isActive: true,
      },
      { upsert: true, returnDocument: 'after' }
    );
    countryIdMap[c.name.toLowerCase()] = countryDoc._id;
    countryIdMap[c.slug.toLowerCase()] = countryDoc._id;
    if (c.shortName) countryIdMap[c.shortName.toLowerCase()] = countryDoc._id;
    console.log(`  ✓ Synced Country: ${c.name} (${c.slug})`);
  }

  console.log(`\n2. Storing ${faqsList.length} FAQs in Backend...`);
  for (let i = 0; i < faqsList.length; i++) {
    const f = faqsList[i];
    await Faq.findOneAndUpdate(
      { question: f.question },
      {
        question: f.question,
        answer: f.answer,
        category: 'study_abroad',
        order: i + 1,
        isActive: true,
      },
      { upsert: true }
    );
  }
  console.log(`  ✓ Synced ${faqsList.length} FAQs`);

  console.log(`\n3. Storing ${unisList.length} Partner Universities in Backend...`);
  for (let i = 0; i < unisList.length; i++) {
    const u = unisList[i];
    const countryRef = countryIdMap[u.country?.toLowerCase()] || null;
    const slug = u.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    await University.findOneAndUpdate(
      { slug },
      {
        name: u.name,
        slug,
        country: countryRef,
        ranking: 50 + i * 15,
        tuitionFrom: 12000,
        tuitionTo: 38000,
        website: 'https://www.topuniversities.com',
        description: `Recognized world-class institution in ${u.country}.`,
        isFeatured: true,
        order: i + 1,
        isActive: true,
      },
      { upsert: true }
    );
  }
  console.log(`  ✓ Synced ${unisList.length} Universities`);

  console.log(`\n4. Storing ${Object.keys(servicesMap).length} Services in Backend...`);
  const serviceEntries = Object.values(servicesMap);
  for (let i = 0; i < serviceEntries.length; i++) {
    const s = serviceEntries[i];
    const isRecruitment = s.categorySlug === 'overseas-recruitment' || s.category?.toLowerCase().includes('recruitment');
    await Service.findOneAndUpdate(
      { slug: s.slug },
      {
        title: s.title,
        slug: s.slug,
        description: s.overview || s.tagline || s.title,
        icon: s.iconName || 'GraduationCap',
        group: isRecruitment ? 'recruitment' : 'study',
        order: i + 1,
        isActive: true,
      },
      { upsert: true }
    );
    console.log(`  ✓ Synced Service: ${s.title}`);
  }

  console.log('\n=============================================');
  console.log('All frontend data successfully stored in MongoDB!');
  console.log('=============================================\n');

  await mongoose.disconnect();
  process.exit(0);
}

syncAllData().catch((err) => {
  console.error('Sync failed:', err);
  process.exit(1);
});

