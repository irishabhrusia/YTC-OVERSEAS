// server/scripts/seedCountryFaqs.js
const mongoose = require('mongoose');

const COUNTRY_FAQS = {
  canada: [
    {
      question: 'What are the post-graduation work permit (PGWP) rules in Canada?',
      answer: 'Graduates from eligible Canadian Designated Learning Institutions (DLIs) can get an open Post-Graduation Work Permit (PGWP) for up to 3 years depending on program duration. This provides valuable Canadian work experience that paves the way toward permanent residency via Express Entry (Canadian Experience Class).'
    },
    {
      question: 'Can international students work while studying in Canada?',
      answer: 'Yes, international students holding a valid study permit can work up to 24 hours per week off-campus during academic sessions and full-time (up to 40 hours per week) during scheduled breaks such as summer and winter holidays.'
    },
    {
      question: 'What are the general English language requirements for Canadian universities?',
      answer: "Most Canadian universities and colleges accept IELTS (usually 6.0 to 6.5 overall with no band under 6.0), TOEFL iBT (80-90+), or PTE Academic (58-65+) for undergraduate and master's degree admissions."
    },
    {
      question: 'How much financial proof is required for a Canada student visa?',
      answer: 'Under IRCC regulations, students must demonstrate funds for their first year of tuition plus approximately CAD 20,635 for living expenses, typically verified through a Guaranteed Investment Certificate (GIC) from an approved Canadian financial institution.'
    },
    {
      question: 'What are the major intakes for Canadian universities?',
      answer: 'The primary intake is Fall (September), which has the widest selection of courses and scholarships. The secondary intake is Winter (January), and select institutions offer a Summer/Spring (May) intake.'
    }
  ],
  usa: [
    {
      question: 'What is OPT and how long can international students work in the USA after graduation?',
      answer: 'Optional Practical Training (OPT) allows F-1 student visa holders to work in the USA for up to 12 months in a job related to their field of study. STEM degree graduates can apply for an additional 24-month extension, giving a total of up to 36 months (3 years) of post-study work authorization.'
    },
    {
      question: 'Can international students work on-campus while studying in the United States?',
      answer: 'Yes, international students on an F-1 visa are permitted to work on-campus for up to 20 hours per week during academic semesters, and up to 40 hours per week during summer and winter breaks.'
    },
    {
      question: 'Are standardized tests like GRE/GMAT or SAT/ACT mandatory for US universities?',
      answer: 'Many US universities are currently test-optional or test-blind. While strong GRE/GMAT or SAT scores can strengthen scholarship and assistantship applications, many top universities waive them based on your academic GPA and profile.'
    },
    {
      question: 'What types of scholarships and funding are available for international students in the USA?',
      answer: 'US universities provide merit-based tuition waivers, departmental fellowships, and graduate assistantships (Teaching Assistantships / Research Assistantships) that often cover 50% to 100% of tuition plus provide a monthly living stipend.'
    },
    {
      question: 'When should I start applying for US universities?',
      answer: 'Applications should ideally be started 10 to 12 months prior to the intake. Deadlines for Fall intake typically range between November and February for priority consideration and university scholarships.'
    }
  ],
  uk: [
    {
      question: 'How does the UK Graduate Route (Post-Study Work Visa) work?',
      answer: 'The UK Graduate Route allows international students who successfully complete an undergraduate or master\'s degree from a recognized UK university to stay and work in the UK for 2 years. Doctoral (PhD) graduates can stay for 3 years without requiring employer sponsorship.'
    },
    {
      question: 'Can international students work during their studies in the UK?',
      answer: 'Yes, international students holding a valid Student Visa are permitted to work up to 20 hours per week during term time and full-time during official vacation periods.'
    },
    {
      question: 'Why are UK Master’s degrees popular among international students?',
      answer: 'Most master\'s degrees in the UK take only 1 year to complete (compared to 2 years in other countries). This reduces overall tuition and living expenses while accelerating your entry into the global workforce.'
    },
    {
      question: 'Do I need IELTS to study in the UK?',
      answer: 'While IELTS Academic (minimum 6.0 - 6.5) or UKVI IELTS is widely accepted, many UK universities offer IELTS waivers if you scored 70%+ in English in your 12th standard or studied at an English-medium university.'
    },
    {
      question: 'What are the primary intakes for UK universities?',
      answer: 'The largest intake is Autumn (September/October), followed by the Spring intake (January/February), which offers a wide array of business, computing, and engineering programs.'
    }
  ],
  australia: [
    {
      question: 'What is the Post-Study Work stream (Temporary Graduate Visa 485) in Australia?',
      answer: 'Graduates from Australian universities are eligible for the Subclass 485 visa, offering 2 to 4+ years of post-study work rights depending on degree level. Studying in designated regional areas grants an additional 1 to 2 years of work rights.'
    },
    {
      question: 'How many hours can international students work in Australia?',
      answer: 'Student visa (subclass 500) holders can work up to 48 hours per fortnight during study terms and unlimited hours during scheduled vacations and semester breaks.'
    },
    {
      question: 'What is Overseas Student Health Cover (OSHC)?',
      answer: 'OSHC is mandatory medical and hospital insurance that international students must hold for the full duration of their student visa in Australia, covering doctor visits, hospitalization, emergency ambulance, and select medications.'
    },
    {
      question: 'What are the key university intakes in Australia?',
      answer: 'The main intake is Semester 1 (February/March), followed by Semester 2 (July/August). A few universities also have a November trimester intake.'
    },
    {
      question: 'What are the admission requirements for Australian universities?',
      answer: 'Admissions require relevant academic transcripts, proof of English proficiency (IELTS, PTE Academic, or TOEFL), Statement of Purpose (SOP), and Genuine Student (GS) compliance documentation.'
    }
  ],
  germany: [
    {
      question: 'Is tuition really free at public universities in Germany?',
      answer: 'Yes! Most public universities in Germany charge zero tuition fees for both domestic and international students for bachelor\'s and consecutive master\'s programs. Students only pay a nominal semester contribution of €150 - €350 which includes free regional public transit.'
    },
    {
      question: 'What is a German Blocked Account (Sperrkonto)?',
      answer: 'To obtain a German student visa, international students must deposit a regulated amount (currently approx €11,208 per year) into an approved German blocked account (e.g., Expatrio, Coracle, Fintiba) to prove living funds, disbursed monthly.'
    },
    {
      question: 'Can I study in Germany if I do not speak German?',
      answer: 'Yes, German universities offer over 2,000 fully English-taught International Degree Programs, particularly at the Master\'s and PhD levels in engineering, data science, technology, and business.'
    },
    {
      question: 'What are the post-study work opportunities in Germany?',
      answer: 'Graduates from German universities can apply for an 18-month job-seeker visa to find career-track employment. Once employed, you can transition to the EU Blue Card and gain permanent residency in as little as 21 to 27 months.'
    },
    {
      question: 'What are the university intakes in Germany?',
      answer: 'The two main intakes are the Winter Semester (starting in September/October, deadline around July 15) and the Summer Semester (starting in March/April, deadline around January 15).'
    }
  ],
  ireland: [
    {
      question: 'What is the Third Level Graduate Scheme (Stay Back Option) in Ireland?',
      answer: 'Non-EEA graduates of level 9 programs (Master’s degrees) can stay and work in Ireland for up to 24 months (2 years). Level 8 graduates (Bachelor\'s honours) can stay for 12 months, with direct opportunities to transition to Critical Skills Employment Permits.'
    },
    {
      question: 'Why is Ireland known as the Silicon Valley of Europe?',
      answer: 'Ireland is the European headquarters for 9 of the top 10 global tech firms (Google, Meta, Apple, Microsoft, LinkedIn) and 8 of the top 10 pharmaceutical companies (Pfizer, Johnson & Johnson), creating unmatched career opportunities.'
    },
    {
      question: 'Can international students work part-time in Ireland?',
      answer: 'Yes, international students holding a Stamp 2 permission can work up to 20 hours per week during semester terms and up to 40 hours per week during the summer (June to September) and winter holiday periods.'
    },
    {
      question: 'What are the English language score requirements for Irish universities?',
      answer: 'Top Irish universities typically ask for an IELTS score of 6.5 overall (no band less than 6.0), TOEFL iBT 88-90+, or PTE Academic 63+.'
    }
  ],
  'new-zealand': [
    {
      question: 'What post-study work visa rights are available in New Zealand?',
      answer: 'International students who complete a degree-level qualification (Level 7 or above) can obtain a Post-Study Work Visa valid for 1 to 3 years depending on the level and duration of study.'
    },
    {
      question: 'Can I work while studying in New Zealand?',
      answer: 'Yes, most full-time student visa holders are allowed to work up to 20 hours per week during term time and full-time during scheduled holidays and semester breaks.'
    },
    {
      question: 'What are the major intakes for universities in New Zealand?',
      answer: 'The two main intakes are Semester 1 (February/March) and Semester 2 (July). Some institutions also provide a November summer semester.'
    },
    {
      question: 'Is New Zealand safe and welcoming for international students?',
      answer: 'New Zealand ranks among the top 5 safest countries globally on the Global Peace Index, offering an exceptionally friendly, high-quality, and peaceful student lifestyle.'
    }
  ],
  uae: [
    {
      question: 'Why choose the UAE for international higher education?',
      answer: 'The UAE offers world-class education from international branch campuses of top universities in the UK, USA, Australia, and France in a globally connected, tax-free business and innovation hub.'
    },
    {
      question: 'Can university graduates obtain the UAE Golden Visa?',
      answer: 'Yes, outstanding university graduates with a high cumulative GPA (usually 3.8+ from UAE universities or from top 100 global universities) can apply for the prestigious 10-year renewable UAE Golden Visa.'
    },
    {
      question: 'Are students allowed to work or intern during their studies in Dubai?',
      answer: 'Yes, university students in the UAE can take up part-time jobs and corporate internships in Dubai Knowledge Park, Dubai International Academic City, and diverse free-zone businesses.'
    },
    {
      question: 'What are the living and accommodation options for students in Dubai?',
      answer: 'Universities provide dedicated modern student residences with shuttle transportation, high-speed Wi-Fi, fitness facilities, and security, with private off-campus student accommodation readily available.'
    }
  ]
};

async function seedCountryFaqs() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ytc';
  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB:', mongoUri);

  const Country = mongoose.model('Country', new mongoose.Schema({
    slug: String,
    name: String,
    faqs: [
      {
        question: String,
        answer: String
      }
    ]
  }));

  for (const [slug, faqs] of Object.entries(COUNTRY_FAQS)) {
    const result = await Country.updateOne(
      { slug },
      { $set: { faqs } }
    );
    console.log(`Updated FAQs for [${slug}]: modifiedCount = ${result.modifiedCount}`);
  }

  console.log('Successfully seeded FAQs for all destination countries.');
  await mongoose.disconnect();
}

seedCountryFaqs().catch((err) => {
  console.error('Error seeding country FAQs:', err);
  process.exit(1);
});

