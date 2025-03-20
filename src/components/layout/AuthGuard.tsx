
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const publicRoutes = [
  '/',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
];

const AuthGuard: React.FC<AuthGuardProps> = ({ children, requireAuth = true }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return; // Don't do anything while still loading

    const isPublicRoute = publicRoutes.includes(location.pathname);
    const isRootRoute = location.pathname === '/';

    // Handle authentication logic based on route type and auth status
    if (requireAuth && !user && !isPublicRoute) {
      // Redirect to login if accessing protected route without being logged in
      navigate('/auth/login');
    } else if (user && isPublicRoute && !isRootRoute) {
      // Already logged in user accessing public routes (except landing page)
      navigate('/');
    } else if (!user && isRootRoute) {
      // Non-authenticated user accessing root route should see landing page
      // which is the default behavior, no redirect needed
    }
  }, [user, loading, location.pathname, navigate, requireAuth]);

  // Show nothing while loading or redirecting
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pharma-600"></div>
      </div>
    );
  }

  // Determine what to render based on authentication requirements
  const shouldRender = 
    (requireAuth && user) || // Protected routes with authenticated user
    (!requireAuth) || // Routes that don't require auth
    (!requireAuth && publicRoutes.includes(location.pathname)); // Public routes

  return shouldRender ? <>{children}</> : null;
};

export default AuthGuard;
