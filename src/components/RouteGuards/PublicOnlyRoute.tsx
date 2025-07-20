import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTES } from '@/routes'

// ===================================
// PUBLIC-ONLY ROUTE COMPONENT
// ===================================

interface PublicOnlyRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

/**
 * PublicOnlyRoute - Route guard for non-authenticated users only
 * 
 * Behavior:
 * - If user is NOT authenticated: render children (allow access)
 * - If user is authenticated: redirect to dashboard (or specified route)
 * - If authentication is loading: show loading state
 * - Prevents logged-in users from accessing login/signup pages
 */
function PublicOnlyRoute({ 
  children, 
  redirectTo = ROUTES.DASHBOARD 
}: PublicOnlyRouteProps): React.JSX.Element {
  const { isAuthenticated, isLoading, user } = useAuth()
  const location = useLocation()

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        console.log(`🔒 Public-only route access denied for authenticated user: ${user.username}`)
        console.log(`↩️ Redirecting to: ${redirectTo}`)
      } else {
        console.log(`✅ Public-only route access granted - user not authenticated`)
        console.log(`📍 Current URL: ${location.pathname}`)
      }
    }
  }, [isAuthenticated, isLoading, user, location.pathname, redirectTo])

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

  // Redirect authenticated users away from public-only pages
  if (isAuthenticated) {
    return (
      <Navigate 
        to={redirectTo} 
        replace 
      />
    )
  }

  // User is not authenticated - render the public content
  return <>{children}</>
}

export default PublicOnlyRoute 