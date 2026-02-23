'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push(user.role === 'candidate' ? '/candidate' : '/recruiter');
      } else {
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen pixel-bg flex flex-col items-center justify-center relative overflow-hidden">
      {/* Scanline effect */}
      <div className="scanline" />

      {/* Crosshair decorations */}
      <div className="crosshair" style={{ top: '20%', left: '15%' }} />
      <div className="crosshair" style={{ top: '70%', right: '20%' }} />

      {/* Loading content */}
      <div className="brutal-card p-10 text-center">
        <h1 className="font-display text-6xl tracking-tight mb-4">RESUMER</h1>
        <div className="flex items-center justify-center gap-2">
          <div className="w-3 h-3 bg-black animate-spin-slow" />
          <span className="text-sm font-bold uppercase tracking-widest">
            Loading<span className="animate-blink">_</span>
          </span>
        </div>
      </div>
    </div>
  );
}
