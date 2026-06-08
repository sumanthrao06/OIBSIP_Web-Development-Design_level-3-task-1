import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { KeyRound, Loader2 } from 'lucide-react';
import api from '../services/api.js';

export default function ResetPasswordPage() {
  const { resetToken } = useParams();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.post(`/auth/reset-password/${resetToken}`, { password: data.password, email });
      if (res.data.success) {
        setMessage(res.data.message);
        setTimeout(() => navigate('/login'), 2500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-16 p-8 bg-white border border-slate-100 rounded-[32px] shadow-premium space-y-6">
      <div className="text-center space-y-2">
        <span className="text-3xl">🔐</span>
        <h2 className="text-2xl font-black tracking-tight">Reset Password</h2>
        <p className="text-xs text-slate-400">Create a new password for <span className="font-bold text-slate-600">{email}</span></p>
      </div>

      {message && <div className="p-4 bg-green-50 border border-green-100 text-green-700 text-xs font-semibold rounded-2xl">{message}</div>}
      {error && <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-semibold rounded-2xl">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-600">New Password</label>
          <div className="relative">
            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="password" placeholder="Min. 6 characters" {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })} className="w-full bg-slate-50 border border-slate-200 focus:border-rose-500 rounded-2xl py-3 pl-11 pr-4 text-sm font-semibold outline-none transition-all placeholder:text-slate-400" />
          </div>
          {errors.password && <p className="text-[10px] font-bold text-red-500">{errors.password.message}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-600">Confirm Password</label>
          <div className="relative">
            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="password" placeholder="Re-enter password" {...register('confirmPassword', { required: 'Please confirm password', validate: val => val === watch('password') || 'Passwords do not match' })} className="w-full bg-slate-50 border border-slate-200 focus:border-rose-500 rounded-2xl py-3 pl-11 pr-4 text-sm font-semibold outline-none transition-all placeholder:text-slate-400" />
          </div>
          {errors.confirmPassword && <p className="text-[10px] font-bold text-red-500">{errors.confirmPassword.message}</p>}
        </div>
        <button type="submit" disabled={loading} className="w-full bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white font-bold text-sm py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
}
