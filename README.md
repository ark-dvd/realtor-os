# Merav Berko Real Estate Website

A modern, luxury real estate website for Merav Berko, built with Next.js 14, Tailwind CSS, and Sanity CMS.

## Features

- 🏠 **Property Listings** - Beautiful property cards with filtering
- 🗺️ **Neighborhoods** - Austin neighborhood guides
- 📊 **Client Dashboard** - "My Home Journey" with transaction tracking (Pizza Tracker)
- 📝 **Back Office** - Sanity CMS for property and content management
- 📱 **Responsive** - Fully mobile-optimized
- ⚡ **Fast** - Optimized for Core Web Vitals

## Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **CMS**: Sanity.io
- **Hosting**: Netlify
- **Animations**: Framer Motion

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

### 3. Set Up Sanity CMS (Optional)

1. Create a Sanity project at [sanity.io](https://www.sanity.io/)
2. Install Sanity CLI: `npm install -g @sanity/cli`
3. Navigate to `/sanity` folder and run `sanity init`
4. Add your project ID to `.env.local`

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── about/             # About page
│   ├── buyers/            # Buyer resources
│   ├── contact/           # Contact page
│   ├── dashboard/         # Client portal
│   ├── neighborhoods/     # Neighborhood pages
│   ├── properties/        # Property listings
│   └── sellers/           # Seller resources
├── components/            # React components
├── lib/                   # Utilities and Sanity client
├── public/               # Static assets
│   └── images/           # Hero images
└── sanity/               # Sanity CMS schemas
    └── schemas/          # Content type definitions
```

## Sanity Schemas

- **property** - Real estate listings
- **neighborhood** - Austin neighborhoods
- **activeDeal** - Client transaction tracking

## Deployment

### Netlify

1. Push to GitHub
2. Connect repo to Netlify
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. Add environment variables

## Customization

### Colors

Edit `tailwind.config.ts` to change brand colors:

```js
brand: {
  navy: '#1B2B4B',
  gold: '#C9A961',
  cream: '#FAF7F2',
}
```

### Fonts

Update Google Fonts in `app/layout.tsx`

### Images

Replace hero images in `public/images/`

## License

Private - All rights reserved
