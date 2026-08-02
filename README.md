# 🌴 Hawari Tours - Socotra Island Tours Website
# موقع حواري تورز - جولات جزيرة سقطرى https://www.hawari.tours/

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Prisma](https://img.shields.io/badge/Prisma-6.19-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-cyan)

**Professional, Modern, and Feature-Rich Tourism Website**

[Live Demo](#) | [Documentation](#documentation) | [Support](#support)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Documentation](#documentation)
- [Deployment](#deployment)
- [Support](#support)

---

## 🌟 Overview

Hawari Tours is a complete, professional tourism website for Socotra Island, featuring:

- 🌐 **Bilingual** - Full Arabic & English support with RTL/LTR
- 🎨 **Modern Design** - Beautiful UI with Framer Motion animations
- 🎛️ **Admin Panel** - Complete content management system
- 🧳 **Travel Guide** - Comprehensive travel information management
- 📸 **Gallery** - Image, video, and virtual tour management
- ✈️ **Tours** - Tour packages with booking system
- 📰 **News** - Blog/news management system
- 🌙 **Dark Mode** - Full dark mode support
- 📱 **Responsive** - Works perfectly on all devices

---

## ✨ Features

### Public Features:

- ✅ **Home Page** - Hero section, featured tours, testimonials
- ✅ **Tours** - Browse and book tour packages
- ✅ **Destinations** - Explore Socotra's landmarks
- ✅ **Travel Guide** - Complete travel information
- ✅ **Gallery** - Photos, videos, virtual tours, Instagram feed
- ✅ **News** - Latest updates and blog posts
- ✅ **About** - Company information
- ✅ **Contact** - Contact form with validation
- ✅ **Booking System** - Online tour booking

### Admin Features:

- 🎛️ **Dashboard** - Statistics and overview
- ✈️ **Tour Management** - CRUD operations for tours
- 📅 **Booking Management** - View and manage bookings
- 🗺️ **Destination Management** - Manage landmarks
- 📰 **News Management** - Create and edit news articles
- 👥 **User Management** - Manage users and roles
- 💬 **Message Management** - Handle contact messages
- 📸 **Gallery Management** - Manage all media content
- 🧳 **Travel Guide Management** - Complete control over:
  - Quick Tips
  - Visa Requirements
  - Flight Routes
  - Local Transportation
  - Accommodation Types
  - Safety Tips
  - Emergency Contacts
  - Packing Lists
- ⚙️ **Settings** - Site-wide settings

---

## 🛠️ Tech Stack

### Frontend:
- **Next.js 16** - React framework with App Router
- **React 19** - Latest React features
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **next/image** - Optimized image loading

### Backend:
- **Next.js API Routes** - Serverless API endpoints
- **Prisma** - Modern database ORM
- **PostgreSQL** - Robust relational database
- **JWT** - Secure authentication
- **bcryptjs** - Password hashing

### Tools & Libraries:
- **TypeScript** - Type safety (optional)
- **ESLint** - Code linting
- **Git** - Version control

---

## 🚀 Getting Started

### Prerequisites:

```bash
Node.js 18+ 
PostgreSQL 14+
npm or yarn
```

### Installation:

#### 1. Clone the repository:

```bash
git clone [repository-url]
cd hawari_tours
```

#### 2. Install dependencies:

```bash
npm install
```

#### 3. Set up environment variables:

```bash
# Copy .env.example to .env
cp .env.example .env

# Edit .env with your settings:
DATABASE_URL="postgresql://postgres:password@localhost:5432/hawari_tours"
JWT_SECRET="your-secret-key"
NODE_ENV="development"
```

#### 4. Set up the database:

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed the database
node prisma/seed-travel-guide.js
# If you have other seed files:
# node prisma/seed.js
```

#### 5. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
hawari_tours/
├── app/                      # Next.js App Router
│   ├── admin/               # Admin panel pages
│   │   ├── travel-guide/    # Travel guide management
│   │   │   └── tabs/        # Individual tab components
│   │   ├── gallery/         # Gallery management
│   │   ├── tours/           # Tour management
│   │   └── ...
│   ├── api/                 # API routes
│   │   ├── admin/           # Admin APIs
│   │   │   └── travel-guide/ # Travel guide API
│   │   └── auth/            # Authentication APIs
│   ├── gallery/             # Public gallery page
│   ├── travel-guide/        # Public travel guide
│   ├── tours/               # Public tours pages
│   └── ...
├── components/              # React components
│   ├── admin/              # Admin components
│   └── ...
├── contexts/               # React contexts
│   ├── AppContext.jsx      # App-wide state
│   └── AuthContext.jsx     # Authentication
├── hooks/                  # Custom React hooks
├── lib/                    # Utility libraries
│   ├── prisma.js          # Prisma client
│   ├── auth.js            # Auth utilities
│   └── apiAuth.js         # API auth middleware
├── prisma/                 # Database
│   ├── schema.prisma      # Database schema
│   └── seed-travel-guide.js # Seed script
├── public/                 # Static files
├── .env.example           # Environment variables example
├── next.config.js         # Next.js configuration
├── package.json           # Dependencies
├── tailwind.config.js     # Tailwind configuration
└── README.md              # This file
```

---

## 📚 Documentation

### For Developers:
- **[PROJECT_DELIVERY_GUIDE.md](./PROJECT_DELIVERY_GUIDE.md)** - Complete delivery guide
- **[TRAVEL_GUIDE_COMPLETE_SYSTEM.md](./TRAVEL_GUIDE_COMPLETE_SYSTEM.md)** - Travel guide system documentation

### For End Users:
- **[QUICK_START_FOR_CLIENT.md](./QUICK_START_FOR_CLIENT.md)** - Quick start guide
- **[ADMIN_TRAVEL_GUIDE_NOW_READY.md](./ADMIN_TRAVEL_GUIDE_NOW_READY.md)** - Admin panel guide

---

## 🌐 Deployment

### Option 1: Vercel (Recommended)

#### 1. Set up database (Supabase/Neon/Railway):

```bash
# Get your database URL from:
# - Supabase: https://supabase.com
# - Neon: https://neon.tech
# - Railway: https://railway.app
```

#### 2. Push schema and seed data:

```bash
# Update DATABASE_URL in .env
npx prisma db push
node prisma/seed-travel-guide.js
```

#### 3. Deploy to Vercel:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel Dashboard:
# - DATABASE_URL
# - JWT_SECRET
# - NODE_ENV=production
```

### Option 2: Other Platforms

The project can be deployed to any platform supporting Next.js:
- Netlify
- AWS
- Google Cloud
- DigitalOcean
- Heroku

See [PROJECT_DELIVERY_GUIDE.md](./PROJECT_DELIVERY_GUIDE.md) for detailed instructions.

---

## 🔐 Default Admin Account

After seeding, you can create an admin account via:

### Option 1: API
```bash
POST /api/auth/register
Body: {
  "email": "admin@example.com",
  "password": "YourPassword123!",
  "name": "Admin"
}

# Then update role to SUPER_ADMIN in database
```

### Option 2: Prisma Studio
```bash
npx prisma studio

# Navigate to users table
# Insert new user with role: SUPER_ADMIN
```

---

## 📊 Database Schema

The project uses PostgreSQL with Prisma ORM. Main models:

- **User** - Users and authentication
- **Tour** - Tour packages
- **Booking** - Tour bookings
- **Destination** - Landmarks and attractions
- **News** - News articles
- **Message** - Contact messages
- **GalleryImage** - Gallery images
- **GalleryVideo** - Gallery videos
- **VirtualTour** - 360° tours
- **InstagramPost** - Instagram feed
- **QuickTip** - Quick travel tips
- **VisaRequirement** - Visa requirements
- **FlightRoute** - Flight information
- **LocalTransport** - Local transportation
- **AccommodationType** - Accommodation options
- **SafetyCategory** - Safety tips
- **EmergencyContact** - Emergency contacts
- **PackingCategory** - Packing lists
- **TravelGuideSetting** - Travel guide settings
- **GallerySetting** - Gallery settings

---

## 🤝 Contributing

This is a client project. For modifications, please contact the project owner.

---

## 📝 License

© 2026 Hawari Tours. All rights reserved.

---

## 🆘 Support

For support, please refer to:

1. **Documentation** - Check the docs folder
2. **Issues** - Create an issue on GitHub (if applicable)
3. **Contact** - Email: [support-email]

---

## 🎯 Project Status

```
✅ Frontend - Complete
✅ Backend APIs - Complete
✅ Admin Panel - Complete
✅ Travel Guide System - Complete
✅ Gallery System - Complete
✅ Authentication - Complete
✅ Database - Complete
✅ Responsive Design - Complete
✅ Dark Mode - Complete
✅ Bilingual Support - Complete
✅ Documentation - Complete
```

---

## 🙏 Acknowledgments

- **Next.js** - React framework
- **Prisma** - Database ORM
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Vercel** - Hosting platform

---

<div align="center">

**Made with ❤️ for Hawari Tours**

**Socotra Island - جزيرة سقطرى**

🌴 Discover the Magic of Socotra 🌴

</div>
