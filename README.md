# Partner Portal

A customer/partner portal for accessing strategic enablement content including competitive battle cards, announcements, and resources.

## Features

- **Authentication**: Secure login with email/password using NextAuth.js and bcrypt
- **Role-Based Access Control**: Admin and Partner roles
- **Battle Cards**: Competitive intelligence with markdown content, tagging, and filtering
- **Industries**: Browse content by industry
- **Resources**: Sales enablement assets organized by category
- **Announcements**: Latest updates and news
- **Global Search**: Search across all content types (Ctrl+K)
- **Responsive Design**: Mobile-friendly with collapsible sidebar
- **Dark Mode Premium UI**: Built with Tailwind CSS and shadcn/ui

## Prerequisites

- Node.js LTS (>=20)
- npm
- Windows 11 + PowerShell (or any Unix-like shell)

## Setup Instructions

### 1. Clone and Navigate

```powershell
cd partner-portal
```

### 2. Install Dependencies

```powershell
npm install
```

### 3. Configure Environment Variables

Copy the example environment file and fill in the values:

```powershell
Copy-Item .env.example .env
```

Edit `.env` and set the following:

```env
# Generate a secure secret for NextAuth
# Run: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
NEXTAUTH_SECRET="your-generated-secret-here"

# Update seed passwords (optional - defaults work for local development)
SEED_ADMIN_PASSWORD="YourSecureAdminPassword123!"
SEED_PARTNER_PASSWORD="YourSecurePartnerPassword123!"
```

### 4. Setup the Database

Generate Prisma client and run migrations:

```powershell
npm run prisma:generate
npm run prisma:migrate
```

When prompted for a migration name, enter: `init`

### 5. Seed the Database

```powershell
npm run prisma:seed
```

This creates:
- Admin user: `admin@local.test`
- Partner user: `partner@local.test`
- Sample battle cards and announcements

### 6. Set the Kzero Orange Color

**IMPORTANT**: Before running the app, you need to set the correct orange accent color from kzero.com:

1. Open https://kzero.com in your browser
2. Open DevTools (F12)
3. Inspect the main CTA button
4. Copy the background color (hex value)
5. Open `app/globals.css`
6. Update the `--kzero-orange` variable:

```css
:root {
  --kzero-orange: #FF6B35; /* Replace with actual color from kzero.com */
}
```

### 7. Start the Development Server

```powershell
npm run dev
```

Open http://localhost:3000 in your browser.

## Default Credentials

After seeding, you can log in with:

| Role    | Email                 | Password                      |
|---------|----------------------|-------------------------------|
| Admin   | admin@local.test     | ChangeMeAdmin123!             |
| Partner | partner@local.test   | ChangeMePartner123!           |

**Note**: These passwords are defined in your `.env` file. Change them before deploying.

## Available Scripts

```powershell
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run prisma:generate   # Generate Prisma client
npm run prisma:migrate    # Run database migrations
npm run prisma:seed       # Seed database with sample data

# Code Quality
npm run lint         # Run ESLint
```

## Smoke Test Checklist

Run through these tests after setup to verify everything works:

### Authentication
- [ ] Navigate to http://localhost:3000 (should redirect to /signin)
- [ ] Sign in as admin (admin@local.test / ChangeMeAdmin123!)
- [ ] Verify redirect to /app (Dashboard)
- [ ] Sign out and verify redirect back to /signin
- [ ] Sign in as partner (partner@local.test / ChangeMePartner123!)
- [ ] Verify Dashboard loads successfully

### Navigation
- [ ] Click through all sidebar items: Dashboard, Battle Cards, Industries, Resources, Announcements, Account Settings
- [ ] Verify active state highlights current page
- [ ] Test mobile menu (resize browser or use mobile view)

### Battle Cards (Admin)
- [ ] As admin, go to Battle Cards
- [ ] Click "Create Battle Card"
- [ ] Fill form: Title, Summary, Competitor, Industry, Content (markdown)
- [ ] Add some tags
- [ ] Save and verify redirect to detail view
- [ ] Edit the battle card and verify changes save
- [ ] Delete the battle card and verify removal

### Battle Cards (Partner)
- [ ] As partner, go to Battle Cards
- [ ] Verify "Create" button is NOT visible
- [ ] View existing battle cards
- [ ] Verify edit/delete actions are NOT available

