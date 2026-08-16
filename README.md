# IBEE Clothing

**Wear Your Identity.**

A full-stack e-commerce storefront for IBEE Clothing, built with Next.js, TypeScript, Tailwind CSS, Prisma, and PostgreSQL.

## Overview

This is a working MVP covering the core customer journey (browse → cart → checkout → order confirmation) plus a protected admin dashboard (products, orders, inventory, basic analytics). It's built to run locally in VS Code and deploy to Vercel + a hosted Postgres provider (Neon/Supabase/Railway).

## What's implemented vs. simplified

**Fully implemented:**
- Product catalog with categories, variants (size/color/SKU/stock), images
- Shop page with search, category/size/color filters, sorting
- Product detail page with variant selection and stock-aware "Add to cart"
- Cart (persisted client-side)
- Checkout (Cash on Delivery), with stock validated and decremented atomically on order creation
- Order confirmation page
- Customer login/register (email + password, hashed with bcrypt) and order history
- Admin dashboard: KPIs, product CRUD, order list + status updates, protected via NextAuth + middleware
- Prisma schema matching the full spec (Phase 2)
- SEO basics: metadata per page, sitemap, robots.txt
- Demo/seed data, clearly labeled as demo

**Simplified / stubbed — not production-ready as-is:**
- **Payment methods**: only Cash on Delivery. The `PaymentMethod` enum is structured so adding a gateway later doesn't require touching `Order`/`OrderItem`, but no gateway is integrated.
- **Image storage**: product images ship as local files in `/public` for demo purposes. For production, wire up Cloudinary or UploadThing (env vars are stubbed in `.env.example`) instead of committing images to the repo.
- **Automated tests**: not included. A manual testing checklist is below instead — this was a scope call to prioritize a working app over test scaffolding; happy to add a test suite (Vitest/Playwright) as a follow-up if useful.
- **Analytics**: one real chart (orders/revenue by day, from actual DB data) rather than the full metric set from the spec (city/province breakdowns, forecasting, etc.) — easy to extend once there's real order data.
- **Email notifications**: not wired up (no SendGrid/Resend integration).

## Tech Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS 4
- Prisma 7 + PostgreSQL
- NextAuth (Credentials provider, JWT sessions)
- Recharts

## Architecture

```
Browser → Next.js (pages + server actions/API routes) → Prisma → PostgreSQL
                                    ↓
                         /public (dev) or Cloudinary (prod) for images
```

## Database Design

See `prisma/schema.prisma`. Key models: User, Customer, Address, Category, Product, ProductImage, ProductVariant, Cart, CartItem, Order, OrderItem. `OrderItem` snapshots product name/price/size/color at time of purchase so later product edits never rewrite order history.

## Installation

```bash
npm install
```

(`node_modules` is excluded from the zip to keep it a reasonable size — this is standard practice. Run `npm install` once you've unzipped the project and you're good to go.)

## Environment Variables

Copy `.env.example` to `.env` and fill in:

```
DATABASE_URL=          # your Postgres connection string
NEXTAUTH_SECRET=       # generate with: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000
```

Cloudinary variables are optional — only needed if you move off local `/public` images.

## Database Setup

You need a real PostgreSQL database. Easiest options:
- **Local**: install Postgres, create a database called `ibee_clothing`
- **Free hosted**: [Neon](https://neon.tech) or [Supabase](https://supabase.com) — copy the connection string into `DATABASE_URL`

Then:

```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

The seed script creates:
- Admin login: `admin@ibee.demo` / `Admin@12345`
- Demo customer: `customer@ibee.demo` / `Customer@123`
- 5 demo products with variants and stock, clearly labeled as demo

**Change both demo passwords before any real deployment.**

## Running Locally

```bash
npm run dev
```

Visit `http://localhost:3000`. Admin dashboard is at `/admin` (log in with the admin account above first).

## Testing (manual checklist)

- [ ] Home page loads, shows featured/new arrival products
- [ ] Shop page filters (category, size, color, price) narrow results correctly
- [ ] Sorting changes product order
- [ ] Product page: selecting an out-of-stock variant disables "Add to cart"
- [ ] Cart: quantity change updates subtotal; removing last item shows empty state
- [ ] Checkout: submitting with missing required field shows validation error
- [ ] Checkout: placing an order decreases the correct variant's stock, never below 0
- [ ] Order confirmation page shows correct order number, items, total
- [ ] Customer can log in and see their order in "My Account"
- [ ] Non-admin user is redirected away from `/admin`
- [ ] Admin can update an order's status and it reflects immediately
- [ ] Admin can create a new product and it appears on the shop page

## Deployment

1. Push to GitHub (this repo is git-initialized; `.env` is gitignored).
2. Create a Postgres database on Neon/Supabase/Railway, copy the connection string.
3. Deploy to Vercel, set `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL` as environment variables.
4. Run `npx prisma migrate deploy` against the production database (Vercel build step or manually).
5. Point your domain at Vercel; HTTPS is automatic.
6. Swap local `/public` product images for Cloudinary/UploadThing before going live.

## Future Improvements

- Payment gateway integration (JazzCash/Easypaisa/card)
- Automated test suite
- Full analytics breakdown (city/province, forecasting)
- Email order confirmations
- Wishlist / saved items
- Product reviews

## Demo Data Disclaimer

All products, prices, and the admin/customer accounts in this repo are demo data for local development and testing. No real sales, reviews, or business data are represented.
