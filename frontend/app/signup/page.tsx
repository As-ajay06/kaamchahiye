'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'candidate' | 'recruiter'>('candidate');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup, user } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  if (user) {
    router.push(user.role === 'candidate' ? '/candidate' : '/recruiter');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signup(name, email, password, role);
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pixel-bg flex items-center justify-center relative overflow-hidden p-4">
      {/* Scanline effect */}
      <div className="scanline" />

      {/* Crosshair decorations */}
      <div className="crosshair" style={{ top: '8%', right: '12%' }} />
      <div className="crosshair" style={{ bottom: '12%', left: '8%' }} />
      <div className="crosshair" style={{ top: '50%', left: '5%' }} />

      <div className="w-full max-w-md relative z-20">
        {/* Header badge */}
        <div className="inline-block brutal-btn-primary px-4 py-2 text-xs mb-6 pointer-events-none">
          ← REGISTRATION
        </div>

        {/* Card */}
        <div className="brutal-card p-10">
          {/* Decorative corner squares */}
          <div className="absolute top-0 right-0 w-6 h-6 bg-black" />
          <div className="absolute bottom-0 left-0 w-6 h-6 bg-black" />

          <h1 className="font-display text-5xl tracking-tight mb-2">SIGN UP</h1>
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-8">
            Create your account<span className="animate-blink">_</span>
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="name" className="block mb-2 text-xs font-bold uppercase tracking-widest">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your full name"
                className="brutal-input"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="email" className="block mb-2 text-xs font-bold uppercase tracking-widest">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="brutal-input"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block mb-2 text-xs font-bold uppercase tracking-widest">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Min. 6 characters"
                minLength={6}
                className="brutal-input"
              />
            </div>

            <div className="mb-7">
              <label htmlFor="role" className="block mb-2 text-xs font-bold uppercase tracking-widest">
                Role
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setRole('candidate')}
                  className={`flex-1 py-3 px-4 text-xs font-bold uppercase tracking-widest border-2 border-black transition-all duration-100 ${role === 'candidate'
                    ? 'bg-black text-white shadow-none translate-x-0 translate-y-0'
                    : 'bg-white text-black shadow-hard-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    }`}
                >
                  ◆ Candidate
                </button>
                <button
                  type="button"
                  onClick={() => setRole('recruiter')}
                  className={`flex-1 py-3 px-4 text-xs font-bold uppercase tracking-widest border-2 border-black transition-all duration-100 ${role === 'recruiter'
                    ? 'bg-black text-white shadow-none translate-x-0 translate-y-0'
                    : 'bg-white text-black shadow-hard-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    }`}
                >
                  ◆ Recruiter
                </button>
              </div>
            </div>

            {error && (
              <div className="brutal-alert brutal-alert-error mb-5">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-6 brutal-btn-primary text-sm"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3 h-3 border-2 border-white border-t-transparent animate-spin inline-block" />
                  Creating account...
                </span>
              ) : (
                '→ Create Account'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t-2 border-black text-center">
            <span className="text-xs uppercase tracking-widest text-gray-500">
              Have an account?{' '}
              <Link
                href="/login"
                className="text-black font-bold underline underline-offset-4 hover:no-underline"
              >
                Login →
              </Link>
            </span>
          </div>
        </div>

        {/* Footer decoration */}
        <div className="mt-4 flex items-center gap-2 text-xs uppercase tracking-widest text-gray-400">
          <div className="w-2 h-2 bg-black" />
          <span>Resumer Systems v1.0</span>
        </div>
      </div>
    </div>
  );
}
