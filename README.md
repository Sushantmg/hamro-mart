# Hamro Mart

A full-stack e-commerce web application built with **Next.js 15**, **React 19**, **TypeScript**, and **Tailwind CSS v4**. Features product browsing, cart management, user authentication, and an admin dashboard.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15.3.3 (App Router, Turbopack) |
| Language | TypeScript |
| UI | React 19 |
| Styling | Tailwind CSS v4 (Dark Mode) |
| State | React Context API |
| Icons | Heroicons, React Icons |
| Animations | Framer Motion |
| Notifications | React Hot Toast |
| Auth | Cookie-based (js-cookie) |
| Database | Local JSON file (`data/db.json`) |

## Architecture

```
hamro-mart/
├── data/
│   └── db.json                          # JSON database (products + users)
├── src/
│   ├── app/                             # Next.js App Router
│   │   ├── layout.tsx                   # Root layout (providers, navbar, toaster)
│   │   ├── page.tsx                     # Homepage
│   │   ├── not-found.tsx                # Custom 404 page
│   │   ├── globals.css                  # Tailwind imports + config
│   │   ├── login/page.tsx               # User login
│   │   ├── register/page.tsx            # User registration
│   │   ├── products/
│   │   │   ├── page.tsx                 # Product listing
│   │   │   └── [id]/page.tsx            # Product detail
│   │   ├── cart/page.tsx                # Shopping cart
│   │   ├── admin/
│   │   │   ├── layout.tsx               # Admin sidebar layout
│   │   │   ├── page.tsx                 # Admin dashboard
│   │   │   ├── products/page.tsx        # Product management
│   │   │   └── users/page.tsx           # User management
│   │   └── api/
│   │       ├── products/route.ts        # GET all products
│   │       ├── products/[id]/route.ts   # GET product by ID
│   │       ├── users/route.ts           # GET all users
│   │       └── auth/
│   │           ├── login/route.ts       # POST login
│   │           └── signup/route.ts      # POST register
│   ├── context/
│   │   ├── CartContext.tsx               # Cart state management
│   │   └── ThemeContext.tsx              # Dark/light mode toggle
│   ├── _components/                     # Reusable UI components
│   │   ├── Navbar.tsx                   # Navigation bar
│   │   ├── Searchbar.tsx                # Search bar
│   │   ├── Img.tsx                      # App download section
│   │   └── home/
│   │       ├── Hero.tsx                 # Hero banner
│   │       ├── Features.tsx             # Feature cards
│   │       ├── AD.tsx                   # Promotional section
│   │       ├── Categories.tsx           # Category icons
│   │       └── Footer.tsx               # Footer with newsletter
│   └── _pages/                          # Page-level components
│       ├── Home.tsx                     # Homepage composition
│       └── Products.tsx                 # Product grid with filters
├── tailwind.config.js
├── next.config.ts
├── tsconfig.json
└── package.json
```

## Features

### Customer
- Browse products with search, category filter, and price sorting
- View product details with images, descriptions, and discount info
- Add items to cart and manage quantities
- User registration and login
- Dark mode support

### Admin
- Dashboard with product/user statistics
- Manage products (view, add, edit, delete)
- Manage users (view, delete)
- Protected routes (requires `ecom-token` cookie)

## Data Flow

```
User Action → React Component → API Route → data/db.json
                         ↓
              React Context (Cart/Theme)
                         ↓
              Toast Notifications
```

1. **Products** are stored in `data/db.json` and served via Next.js API routes at `/api/products`
2. **Auth** uses `/api/auth/login` and `/api/auth/signup` to validate/create users in `db.json`
3. **Cart** state is managed globally via `CartContext` (React Context)
4. **Theme** (dark/light mode) is managed via `ThemeContext` with `class` strategy

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Install & Run

```bash
# Clone the repository
git clone git@github.com:Sushantmg/hamro-mart.git
cd hamro-mart

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Fetch all products |
| GET | `/api/products/:id` | Fetch product by ID |
| GET | `/api/users` | Fetch all users |
| POST | `/api/auth/login` | Login with email/password |
| POST | `/api/auth/signup` | Register new user |

## Test Credentials

| Email | Password |
|-------|----------|
| sus@gmail.com | 1234 |
| testuser1@example.com | pass123 |
| alice@example.com | alice123 |
| bob@example.com | bobsecure |
