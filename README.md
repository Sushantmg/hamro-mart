# Hamro Mart

A full-stack e-commerce web application built with **Next.js 15**, **React 19**, **TypeScript**, and **Tailwind CSS v4**. Features product browsing, cart management, wishlist, user authentication, orders, and an admin dashboard.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15.3.3 (App Router, Turbopack) |
| Language | TypeScript |
| UI | React 19 |
| Styling | Tailwind CSS v4 (Dark Mode) |
| State | React Context API (Cart, Theme, Wishlist) |
| Icons | Heroicons, React Icons |
| Animations | Framer Motion |
| Notifications | React Hot Toast |
| Auth | Cookie-based (js-cookie) |
| Database | Local JSON file (`data/db.json`) |

## Architecture

```
hamro-mart/
├── data/
│   └── db.json                          # JSON database (products, users, orders, reviews, wishlist)
├── src/
│   ├── app/                             # Next.js App Router
│   │   ├── layout.tsx                   # Root layout (providers, navbar, toaster)
│   │   ├── page.tsx                     # Homepage
│   │   ├── not-found.tsx                # Custom 404 page
│   │   ├── globals.css                  # Tailwind imports + config
│   │   ├── login/page.tsx               # User login
│   │   ├── register/page.tsx            # User registration
│   │   ├── profile/page.tsx             # User profile
│   │   ├── products/
│   │   │   ├── page.tsx                 # Product listing (search, filter, sort)
│   │   │   └── [id]/page.tsx            # Product detail + reviews
│   │   ├── cart/page.tsx                # Shopping cart
│   │   ├── checkout/page.tsx            # Checkout & order placement
│   │   ├── wishlist/page.tsx            # Saved items
│   │   ├── orders/page.tsx              # Order history
│   │   ├── admin/
│   │   │   ├── layout.tsx               # Admin sidebar layout
│   │   │   ├── page.tsx                 # Admin dashboard
│   │   │   ├── products/page.tsx        # Product management (CRUD)
│   │   │   └── users/page.tsx           # User management
│   │   └── api/
│   │       ├── products/route.ts        # GET/POST products
│   │       ├── products/[id]/route.ts   # GET/PUT/DELETE product
│   │       ├── users/route.ts           # GET users (no passwords)
│   │       ├── users/[id]/route.ts      # PUT/DELETE user
│   │       ├── wishlist/route.ts        # GET/POST wishlist
│   │       ├── wishlist/[id]/route.ts   # DELETE wishlist item
│   │       ├── orders/route.ts          # GET/POST orders
│   │       ├── reviews/route.ts         # GET/POST reviews
│   │       ├── categories/route.ts      # GET categories
│   │       └── auth/
│   │           ├── login/route.ts       # POST login
│   │           └── signup/route.ts      # POST register
│   ├── context/
│   │   ├── CartContext.tsx               # Cart state + localStorage persistence
│   │   ├── WishlistContext.tsx           # Wishlist state + API sync
│   │   └── ThemeContext.tsx              # Dark/light mode toggle
│   ├── lib/
│   │   └── db.ts                        # Shared database utility (readDB/writeDB)
│   ├── _components/                     # Reusable UI components
│   │   ├── Navbar.tsx                   # Navigation bar (auth-aware, cart badge)
│   │   ├── Searchbar.tsx                # Functional search bar
│   │   └── home/
│   │       ├── Hero.tsx                 # Hero banner
│   │       ├── Features.tsx             # Feature cards
│   │       ├── AD.tsx                   # Promotional section
│   │       ├── Categories.tsx           # Category icons
│   │       └── Footer.tsx               # Footer with newsletter
│   └── _pages/                          # Page-level components
│       ├── Home.tsx                     # Homepage composition
│       └── Products.tsx                 # Product grid with filters/search/wishlist
├── tailwind.config.js
├── next.config.ts
├── tsconfig.json
└── package.json
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with hero, features, products, categories |
| `/products` | Full product listing with search, category filter, price sorting |
| `/products/[id]` | Product detail with images, pricing, reviews |
| `/cart` | Shopping cart with quantity controls |
| `/checkout` | Order summary and placement |
| `/wishlist` | Saved products for later |
| `/orders` | Order history with status badges |
| `/profile` | User profile with order/wishlist counts |
| `/login` | User login |
| `/register` | User registration |
| `/admin` | Admin dashboard with statistics |
| `/admin/products` | Admin product management (add/edit/delete) |
| `/admin/users` | Admin user management (delete) |

## Features

### Customer
- Browse products with search, category filter, and price sorting
- View product details with images, descriptions, and discount info
- Add items to cart with localStorage persistence
- Save products to wishlist (heart toggle)
- Place orders with checkout flow
- View order history with status tracking
- User profile with quick links
- User registration and login
- Dark mode support

### Admin
- Dashboard with product/user/discount/category statistics
- Manage products (add, edit, delete)
- Manage users (view, delete)
- Protected routes (requires admin token)
- Auto-redirect to admin panel after admin login

## Data Flow

```
User Action → React Component → API Route → data/db.json
                         ↓
              React Context (Cart/Wishlist/Theme)
                         ↓
              Toast Notifications
```

1. **Products** stored in `data/db.json`, served via `/api/products`
2. **Auth** via `/api/auth/login` and `/api/auth/signup` with role-based tokens
3. **Cart** managed via `CartContext` with localStorage persistence
4. **Wishlist** managed via `WishlistContext` synced with `/api/wishlist`
5. **Orders** created via `/api/orders` and displayed in order history
6. **Reviews** submitted via `/api/reviews` and shown on product detail pages
7. **Theme** (dark/light mode) managed via `ThemeContext` with `class` strategy

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Fetch all products |
| POST | `/api/products` | Create product (admin) |
| GET | `/api/products/:id` | Fetch product by ID |
| PUT | `/api/products/:id` | Update product (admin) |
| DELETE | `/api/products/:id` | Delete product (admin) |
| GET | `/api/users` | Fetch all users (no passwords) |
| PUT | `/api/users/:id` | Update user (admin) |
| DELETE | `/api/users/:id` | Delete user (admin) |
| GET | `/api/wishlist?userId=X` | Get user wishlist |
| POST | `/api/wishlist` | Add to wishlist |
| DELETE | `/api/wishlist/:id` | Remove from wishlist |
| GET | `/api/orders?userId=X` | Get user orders |
| POST | `/api/orders` | Create new order |
| GET | `/api/reviews?productId=X` | Get product reviews |
| POST | `/api/reviews` | Submit a review |
| GET | `/api/categories` | Get all categories |
| POST | `/api/auth/login` | Login with email/password |
| POST | `/api/auth/signup` | Register new user |

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

## Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@hamromart.com | admin123 |
| User | sus@gmail.com | 1234 |
| User | testuser1@example.com | pass123 |
| User | alice@example.com | alice123 |
| User | bob@example.com | bobsecure |
