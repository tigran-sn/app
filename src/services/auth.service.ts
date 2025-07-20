import type { TokenRequest, TokenResponse, LoginCredentials, User, ApiError } from './auth.types'

// ===================================
// API CONFIGURATION
// ===================================

const AUTH_CONFIG = {
  TOKEN_ENDPOINT: 'https://tcwauth.tradecloud1.net/connect/token',
  CLIENT_ID: 'web_client',
  GRANT_TYPE: 'password',
  CLIENT_SECRET: 'secret',
  SCOPE: 'api openid chat'
} as const

// ===================================
// TOKEN STORAGE UTILITIES
// ===================================

const TOKEN_STORAGE_KEY = 'auth_token'
const REFRESH_TOKEN_STORAGE_KEY = 'refresh_token'
const USER_STORAGE_KEY = 'user_data'

export const tokenStorage = {
  // Store authentication token
  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_STORAGE_KEY, token)
  },

  // Get stored token
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_STORAGE_KEY)
  },

  // Store refresh token
  setRefreshToken: (refreshToken: string): void => {
    localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken)
  },

  // Get stored refresh token
  getRefreshToken: (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY)
  },

  // Store user data
  setUser: (user: User): void => {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
  },

  // Get stored user data
  getUser: (): User | null => {
    const userData = localStorage.getItem(USER_STORAGE_KEY)
    if (!userData) return null
    
    try {
      return JSON.parse(userData) as User
    } catch (error) {
      console.error('Error parsing stored user data:', error)
      return null
    }
  },

  // Clear all stored authentication data
  clearAll: (): void => {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY)
    localStorage.removeItem(USER_STORAGE_KEY)
  }
}

// ===================================
// JWT TOKEN UTILITIES
// ===================================

export const jwtUtils = {
  // Parse JWT token payload (basic parsing without verification)
  parseToken: (token: string): any => {
    try {
      const parts = token.split('.')
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format')
      }
      
      const base64Url = parts[1]
      if (!base64Url) {
        throw new Error('Invalid JWT payload')
      }
      
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      return JSON.parse(jsonPayload)
    } catch (error) {
      console.error('Error parsing JWT token:', error)
      return null
    }
  },

  // Check if token is expired
  isTokenExpired: (token: string): boolean => {
    try {
      const payload = jwtUtils.parseToken(token)
      if (!payload || !payload.exp) return true
      
      const currentTime = Math.floor(Date.now() / 1000)
      return payload.exp < currentTime
    } catch (error) {
      return true
    }
  },

  // Extract user data from JWT token
  extractUserFromToken: (token: string): User | null => {
    try {
      const payload = jwtUtils.parseToken(token)
      if (!payload) return null

      // Map JWT claims to User interface
      // Note: Adjust these mappings based on actual token structure
      return {
        id: payload.sub || payload.user_id || payload.id || 'unknown',
        email: payload.email || payload.preferred_username || '',
        username: payload.preferred_username || payload.username || payload.email || '',
        firstName: payload.given_name || payload.first_name || '',
        lastName: payload.family_name || payload.last_name || '',
        role: payload.role || payload.roles?.[0] || 'user',
        permissions: payload.permissions || payload.scope?.split(' ') || []
      }
    } catch (error) {
      console.error('Error extracting user from token:', error)
      return null
    }
  }
}

// ===================================
// HTTP CLIENT WITH ERROR HANDLING
// ===================================

class AuthApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public details?: any
  ) {
    super(message)
    this.name = 'AuthApiError'
  }
}

const httpClient = {
  // Make OAuth2 token request
  postFormData: async (url: string, data: Record<string, string>): Promise<any> => {
    try {
      // Create URLSearchParams for form-encoded data
      const formData = new URLSearchParams()
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value)
      })

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
        },
        body: formData.toString()
      })

      // Parse response
      const responseData = await response.json()

      // Handle HTTP errors
      if (!response.ok) {
        const errorMessage = responseData.error_description || 
                           responseData.message || 
                           responseData.error || 
                           `HTTP ${response.status}: ${response.statusText}`
        
        throw new AuthApiError(
          errorMessage,
          response.status,
          responseData.error,
          responseData
        )
      }

      return responseData
    } catch (error) {
      // Handle network errors
      if (error instanceof AuthApiError) {
        throw error
      }

      // Handle fetch/network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new AuthApiError(
          'Network error: Please check your internet connection',
          0,
          'NETWORK_ERROR',
          error
        )
      }

      // Handle other errors
      throw new AuthApiError(
        error instanceof Error ? error.message : 'An unexpected error occurred',
        0,
        'UNKNOWN_ERROR',
        error
      )
    }
  }
}

