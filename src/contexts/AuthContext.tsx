import React, { createContext, useContext, useReducer, useEffect } from 'react'
import type { AuthState, AuthContextType, LoginCredentials, User } from '@/services/auth.types'
import { authService, getAuthErrorMessage } from '@/services/auth.service'

// ===================================
// AUTH REDUCER ACTIONS
// ===================================

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'RESTORE_SESSION'; payload: { user: User; token: string } }

// ===================================
// AUTH REDUCER
// ===================================

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  isLoading: false,
  error: null
}

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
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
        error: null
      }

    case 'LOGIN_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        isLoading: false,
        error: action.payload
      }

    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        isLoading: false,
        error: null
      }

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      }

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      }

    case 'RESTORE_SESSION':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
        error: null
      }

    default:
      return state
  }
}

// ===================================
// AUTH CONTEXT
// ===================================

const AuthContext = createContext<AuthContextType | null>(null)

// ===================================
// AUTH PROVIDER COMPONENT
// ===================================

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // ===================================
  // AUTH METHODS
  // ===================================

  const login = async (credentials: LoginCredentials): Promise<void> => {
    dispatch({ type: 'LOGIN_START' })

    try {
      console.log('🔐 Starting login process for:', credentials.username)

      // Call authentication service
      const tokenResponse = await authService.login(credentials)
      
      // Process the successful login
      const user = authService.processLoginSuccess(tokenResponse)

      // Update context state
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user,
          token: tokenResponse.access_token
        }
      })

      console.log('✅ Login successful, user authenticated:', user.username)

    } catch (error) {
      console.error('❌ Login failed:', error)
      
      const errorMessage = getAuthErrorMessage(error)
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: errorMessage
      })

      // Re-throw to allow component-level handling if needed
      throw error
    }
  }

  const logout = (): void => {
    console.log('🚪 Logging out user')
    
    // Clear stored data
    authService.logout()
    
    // Update context state
    dispatch({ type: 'LOGOUT' })
  }

  const refreshToken = async (): Promise<void> => {
    // TODO: Implement token refresh if your API supports it
    console.log('🔄 Token refresh not implemented yet')
  }

  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  // ===================================
  // SESSION RESTORATION
  // ===================================

  useEffect(() => {
    const restoreSession = (): void => {
      console.log('🔄 Checking for existing session...')

      try {
        // Check if user is authenticated from stored data
        if (authService.isAuthenticated()) {
          const user = authService.getCurrentUser()
          const token = authService.getCurrentToken()

          if (user && token) {
            console.log('✅ Existing session found, restoring user:', user.username)
            dispatch({
              type: 'RESTORE_SESSION',
              payload: { user, token }
            })
          } else {
            console.log('⚠️ Invalid stored session data, clearing...')
            authService.logout()
          }
        } else {
          console.log('ℹ️ No existing session found')
        }
      } catch (error) {
        console.error('❌ Error restoring session:', error)
        authService.logout()
      }
    }

    restoreSession()
  }, [])

  // ===================================
  // CONTEXT VALUE
  // ===================================

  const contextValue: AuthContextType = {
    ...state,
    login,
    logout,
    refreshToken,
    clearError
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

// ===================================
// CUSTOM HOOK FOR USING AUTH CONTEXT
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

interface WithAuthProps {
  children: React.ReactNode
}

export const withAuth = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P & WithAuthProps> => {
  return (props: P & WithAuthProps) => {
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
      return (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '200px',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <h2>Authentication Required</h2>
          <p>Please log in to access this page.</p>
        </div>
      )
    }

    return <Component {...props} />
  }
} 