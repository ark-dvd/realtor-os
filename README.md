# RealtorOS 🏠

A white-label, multi-tenant real estate SaaS platform with a cinematic design aesthetic.

![RealtorOS](https://via.placeholder.com/1200x630/1A1A1A/C9A962?text=RealtorOS)

## ✨ Features

- **Multi-Tenant Architecture**: Single codebase serves multiple realtor sites based on domain
- **Cinematic Design**: Dramatic, luxury-focused UI with video heroes and editorial layouts
- **Dynamic Theming**: Each tenant can customize colors, fonts, and branding
- **Property Listings**: Beautiful property pages with gallery, video support, and accordion details
- **Client Dashboard**: "My Home Journey" - Pizza tracker style transaction progress
- **Sanity CMS**: Headless content management for properties and tenant config
- **ISR/Caching**: Fast page loads with Incremental Static Regeneration

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + Framer Motion
- **CMS**: Sanity.io
- **Hosting**: Netlify
- **Rate Limiting**: Upstash Redis (optional)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Sanity account (free tier works)
- Netlify account

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Sanity

```bash
# Create a new Sanity project
cd sanity
npm install
npx sanity init

# Deploy the studio
npx sanity deploy
```

### 3. Configure Environment

```bash
# Copy the example env file
cp .env.example .env.local

# Fill in your values:
# - NEXT_PUBLIC_SANITY_PROJECT_ID
# - NEXT_PUBLIC_SANITY_DATASET
# - SANITY_API_TOKEN
```

### 4. Create Your First Tenant

In Sanity Studio, create an `agentSettings` document:

```json
{
  "domain": "localhost",
  "agentName": "Jane Smith",
  "brokerageName": "Luxury Homes Realty",
  "branding": {
    "primaryColor": "#1A1A1A",
    "secondaryColor": "#2D2D2D",
    "accentColor": "#C9A962",
    "fontHeading": "Cormorant Garamond",
    "fontBody": "Plus Jakarta Sans"
  },
  "contactInfo": {
    "email": "jane@example.com",
    "phone": "(512) 555-0123"
  }
}
```

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
realtoros/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage
│   ├── properties/        # Property listings
│   ├── dashboard/         # Client portal
│   ├── about/            # About page
│   ├── contact/          # Contact page
│   └── api/              # API routes
├── components/
│   ├── layout/           # Header, Footer, TenantProvider
│   ├── home/             # Hero, FeaturedProperties
│   ├── property/         # PropertyCard, Gallery, etc.
│   ├── dashboard/        # PizzaTracker
│   └── ui/               # Reusable components
├── lib/
│   ├── sanity/           # Sanity client & queries
│   ├── types/            # TypeScript definitions
│   └── utils/            # Helper functions
├── sanity/
│   └── schemas/          # Sanity document schemas
└── public/               # Static assets
```

## 🎨 Theming

Each tenant can customize:

| Property | CSS Variable | Default |
|----------|--------------|---------|
| Primary Color | `--color-primary` | `#1A1A1A` |
| Secondary Color | `--color-secondary` | `#2D2D2D` |
| Accent Color | `--color-accent` | `#C9A962` |
| Heading Font | `--font-heading` | Cormorant Garamond |
| Body Font | `--font-body` | Plus Jakarta Sans |

The `TenantProvider` automatically injects CSS variables based on the domain.

## 🌐 Multi-Tenancy

### How It Works

1. Middleware extracts the hostname from the request
2. Queries Sanity for `agentSettings` matching that domain
3. `TenantProvider` injects tenant branding as CSS variables
4. All database queries filter by `belongsToAgent` reference

### Adding a New Tenant

1. Create an `agentSettings` document in Sanity
2. Set the `domain` field to the new domain
3. Add the domain as an alias in Netlify dashboard
4. That's it! No code changes needed.

## 📊 Data Models

### agentSettings (Tenant Config)
- `domain` - Unique domain identifier
- `agentName`, `brokerageName`
- `branding` - Colors, fonts, logos
- `contactInfo` - Email, phone, address
- `legalFooter` - Compliance text (TREC, etc.)

### property
- `belongsToAgent` - Reference to tenant (CRITICAL)
- `title`, `slug`, `price`, `status`
- `specs` - Beds, baths, sqft, etc.
- `heroType` - Video or image
- `galleryImages`, `documents`

### activeDeal (Client Dashboard)
- `belongsToAgent` - Reference to tenant
- `clientEmail` - For authentication
- `transactionStage` - 1-8 progress
- `keyDates` - Important deadlines
- `dealDocumentsPrivate` - Secure documents

## 🔒 Security

- **Data Isolation**: All queries filter by tenant
- **CORS**: Configured for specific domains
- **Auth**: Ready for Netlify Identity or Auth0
- **Rate Limiting**: Upstash Redis integration

## 🚢 Deployment

### Netlify (Recommended)

```bash
# Build the project
npm run build

# Deploy to Netlify
netlify deploy --prod
```

Or connect your Git repo for automatic deployments.

### Environment Variables

Set these in Netlify dashboard:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_API_TOKEN`
- `DEFAULT_TENANT_DOMAIN`

## 📈 Roadmap

- [x] Multi-tenant architecture
- [x] Cinematic hero with video
- [x] Property listings & detail pages
- [x] Client dashboard (Pizza Tracker)
- [x] Dynamic theming
- [ ] AI Agent (Gemini integration) - Phase 2
- [ ] Document Q&A with File API
- [ ] Netlify Blobs caching
- [ ] Email notifications
- [ ] Analytics dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

---

Built with ❤️ using Next.js, Sanity, and Tailwind CSS.
