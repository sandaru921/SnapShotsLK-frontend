'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('user' | 'admin' | 'superadmin' | 'Client')[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/user/login');
        return;
      }
      if (allowedRoles && user && !allowedRoles.includes(user.role as any)) {
        router.push('/');
      }
    }
  }, [loading, isAuthenticated, user, allowedRoles, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          {/* Spinner */}
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-full border-4 border-amber-100" />
            <div className="absolute inset-0 rounded-full border-4 border-amber-700 border-t-transparent animate-spin" />
          </div>
          <p className="text-sm text-gray-500 tracking-wide">Loading your workspace…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || (allowedRoles && user && !allowedRoles.includes(user.role as any))) {
    return null;
  }

  return <>{children}</>;
}