// ===================================
// AUTHENTICATION API SERVICE
// ===================================

export const authService = {
  // Login with username and password
  login: async (credentials: LoginCredentials): Promise<TokenResponse> => {
    console.log('🔐 Attempting login for user:', credentials.username)

    // Prepare OAuth2 token request
    const tokenRequest: TokenRequest = {
      username: credentials.username,
      password: credentials.password,
      client_id: AUTH_CONFIG.CLIENT_ID,
      grant_type: AUTH_CONFIG.GRANT_TYPE,
      client_secret: AUTH_CONFIG.CLIENT_SECRET,
      scope: AUTH_CONFIG.SCOPE
    }

    try {
      // Make API request (convert to Record<string, string> for form data)
      const formDataPayload: Record<string, string> = {
        username: tokenRequest.username,
        password: tokenRequest.password,
        client_id: tokenRequest.client_id,
        grant_type: tokenRequest.grant_type,
        client_secret: tokenRequest.client_secret,
        scope: tokenRequest.scope
      }
      const response = await httpClient.postFormData(AUTH_CONFIG.TOKEN_ENDPOINT, formDataPayload)
      
      console.log('✅ Login successful, received token response')
      
      // Validate response structure
      if (!response.access_token) {
        throw new AuthApiError('Invalid response: missing access_token', 0, 'INVALID_RESPONSE')
      }

      return response as TokenResponse
    } catch (error) {
      console.error('❌ Login failed:', error)
      
      // Re-throw with user-friendly messages
      if (error instanceof AuthApiError) {
        throw error
      }
      
      throw new AuthApiError('Login failed due to an unexpected error')
    }
  },

  // Process successful login (store tokens, extract user)
  processLoginSuccess: (tokenResponse: TokenResponse): User => {
    console.log('📦 Processing login success, storing tokens')

    // Store tokens
    tokenStorage.setToken(tokenResponse.access_token)
    if (tokenResponse.refresh_token) {
      tokenStorage.setRefreshToken(tokenResponse.refresh_token)
    }

    // Extract user from token
    const user = jwtUtils.extractUserFromToken(tokenResponse.access_token)
    if (!user) {
      throw new AuthApiError('Failed to extract user information from token')
    }

    // Store user data
    tokenStorage.setUser(user)

    console.log('👤 User extracted from token:', { 
      id: user.id, 
      username: user.username, 
      email: user.email 
    })

    return user
  },

  // Logout (clear stored data)
  logout: (): void => {
    console.log('🚪 Logging out user')
    tokenStorage.clearAll()
  },

  // Check if user is currently authenticated
  isAuthenticated: (): boolean => {
    const token = tokenStorage.getToken()
    if (!token) return false

    // Check if token is expired
    if (jwtUtils.isTokenExpired(token)) {
      console.log('⏰ Token expired, clearing stored data')
      tokenStorage.clearAll()
      return false
    }

    return true
  },

  // Get current user from storage
  getCurrentUser: (): User | null => {
    if (!authService.isAuthenticated()) return null
    return tokenStorage.getUser()
  },

  // Get current token
  getCurrentToken: (): string | null => {
    if (!authService.isAuthenticated()) return null
    return tokenStorage.getToken()
  }
}

// ===================================
// ERROR HANDLING UTILITIES
// ===================================

export const getAuthErrorMessage = (error: any): string => {
  if (error instanceof AuthApiError) {
    return error.message
  }

  if (error?.response?.data?.error_description) {
    return error.response.data.error_description
  }

  if (error?.response?.data?.message) {
    return error.response.data.message
  }

  if (error?.message) {
    return error.message
  }

  return 'An unexpected error occurred during authentication'
} 