'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, isAdmin } from '../lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if the user is authenticated
    const authenticated = isAuthenticated();

    if (!authenticated) {
      // Redirect to login if not authenticated
      router.push('/login');
      return;
    }

    // Check if the route requires admin privileges
    if (adminOnly && !isAdmin()) {
      // Redirect to home if not an admin
      router.push('/');
      return;
    }

    setLoading(false);
  }, [router, adminOnly]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return <>{children}</>;
}