### Industries
- [ ] Go to Industries page
- [ ] Click on an industry
- [ ] Verify battle cards filter correctly
- [ ] Click "Clear filter" to reset

### Resources
- [ ] Go to Resources page
- [ ] Verify resources are categorized
- [ ] Click resource links (open in new tab)

### Announcements
- [ ] Go to Announcements page
- [ ] Verify markdown content renders correctly

### Search
- [ ] Press Ctrl+K (or click search bar)
- [ ] Search for battle card titles, competitors, or industries
- [ ] Verify results appear
- [ ] Click a result and verify navigation

### Account Settings
- [ ] Go to Account Settings
- [ ] Update display name and save
- [ ] Verify success message
- [ ] Change password (current + new)
- [ ] Log out and log back in with new password
- [ ] Verify new password works

### Admin Pages
- [ ] As admin, verify Admin section appears in sidebar
- [ ] Go to Manage Users and verify user list displays
- [ ] Go to Manage Content and verify battle cards/announcements/resources tabs work

### Security
- [ ] As partner, try to access /app/admin/users directly (should redirect to /app)
- [ ] As partner, try to access /app/battle-cards/new directly (should redirect to list)
- [ ] Try to access /app without signing in (should redirect to /signin)

## Architecture

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Authentication**: NextAuth.js v4
- **Database**: Prisma ORM with SQLite (local)
- **Markdown**: react-markdown with rehype-sanitize

### Project Structure
```
partner-portal/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── app/               # Protected app pages
│   ├── signin/            # Sign in page
│   ├── globals.css        # Global styles + theme
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home (redirects)
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── *.tsx             # App components
├── lib/                   # Utilities
│   ├── auth.ts           # Auth configuration
│   └── prisma.ts         # Prisma client
├── prisma/               # Database
│   ├── schema.prisma     # Schema definition
│   ├── migrations/       # Database migrations
│   └── seed.ts          # Seed script
├── .env.example          # Environment template
└── README.md            # This file
```

### Database Schema

**User**
- id, email, name, passwordHash, role (partner/admin), createdAt, updatedAt

**BattleCard**
- id, title, summary, competitor, industry, contentMarkdown, published, createdAt, updatedAt
- Relations: createdBy (User), tags (Tag[])

**Tag**
- id, name, createdAt
- Relations: battleCards (BattleCard[])

**Announcement**
- id, title, contentMarkdown, published, createdAt, updatedAt
- Relations: createdBy (User)

**Resource**
- id, title, url, category, description, published, createdAt, updatedAt
- Relations: createdBy (User)

## Vercel Deployment

### Prerequisites
1. Vercel account
2. Git repository pushed to GitHub/GitLab/Bitbucket

### Steps

1. **Install Vercel CLI** (optional):
   ```powershell
   npm i -g vercel
   ```

2. **Environment Variables**:
   In Vercel dashboard, add these environment variables:
   - `NEXTAUTH_SECRET`: Generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   - `NEXTAUTH_URL`: Your deployed URL (e.g., `https://your-app.vercel.app`)
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`, etc. (for initial seed)

3. **Switch to PostgreSQL**:
   
   For production, use PostgreSQL instead of SQLite:
   
   ```powershell
   # Install Vercel Postgres (optional)
   npm install @vercel/postgres
   ```
   
   Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
   
   Run migrations:
   ```powershell
   npx prisma migrate deploy
   ```

4. **Deploy**:
   ```powershell
   vercel
   ```

   Or connect your Git repo in Vercel dashboard for automatic deployments.

### Important Notes for Vercel

- **Serverless**: This app uses Next.js App Router which works well with Vercel's serverless functions
- **Database**: SQLite won't work on Vercel (read-only filesystem). Use Vercel Postgres, Neon, or another PostgreSQL provider
- **Auth**: `NEXTAUTH_SECRET` is required for production
- **Images**: Update `next.config.js` if using external images

### Official Resources
- [Next.js on Vercel](https://nextjs.org/docs/deployment)
- [Prisma with Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)

## Security Considerations

- Passwords are hashed with bcrypt (12 rounds)
- Session-based authentication with JWT
- Middleware protects all `/app/*` routes
- Role-based access control for admin actions
- SQL injection protection via Prisma ORM
- XSS protection via react-markdown sanitization
- CSRF protection via NextAuth.js

## License

Private - For internal use only

## Support

For issues or questions, contact the development team.
