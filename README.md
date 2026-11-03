# YTC Global Education & Overseas Careers Platform

A full-stack, enterprise-grade overseas education consultancy and international talent recruitment platform. Built with **Next.js 16 (App Router & Turbopack)**, **React 19**, **Tailwind CSS v4**, and an **Express 5 REST API** backed by **MongoDB**.

---

## 🌟 Key Features

### Public Portal (Students & Partners)
- **Top Study Destinations**: Dedicated country guides for USA, UK, Canada, Australia, Germany, Ireland, New Zealand, and UAE.
- **Search Partner Universities**: Interactive institution directory with multi-filter search (by destination country, study discipline, and QS ranking), plus dedicated dynamic profile pages (`/partner-universities/[slug]`).
- **Student Services**: Comprehensive pathways for university selection, visa guidance, IELTS preparation, and accommodation assistance.
- **Overseas Recruitment & B2B Manpower**: Specialized corporate staffing portal with job postings and CV submission workflows.
- **Dynamic Contact Hub**: Interactive consultation booking with real-time Corporate Headquarters details and Regional Liaison Lounges.
- **KC Overseas-Style Newsletter & Subscriptions**: Newsletter ribbon with interest categorization and deduplication.
- **SEO & Performance Optimization**: Dynamic OpenGraph tags, automated `robots.txt`, XML sitemap (`/sitemap.xml`), and 308 canonical redirects.

### Admin CMS & Management Portal (`/admin`)
- **Protected RBAC Access**: Role-based authentication (`super_admin`, `counsellor`, `editor`) secured with JWT and HttpOnly cookies.
- **Leads & Inquiries CRM**: Real-time management of student consultation requests, status tracking, internal counselor notes, and CSV export.
- **Job Applications Desk**: Review recruitment applicants, filter by job role, and manage resume/CV documents.
- **Hero & Content Live Studios**: Real-time visual editors for the homepage hero, about story sections, statistics, and partner universities.
- **Contact & Liaison Lounges Studio**: Instant CRUD management for corporate headquarters information and worldwide liaison lounges.
- **Footer & Socials Studio**: Dynamic control over industry recognitions (AIRC, ICEF, British Council, etc.) and active social media channels.
- **Staff Management**: Add, update, and manage counselor accounts with forced password change capabilities.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 16.4 (Turbopack, App Router), React 19, Tailwind CSS v4, Framer Motion, Lucide React |
| **Backend** | Node.js, Express 5.3, MongoDB, Mongoose 9, Multer |
| **Security & Auth** | JWT (`jsonwebtoken`), `bcryptjs`, `helmet`, `cookie-parser`, `express-rate-limit`, Zod schema validation |
| **Cloud & Media** | Cloudinary (cloud image asset storage), Nodemailer |

---

## 📁 Repository Structure

```
.
├── client/                      # Next.js 16 Frontend
│   ├── public/                  # Static assets (flags, hero banners, icons)
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/          # Authentication pages (/login)
│   │   │   ├── (website)/       # Public pages (/, /about, /services, /contact, /partner-universities)
│   │   │   ├── admin/           # Protected admin dashboard, CRM, and CMS studios
│   │   │   ├── component/       # Reusable UI components & modals
│   │   │   ├── context/         # Auth and client state contexts
│   │   │   ├── data/            # Fallback static datasets
│   │   │   ├── lib/             # API client & helper utilities
│   │   │   ├── robots.js        # Dynamic crawler index directives
│   │   │   └── sitemap.js       # Dynamic XML sitemap generator
│   │   ├── next.config.mjs      # Next.js & Turbopack configuration
│   │   └── package.json
│   ├── .env.example
│   └── .gitignore
│
├── server/                      # Express 5 REST API
│   ├── config/                  # Database connection (MongoDB)
│   ├── controllers/             # REST API business logic controllers
│   ├── data/                    # Seed datasets (universities, countries, content)
│   ├── middlewares/             # JWT auth, rate limiters, upload handlers, Zod validators
│   ├── models/                  # Mongoose database schemas
│   ├── routes/                  # Express API route declarations
│   ├── scripts/                 # Automated seeding and QA test scripts
│   ├── services/                # Cloudinary upload and email services
│   ├── utils/                   # Async handler, JWT generators, CRUD factory
│   ├── validations/             # Zod input validation schemas
│   ├── app.js                   # Express application entry point
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
├── .gitignore                   # Root repository gitignore
└── README.md                    # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.17+ or v20+ recommended
- **MongoDB**: v6.0+ local instance or MongoDB Atlas URI
- **npm** or **pnpm**

---

### 1. Backend Setup

```bash
# Navigate to backend directory
cd server

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
```

Edit `server/.env` with your configuration:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ytc
CLIENT_URL=http://localhost:3000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=1d

# Optional Cloudinary Configuration (for photo uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Optional SMTP Configuration (for notification emails)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
SMTP_FROM=no-reply@ytcglobal.com
```

#### Seed Initial Data & Admin Account
```bash
# Create initial super admin user (admin@example.com / Password@123)
npm run seed:admin

# Populate destinations, partner universities, and CMS content
npm run seed:content

# Start Express server in development mode
npm run dev
```

The API will be available at `http://localhost:5000`.

---

### 2. Frontend Setup

```bash
# Open a new terminal and navigate to client
cd client

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
```

Edit `client/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

#### Run Frontend
```bash
# Start Next.js development server with Turbopack
npm run dev

# Or build for production
npm run build
npm run start
```

The website will be live at `http://localhost:3000`.

---

## 🛡️ Default Admin Credentials (Development)

After running `npm run seed:admin`:
- **URL**: `http://localhost:3000/login`
- **Email**: `admin@example.com`
- **Password**: `Password@123`

---

## 🧪 Testing & Verification

A comprehensive automated QA test suite is included in `server/scripts/runQATests.js`:

```bash
cd server
node scripts/runQATests.js
```

Runs 40+ automated tests covering:
- Public route health & HTTP status codes
- API endpoints & controllers
- Lead submission & validation
- Newsletter subscription & deduplication
- Security barriers (401 on unauthorized access)
- SEO robots.txt & XML sitemap generation
- 308 canonical redirects

---

## 📄 License
This project is proprietary and confidential. Developed for YTC Global Education.
