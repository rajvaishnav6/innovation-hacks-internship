'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      router.push('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-slate-900">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center justify-center gap-1.5 font-mono text-slate-100">
          <span className="text-cyan-400">&gt;</span>
          <span className="text-lg font-semibold">devboard</span>
          <span className="cursor-blink text-cyan-400">_</span>
        </div>

        <div className="p-6 border rounded-xl border-slate-800 bg-slate-800/50">
          <h1 className="mb-1 text-lg font-semibold text-slate-100">Welcome back</h1>
          <p className="mb-6 text-sm text-slate-400">Log in to your dashboard</p>

          {error && (
            <div className="px-3 py-2 mb-4 text-sm border rounded-lg border-rose-900 bg-rose-950/50 text-rose-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-slate-300">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 text-sm border rounded-lg border-slate-700 bg-slate-900 text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-slate-300">Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-3 py-2 text-sm border rounded-lg border-slate-700 bg-slate-900 text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 text-sm font-medium text-white rounded-lg bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>

          <p className="mt-6 text-sm text-center text-slate-400">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-medium text-cyan-400 hover:text-cyan-300">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}