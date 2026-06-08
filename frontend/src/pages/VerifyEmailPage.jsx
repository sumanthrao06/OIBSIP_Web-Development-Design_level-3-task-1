import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, Loader2 } from 'lucide-react';
import api from '../services/api.js';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const res = await api.post('/auth/verify-email', { email, code });
      if (res.data.success) {
        setMessage(res.data.message);
        setTimeout(() => navigate('/login'), 2500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-16 p-8 bg-white border border-slate-100 rounded-[32px] shadow-premium space-y-6 text-center">
      <ShieldCheck className="w-12 h-12 text-rose-600 mx-auto" />
      <h2 className="text-2xl font-black tracking-tight">Verify Your Email</h2>
      <p className="text-xs text-slate-400">
        We sent a 6-digit verification code to <span className="font-bold text-slate-700">{email}</span>.
        Check your server console if running in development mode.
      </p>

      {message && <div className="p-4 bg-green-50 border border-green-100 text-green-700 text-xs font-semibold rounded-2xl">{message}</div>}
      {error && <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-semibold rounded-2xl">{error}</div>}

      <form onSubmit={handleVerify} className="space-y-4">
        <input
          type="text"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
          placeholder="Enter 6-digit code"
          className="w-full bg-slate-50 border border-slate-200 focus:border-rose-500 rounded-2xl py-4 text-center text-2xl font-bold tracking-[0.5em] outline-none transition-all placeholder:text-sm placeholder:tracking-normal placeholder:font-normal"
        />
        <button
          type="submit"
          disabled={loading || code.length !== 6}
          className="w-full bg-rose-600 hover:bg-rose-700 disabled:bg-rose-300 text-white font-bold text-sm py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {loading ? 'Verifying...' : 'Verify Email'}
        </button>
      </form>
    </div>
  );
}
