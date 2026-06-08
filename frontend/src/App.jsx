import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { logoutSuccess } from './store/slices/authSlice.js';
import { clearCart } from './store/slices/cartSlice.js';

import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import VerifyEmailPage from './pages/VerifyEmailPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';
import PizzaDetailPage from './pages/PizzaDetailPage.jsx';
import CustomizerPage from './pages/CustomizerPage.jsx';
import CartPage from './pages/CartPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import OrderTrackingPage from './pages/OrderTrackingPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

// Protected Route Wrapper
function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, user } = useSelector(s => s.auth);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (adminOnly && user?.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

// Page Transition Wrapper
function PageWrapper({ children }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }}>
      {children}
    </motion.div>
  );
}

export default function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Listen for forced logout events from API interceptors
  useEffect(() => {
    const handleForceLogout = () => {
      dispatch(logoutSuccess());
      dispatch(clearCart());
      navigate('/login');
    };
    window.addEventListener('auth-logout-redirect', handleForceLogout);
    return () => window.removeEventListener('auth-logout-redirect', handleForceLogout);
  }, [dispatch, navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PageWrapper><LandingPage /></PageWrapper>} />
            <Route path="/login" element={<PageWrapper><LoginPage /></PageWrapper>} />
            <Route path="/register" element={<PageWrapper><RegisterPage /></PageWrapper>} />
            <Route path="/verify-email" element={<PageWrapper><VerifyEmailPage /></PageWrapper>} />
            <Route path="/forgot-password" element={<PageWrapper><ForgotPasswordPage /></PageWrapper>} />
            <Route path="/reset-password/:resetToken" element={<PageWrapper><ResetPasswordPage /></PageWrapper>} />
            <Route path="/pizza/:id" element={<PageWrapper><PizzaDetailPage /></PageWrapper>} />
            <Route path="/customizer" element={<PageWrapper><CustomizerPage /></PageWrapper>} />
            <Route path="/cart" element={<PageWrapper><CartPage /></PageWrapper>} />

            {/* Protected Routes */}
            <Route path="/checkout" element={<ProtectedRoute><PageWrapper><CheckoutPage /></PageWrapper></ProtectedRoute>} />
            <Route path="/order/:id" element={<ProtectedRoute><PageWrapper><OrderTrackingPage /></PageWrapper></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><PageWrapper><ProfilePage /></PageWrapper></ProtectedRoute>} />

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute adminOnly><PageWrapper><AdminDashboard /></PageWrapper></ProtectedRoute>} />

            {/* Catch All */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
