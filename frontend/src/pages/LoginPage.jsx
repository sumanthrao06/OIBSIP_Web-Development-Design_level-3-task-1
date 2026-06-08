import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { KeyRound, Mail, Loader2, ArrowRight } from 'lucide-react';
import { loginSuccess, setLoading, setError, clearError } from '../store/slices/authSlice.js';
import api from '../services/api.js';

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const redirect = searchParams.get('redirect') || '/';

  const { register, handleSubmit, formState: { errors } } = useForm();

  // If already logged in, redirect away
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirect);
    }
    dispatch(clearError());
  }, [isAuthenticated, navigate, redirect, dispatch]);

  const onSubmit = async (formData) => {
    try {
      dispatch(setLoading(true));
      const res = await api.post('/auth/login', formData);
      if (res.data.success) {
        dispatch(loginSuccess({
          user: res.data.user,
          accessToken: res.data.accessToken
        }));
        navigate(redirect);
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Invalid email or password';
      dispatch(setError(errMsg));
      
      // If user is not verified, redirect to verify screen
      if (err.response?.status === 403 && errMsg.includes('verify')) {
        navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-8 bg-white border border-slate-100 rounded-[32px] shadow-premium space-y-6">
      <div className="text-center space-y-2">
        <span className="text-3xl">🍕</span>
        <h2 className="text-2xl font-black tracking-tight text-slate-800">Welcome back to SliceCraft</h2>
        <p className="text-xs text-slate-400">Please sign in to your premium pizza account to continue</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-semibold rounded-2xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        {/* Email Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-600">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="email"
              placeholder="name@example.com"
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
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-600">Password</label>
            <Link to="/forgot-password" className="text-[10px] font-bold text-rose-600 hover:text-rose-700">
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="password"
              placeholder="••••••••"
              {...register('password', { required: 'Password is required' })}
              className="w-full bg-slate-50 border border-slate-200 focus:border-rose-500 focus:bg-white rounded-2xl py-3 pl-11 pr-4 text-sm font-semibold outline-none transition-all placeholder:text-slate-400"
            />
          </div>
          {errors.password && <p className="text-[10px] font-bold text-red-500">{errors.password.message}</p>}
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
              <span>Verifying credentials...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-400">
        New to SliceCraft?{' '}
        <Link to="/register" className="font-bold text-rose-600 hover:text-rose-700">
          Create an Account
        </Link>
      </div>
    </div>
  );
}
