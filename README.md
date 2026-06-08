#  SliceCraft — Premium Pizza Ordering & Customization Platform

A production-grade full-stack web application for pizza ordering, featuring a real-time pizza customization engine, JWT authentication, admin dashboard with analytics, and mock payment processing.

## Tech Stack

### Frontend
- **React 19** with Vite 6
- **Tailwind CSS** for styling
- **Redux Toolkit** for state management
- **React Router** for routing
- **Framer Motion** for animations
- **React Hook Form** for form handling
- **Recharts** for admin analytics charts
- **Axios** for HTTP requests

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication (Access + Refresh tokens)
- **Nodemailer** for email (console fallback in dev)
- **Helmet, CORS, Rate Limiting** for security

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
