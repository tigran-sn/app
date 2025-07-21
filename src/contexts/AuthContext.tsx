import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { AuthState, AuthContextType, LoginCredentials, User } from '@/services/auth.types'
import { authService, getAuthErrorMessage } from '@/services/auth.service'
import { ROUTES } from '@/routes'

// ===================================
// AUTHENTICATION CONTEXT
// ===================================

const AuthContext = createContext<AuthContextType | null>(null)

// ===================================
// AUTH REDUCER ACTIONS
// ===================================

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'REFRESH_PROFILE_START' }
  | { type: 'REFRESH_PROFILE_SUCCESS'; payload: User }
  | { type: 'REFRESH_PROFILE_FAILURE'; payload: string }
  | { type: 'RESTORE_SESSION'; payload: { user: User; token: string } }

// ===================================
// AUTH REDUCER
// ===================================

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null
      }

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null
      }

    case 'LOGIN_FAILURE':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload
      }

    case 'LOGOUT':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: null
      }

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      }

    case 'REFRESH_PROFILE_START':
      return {
        ...state,
        isLoading: true,
        error: null
      }

    case 'REFRESH_PROFILE_SUCCESS':
      return {
        ...state,
        isLoading: false,
        user: action.payload,
        error: null
      }

    case 'REFRESH_PROFILE_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }

    case 'RESTORE_SESSION':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null
      }

    default:
      return state
  }
}

// ===================================
// INITIAL STATE
// ===================================

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  isLoading: true, // Start with loading true to check for existing session
  error: null
}

// ===================================
// AUTH PROVIDER PROPS
// ===================================

interface AuthProviderProps {
  children: React.ReactNode
}

// ===================================
// AUTH PROVIDER COMPONENT
// ===================================

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)
  const navigate = useNavigate()

  // ===================================
  // LOGIN FUNCTION - TWO-STEP FLOW
  // ===================================

  const login = async (credentials: LoginCredentials): Promise<void> => {
    dispatch({ type: 'LOGIN_START' })

    try {
      console.log('🚀 Starting complete authentication flow...')
      
      // Use the new two-step login flow: token + user profile
      const user = await authService.completeLogin(credentials)
      const token = authService.getCurrentToken()

      if (!token) {
        throw new Error('Failed to retrieve access token after login')
      }

      console.log('✅ Authentication successful for user:', user.displayName)
      
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { user, token } 
      })
      
    } catch (error) {
      console.error('❌ Authentication failed:', error)
      
      const errorMessage = getAuthErrorMessage(error)
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: errorMessage 
      })
      
      // Re-throw so calling component can handle it
      throw error
    }
  }

  // ===================================
  // LOGOUT FUNCTION
  // ===================================

  const logout = (): void => {
    console.log('👋 Initiating logout...')
    
    // Clear all stored authentication data
    authService.logout()
    
    // Update state
    dispatch({ type: 'LOGOUT' })
    
    console.log('✅ Logout completed, redirecting to home...')
    
    // Redirect to home page
    navigate(ROUTES.HOME)
  }

  // ===================================
  // REFRESH USER PROFILE FUNCTION
  // ===================================

  const refreshUserProfile = async (): Promise<void> => {
    dispatch({ type: 'REFRESH_PROFILE_START' })

    try {
      console.log('🔄 Refreshing user profile...')
      
      const updatedUser = await authService.refreshUserProfile()
      
      console.log('✅ User profile refreshed successfully')
      
      dispatch({ 
        type: 'REFRESH_PROFILE_SUCCESS', 
        payload: updatedUser 
      })
      
    } catch (error) {
      console.error('❌ Failed to refresh user profile:', error)
      
      const errorMessage = getAuthErrorMessage(error)
      dispatch({ 
        type: 'REFRESH_PROFILE_FAILURE', 
        payload: errorMessage 
      })
      
      // If refresh fails due to auth issues, logout user
      if (error && typeof error === 'object' && 'status' in error && error.status === 401) {
        console.log('🔐 Authentication expired during profile refresh, logging out...')
        handleExpiredSession()
      }
      
      throw error
    }
  }

  // ===================================
  // REFRESH TOKEN FUNCTION (PLACEHOLDER)
  // ===================================

  const refreshToken = async (): Promise<void> => {
    console.log('🔄 Token refresh requested...')
    
    // For now, since the API doesn't provide refresh tokens,
    // we'll use the profile refresh as a way to validate the current session
    try {
      await refreshUserProfile()
      console.log('✅ Session validated via profile refresh')
    } catch (error) {
      console.log('❌ Session validation failed, user needs to re-login')
      throw error
    }
  }

  // ===================================
  // CLEAR ERROR FUNCTION
  // ===================================

  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  // ===================================
  // SESSION EXPIRATION HANDLER
  // ===================================

  const handleExpiredSession = (): void => {
    console.log('🕐 Session expired, cleaning up and redirecting...')
    
    // Clear all stored data
    authService.logout()
    
    // Update state
    dispatch({ type: 'LOGOUT' })
    
    // Redirect to home page
    navigate(ROUTES.HOME)
  }

  // ===================================
  // SESSION RESTORATION EFFECT
  // ===================================

  useEffect(() => {
    const restoreSession = (): void => {
      console.log('🔍 Checking for existing session...')
      
      try {
        // Check if user is already authenticated
        if (authService.isAuthenticated()) {
          const user = authService.getCurrentUser()
          const token = authService.getCurrentToken()
          
          if (user && token) {
            console.log('✅ Existing session found for user:', user.displayName)
            
            dispatch({ 
              type: 'RESTORE_SESSION', 
              payload: { user, token } 
            })
            return
          }
        }
        
        console.log('ℹ️ No existing session found')
        
        // No valid session found
        dispatch({ type: 'LOGOUT' })
        
      } catch (error) {
        console.error('❌ Error during session restoration:', error)
        
        // Clear any corrupted data
        authService.logout()
        dispatch({ type: 'LOGOUT' })
      }
    }

    // Restore session on mount
    restoreSession()
  }, [])

  // ===================================
  // TOKEN EXPIRY MONITORING (OPTIONAL)
  // ===================================

  useEffect(() => {
    if (!state.isAuthenticated || !state.token) {
      return
    }

    // Set up periodic session validation (every 5 minutes)
    const intervalId = setInterval(() => {
      console.log('🔍 Performing periodic session validation...')
      
      if (!authService.isAuthenticated()) {
        console.log('🕐 Session no longer valid during periodic check')
        handleExpiredSession()
      }
    }, 5 * 60 * 1000) // 5 minutes

    // Cleanup interval on unmount or when auth state changes
    return () => {
      clearInterval(intervalId)
    }
  }, [state.isAuthenticated, state.token])

  // ===================================
  // CONTEXT VALUE
  // ===================================

  const contextValue: AuthContextType = {
    // State
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    token: state.token,
    isLoading: state.isLoading,
    error: state.error,
    
    // Actions
    login,
    logout,
    refreshToken,
    refreshUserProfile,
    clearError
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

// ===================================
// CUSTOM HOOK
// ===================================

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}

// ===================================
// HIGHER-ORDER COMPONENT FOR PROTECTED ROUTES
// ===================================

export const withAuth = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P & { fallback?: React.ReactNode }> => {
  return ({ fallback, ...props }) => {
    const { isAuthenticated, isLoading } = useAuth()
    
    if (isLoading) {
      return (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '200px'
        }}>
          Loading...
        </div>
      )
    }
    
    if (!isAuthenticated) {
      return fallback || <div>Please log in to access this content</div>
    }
    
    return <Component {...(props as P)} />
  }
} 