import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/** Guards staff routes; redirects to the login page when unauthenticated. */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-lightbg">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-accent" />
      </div>
    );
  }
  if (!user || !user.is_staff) {
    return <Navigate to="/manage/login" state={{ from: location.pathname }} replace />;
  }
  return children;
}
