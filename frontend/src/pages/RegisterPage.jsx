import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, KeyRound, Phone, MapPin, Loader2, ArrowRight } from 'lucide-react';
import api from '../services/api.js';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.post('/auth/register', formData);
      if (res.data.success) {
        navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-8 bg-white border border-slate-100 rounded-[32px] shadow-premium space-y-6">
      <div className="text-center space-y-2">
        <span className="text-3xl">🍕</span>
        <h2 className="text-2xl font-black tracking-tight text-slate-800">Create your SliceCraft Account</h2>
        <p className="text-xs text-slate-400">Join our premium pizza platform and customize your orders</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-semibold rounded-2xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        {/* Name Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-600">Full Name</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="First name is fine"
              {...register('name', { required: 'Full name is required' })}
              className="w-full bg-slate-50 border border-slate-200 focus:border-rose-500 focus:bg-white rounded-2xl py-3 pl-11 pr-4 text-sm font-semibold outline-none transition-all placeholder:text-slate-400"
            />
          </div>
          {errors.name && <p className="text-[10px] font-bold text-red-500">{errors.name.message}</p>}
        </div>

        {/* Email Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-600">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="email"
              placeholder="to send your confirmation"
              {...register('email', { 
                required: 'Email address is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              className="w-full bg-slate-50 border border-slate-200 focus:border-rose-500 focus:bg-white rounded-2xl py-3 pl-11 pr-4 text-sm font-semibold outline-none transition-all placeholder:text-slate-400"
            />
          </div>
          {errors.email && <p className="text-[10px] font-bold text-red-500">{errors.email.message}</p>}
        </div>

        {/* Password Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-600">Password</label>
          <div className="relative">
            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="password"
              placeholder="Choose a strong password (min 6 chars)"
              {...register('password', { 
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' }
              })}
              className="w-full bg-slate-50 border border-slate-200 focus:border-rose-500 focus:bg-white rounded-2xl py-3 pl-11 pr-4 text-sm font-semibold outline-none transition-all placeholder:text-slate-400"
            />
          </div>
          {errors.password && <p className="text-[10px] font-bold text-red-500">{errors.password.message}</p>}
        </div>

        {/* Phone Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-600">Mobile Phone</label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="tel"
              placeholder="so we can contact you"
              {...register('phone', { required: 'Phone number is required' })}
              className="w-full bg-slate-50 border border-slate-200 focus:border-rose-500 focus:bg-white rounded-2xl py-3 pl-11 pr-4 text-sm font-semibold outline-none transition-all placeholder:text-slate-400"
            />
          </div>
          {errors.phone && <p className="text-[10px] font-bold text-red-500">{errors.phone.message}</p>}
        </div>

        {/* Address Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-600">Delivery Address</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
            <textarea
              rows="2"
              placeholder="Where should we deliver your pizza?"
              {...register('address', { required: 'Delivery address is required' })}
              className="w-full bg-slate-50 border border-slate-200 focus:border-rose-500 focus:bg-white rounded-2xl py-3 pl-11 pr-4 text-sm font-semibold outline-none transition-all placeholder:text-slate-400"
            />
          </div>
          {errors.address && <p className="text-[10px] font-bold text-red-500">{errors.address.message}</p>}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white font-bold text-sm py-3.5 rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4.5 h-4.5 animate-spin" />
              <span>Creating your account...</span>
            </>
          ) : (
            <>
              <span>Sign Up & Verify</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-rose-600 hover:text-rose-700">
          Sign In
        </Link>
      </div>
    </div>
  );
}
