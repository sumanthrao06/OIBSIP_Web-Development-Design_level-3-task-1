#  SliceCraft — Premium Pizza Ordering & Customization Platform

A production-grade full-stack web application for pizza ordering, featuring a real-time pizza customization engine, JWT authentication, admin dashboard with analytics, and mock payment processing.

---

## 🎯 Project Overview

### 1. Objective
To build an elegant, highly performant, and production-grade food-ordering system inspired by Pizza Hut's UX, but with a completely original, premium design aesthetic. The platform aims to provide a seamless user customizer engine and a robust administrative control panel to manage sales, menu items, orders, and promotions.

### 2. Steps Performed
1. **Database & Schema Design**: Designed robust MongoDB schemas using Mongoose for users, pizzas, reviews, coupons, favorites, shopping carts, and orders.
2. **Backend Development**: Implemented security-hardened API endpoints (CORS, Helmet, Rate-Limiters) with double-token JWT Authentication and console email verification logging.
3. **Database Seeding**: Created a custom database seeder script populating 25 pizzas across 6 categories, default accounts, active promo coupons, and mock order records.
4. **Redux Store Integration**: Configured Redux Toolkit for state synchronization across user sessions, shopping cart updates, and interactive customizer states.
5. **Interactive Customizer**: Developed a 7-step customizable pizza builder featuring dynamic pricing calculators and interactive SVG layers (cheese levels, sauce spread, quadrant topping mapping).
6. **Frontend Interface**: Engineered responsive user views (Landing, Pizza Details, Cart, Checkout, Order Tracking, Profiles) and a comprehensive admin portal showing live sales charts.
7. **Verification**: Executed linting checks, production builds, and validation of Vite proxy mappings to backend ports.

### 3. Tools & Technologies Used
* **Frontend UI**: React 19, Vite 6, Tailwind CSS (Vanilla CSS structure), Framer Motion (micro-animations), Recharts (data visualization), React Hook Form, Axios.
* **Backend API**: Node.js, Express.js, JWT (Token sign & verify), Bcrypt.js (password hashing).
* **Database**: MongoDB (Local/Atlas), Mongoose ODM.
* **Environment & Security**: Dotenv, Helmet, Express-Rate-Limit, CORS.

### 4. Outcome
* A fully working full-stack React and Express application running locally with Vite proxy integration.
* Zero build compilation errors (successfully verified through production-build testing).
* Preloaded database with mock configurations allowing instant checkout, customization, profile updates, and admin analytical oversight.

---

## Features

### User Features
-  JWT Authentication (Register, Login, Email Verification, Password Reset)
-  Browse 25 premium pizzas across 6 categories
-  **7-Step Pizza Customizer** with live SVG preview & instant pricing
-  Full Cart System with coupon support
-  Mock Checkout (UPI, Card, Cash on Delivery)
-  Order Tracking with visual timeline
-  Review & Rating System
-  User Profile with order history & reordering

### Admin Features
-  Analytics Dashboard (Revenue, Orders, Conversion, Charts)
-  Pizza Management (CRUD)
-  Offer & Coupon Management
-  Order Management with status updates
-  User Management (View, Block, Delete)

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### Installation

```bash
# Clone the repository
cd slicecraft

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Environment Setup

Copy the example env file:
```bash
cp backend/.env.example backend/.env
```

### Seed Database

```bash
cd backend
npm run seed
```

This creates:
- **25 pizzas** across 6 categories
- **10 offers** and **4 coupons**
- **Admin account**: `admin@slicecraft.com` / `Admin@123`
- **User account**: `suman@slicecraft.com` / `Password@123`

### Run Development Servers

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## API Endpoints

| Module | Method | Endpoint | Access |
|--------|--------|----------|--------|
| Auth | POST | `/api/auth/register` | Public |
| Auth | POST | `/api/auth/login` | Public |
| Auth | POST | `/api/auth/verify-email` | Public |
| Auth | POST | `/api/auth/forgot-password` | Public |
| Auth | POST | `/api/auth/reset-password/:token` | Public |
| Auth | POST | `/api/auth/refresh` | Public |
| Auth | POST | `/api/auth/logout` | Private |
| Auth | GET/PUT | `/api/auth/profile` | Private |
| Pizzas | GET | `/api/pizzas` | Public |
| Pizzas | GET | `/api/pizzas/:id` | Public |
| Pizzas | POST/PUT/DELETE | `/api/pizzas/:id` | Admin |
| Offers | GET | `/api/offers` | Public |
| Offers | POST/PUT/DELETE | `/api/offers/:id` | Admin |
| Cart | GET/PUT | `/api/cart` | Private |
| Coupons | POST | `/api/coupons/validate` | Private |
| Orders | POST | `/api/orders` | Private |
| Orders | GET | `/api/orders/my-orders` | Private |
| Orders | GET | `/api/orders/:id` | Private |
| Orders | PUT | `/api/orders/:id/status` | Admin |
| Reviews | GET | `/api/reviews/pizza/:id` | Public |
| Reviews | POST/PUT/DELETE | `/api/reviews/:id` | Private |
| Admin | GET | `/api/admin/stats` | Admin |
| Admin | GET | `/api/admin/users` | Admin |

## Database Collections

- Users, Pizzas, Offers, Orders, Coupons, Reviews, Cart, Favorites

## License

This project is built for portfolio and educational purposes.
