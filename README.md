# IndustryNeed — Industrial Supplies, Delivered in 2 Hours

A B2B quick-commerce platform for industrial spare parts. Think "Blinkit for factories."

## Tech Stack

- **Framework:** Next.js 14 (App Router, TypeScript)
- **Styling:** Tailwind CSS 3.4
- **Animations:** Framer Motion
- **Database:** SQLite via Prisma
- **Auth:** NextAuth.js (credential-based admin)
- **Icons:** Lucide React
- **Charts:** Recharts

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` with your values (defaults work for development).

### 3. Set up the database

```bash
npx prisma db push
```

### 4. Seed the database

```bash
npm run db:seed
```

Or use the admin dashboard: go to `/admin` and click "Seed Database".

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with full marketing site |
| `/products` | Product catalog with filters and search |
| `/products/[slug]` | Product detail page |
| `/quote` | Quote/cart page with checkout |
| `/track` | Order tracking |
| `/about` | About page |
| `/admin` | Admin dashboard |
| `/admin/quotes` | Quote management |
| `/admin/products` | Product CRUD |
| `/admin/orders` | Order management |
| `/admin/categories` | Category overview |

## Admin Login

- **Email:** admin@industryneed.in
- **Password:** admin123

## API Routes

- `GET/POST /api/products` — List/create products
- `GET/PUT/DELETE /api/products/[slug]` — Product CRUD
- `GET/POST /api/quotes` — List/create quotes
- `PATCH /api/quotes/[id]` — Update quote status
- `GET/POST /api/orders` — List/create orders
- `PATCH /api/orders/[id]` — Update order status
- `GET /api/orders/track` — Track order by number/phone
- `POST /api/seed` — Seed database with sample data
- `POST /api/razorpay/create-order` — Create payment order
- `POST /api/razorpay/verify` — Verify payment

## Deployment

### Vercel

```bash
npx vercel
```

### Docker

```bash
docker build -t industryneed .
docker run -p 3000:3000 industryneed
```

## License

Private — All rights reserved.
