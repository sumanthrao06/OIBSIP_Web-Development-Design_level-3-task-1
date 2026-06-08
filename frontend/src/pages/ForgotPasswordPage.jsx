import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';
import api from '../services/api.js';

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.post('/auth/forgot-password', data);
      if (res.data.success) {
        setMessage(res.data.message + ' Check your server console for the reset link in development mode.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-16 p-8 bg-white border border-slate-100 rounded-[32px] shadow-premium space-y-6">
      <div className="text-center space-y-2">
        <span className="text-3xl">🔑</span>
        <h2 className="text-2xl font-black tracking-tight">Forgot your password?</h2>
        <p className="text-xs text-slate-400">Enter your email and we'll send you a password reset link.</p>
      </div>

      {message && <div className="p-4 bg-green-50 border border-green-100 text-green-700 text-xs font-semibold rounded-2xl">{message}</div>}
      {error && <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-semibold rounded-2xl">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-600">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="email"
              placeholder="name@example.com"
              {...register('email', { required: 'Email is required' })}
              className="w-full bg-slate-50 border border-slate-200 focus:border-rose-500 rounded-2xl py-3 pl-11 pr-4 text-sm font-semibold outline-none transition-all placeholder:text-slate-400"
            />
          </div>
          {errors.email && <p className="text-[10px] font-bold text-red-500">{errors.email.message}</p>}
        </div>
        <button type="submit" disabled={loading} className="w-full bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white font-bold text-sm py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      <div className="text-center">
        <Link to="/login" className="text-xs font-bold text-slate-500 hover:text-slate-700 flex items-center justify-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
        </Link>
      </div>
    </div>
  );
}
