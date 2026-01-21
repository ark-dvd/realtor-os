# Merrav Berko Real Estate - Production Deployment Guide

## 🔒 Security Architecture

This application uses **Netlify Identity** for authentication. All write operations require a valid JWT token.

### Authentication Flow
1. User clicks "Sign In" on /admin
2. Netlify Identity widget handles OAuth/email login
3. JWT token is stored client-side
4. All API requests include `Authorization: Bearer <token>`
5. Server validates token before processing

### Protected Endpoints
All `/api/admin/*` routes require authentication:
- `GET/POST/PUT/DELETE /api/admin/neighborhoods`
- `GET/POST/PUT/DELETE /api/admin/properties`
- `GET/POST/PUT/DELETE /api/admin/deals`
- `GET/PUT /api/admin/settings`
- `POST /api/admin/upload` (rate limited: 10/minute)
- `POST /api/admin/seed` (disabled by default)

---

## 🚀 Deployment Steps

### 1. Prerequisites
- Node.js 18.17+ 
- npm 9+
- Netlify account
- Sanity account with project created

### 2. Environment Variables (Netlify Dashboard)

Go to **Site settings > Environment variables** and add:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_editor_token
```

Optional (only for initial data seeding):
```
ALLOW_SEED=true
```
**⚠️ Remove ALLOW_SEED after initial setup!**

### 3. Enable Netlify Identity

1. Go to **Site settings > Identity**
2. Click **Enable Identity**
3. Under **Registration**, select **Invite only**
4. Under **Services > Git Gateway**, enable it
5. Invite your admin user(s) via email

### 4. Deploy

```bash
# Install dependencies
npm ci

# Build locally (optional)
npm run build

# Push to Git - Netlify auto-deploys
git add .
git commit -m "Production deployment"
git push
```

### 5. First-Time Setup

1. Accept the email invitation from Netlify Identity
2. Go to `https://yoursite.com/admin`
3. Sign in with your credentials
4. Click "Load Sample Data" (if ALLOW_SEED=true)
5. **Remove ALLOW_SEED from environment variables**

---

## 🖼️ Image Caching Strategy

### Problem Solved
Static images in `/public/images/` were not updating after redeployment.

### Solution
1. **Cache-Control Headers**: Images cached for 1 hour max with `must-revalidate`
2. **Content-based URLs**: Sanity images use CDN with automatic cache busting
3. **No aggressive CDN caching**: Netlify config prevents stale content

### For Static Images
To update a static image (e.g., hero-1.jpg):
1. Replace the file in `/public/images/`
2. Commit and push
3. In Netlify, trigger **"Clear cache and deploy site"**

### For Dynamic Images (Recommended)
Upload images through the Back Office → stored in Sanity CDN → automatic cache busting via asset IDs.

---

## 📁 Project Structure

```
├── app/
│   ├── admin/page.tsx          # Protected admin dashboard
│   ├── api/admin/              # Protected API routes
│   │   ├── neighborhoods/
│   │   ├── properties/
│   │   ├── deals/
│   │   ├── settings/
│   │   ├── upload/
│   │   └── seed/
│   └── (public pages...)
├── lib/
│   ├── auth/
│   │   ├── middleware.ts       # Server-side JWT verification
│   │   └── use-netlify-auth.ts # Client-side auth hook
│   ├── sanity.ts               # Sanity client
│   └── validations.ts          # Zod schemas
├── components/
├── public/
├── netlify.toml                # Netlify configuration
├── next.config.js              # Next.js configuration
└── package.json
```

---

## 🛡️ Security Checklist

- [x] No hardcoded passwords
- [x] All write APIs protected with JWT verification
- [x] Rate limiting on upload endpoint
- [x] Seed endpoint disabled by default
- [x] Input validation with Zod
- [x] Sanitized filenames on upload
- [x] Security headers configured
- [x] TypeScript strict mode enabled
- [x] ESLint enabled in build

---

## 🔧 Troubleshooting

### "Unauthorized" on admin
- Check Netlify Identity is enabled
- Verify you accepted the email invitation
- Try logging out and back in

### Images not updating
- Clear browser cache
- In Netlify: Deploys > Trigger deploy > Clear cache and deploy

### Seed not working
- Ensure `ALLOW_SEED=true` is set
- Check you're authenticated
- Check Sanity token has write permissions

### Build failing
- Run `npm run type-check` locally
- Run `npm run lint` locally
- Check environment variables are set in Netlify

---

## 📞 Support

For issues with:
- **Netlify**: support.netlify.com
- **Sanity**: sanity.io/docs
- **This codebase**: Contact the developer

---

## License

Private - All rights reserved
