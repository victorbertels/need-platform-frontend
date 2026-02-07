'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/auth';

export default function PostNeedFAB() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated()) {
    return null;
  }

  return (
    <Link
      href="/post-need"
      className="fixed bottom-24 right-6 z-40 w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center shadow-2xl hover:shadow-3xl hover:from-purple-500 hover:to-pink-500 transition-all transform hover:scale-110 md:bottom-6"
      title="Post a Need"
    >
      <span className="text-3xl">➕</span>
    </Link>
  );
}
