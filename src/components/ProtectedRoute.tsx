import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type UserRole = Database['public']['Enums']['user_role'];

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  fallbackTo?: string;
}

export function ProtectedRoute({ 
  children, 
  allowedRoles, 
  fallbackTo = '/auth' 
}: ProtectedRouteProps) {
  const { user, loading, hasRole } = useAuth();

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Redirect to auth if not authenticated
  if (!user) {
    return <Navigate to={fallbackTo} replace />;
  }

  // Check role-based access if roles are specified
  if (allowedRoles && allowedRoles.length > 0) {
    const hasAccess = hasRole(allowedRoles);
    if (!hasAccess) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
            <p className="text-muted-foreground">
              You don't have permission to access this page.
            </p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}