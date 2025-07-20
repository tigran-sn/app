import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTES } from '@/routes'

// ===================================
// PROTECTED ROUTE COMPONENT
// ===================================

interface ProtectedRouteProps {
  children: React.ReactNode
}

/**
 * ProtectedRoute - Route guard for authenticated users only
 * 
 * Behavior:
 * - If user is authenticated: render children (allow access)
 * - If user is not authenticated: redirect to login page
 * - If authentication is loading: show loading state
 * - Preserves the attempted URL for redirect after login
 */
function ProtectedRoute({ children }: ProtectedRouteProps): React.JSX.Element {
  const { isAuthenticated, isLoading, user } = useAuth()
  const location = useLocation()

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        console.log(`🛡️ Protected route access granted for user: ${user.username}`)
      } else {
        console.log(`🚫 Protected route access denied - redirecting to login`)
        console.log(`📍 Attempted URL: ${location.pathname}`)
      }
    }
  }, [isAuthenticated, isLoading, user, location.pathname])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        gap: '1rem'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f4f6',
          borderTop: '4px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>
          Checking authentication...
        </p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate 
        to={ROUTES.LOGIN} 
        state={{ from: location.pathname }}
        replace 
      />
    )
  }

  // User is authenticated - render the protected content
  return <>{children}</>
}

export default ProtectedRoute 