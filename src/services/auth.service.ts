import type { 
  TokenRequest, 
  TokenResponse, 
  LoginCredentials, 
  User, 
  UserProfileResponse,
  ApiError,
  AuthApiErrorData,
  JwtPayload
} from './auth.types'

// ===================================
// API CONFIGURATION
// ===================================

const AUTH_CONFIG = {
  TOKEN_ENDPOINT: 'https://tcwauth.tradecloud1.net/connect/token',
  USER_PROFILE_ENDPOINT: 'https://tcwapi.tradecloud1.net/api/user/current',
  CLIENT_ID: 'web_client',
  GRANT_TYPE: 'password',
  CLIENT_SECRET: 'secret',
  SCOPE: 'api openid chat'
} as const

// Storage keys for localStorage
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'tcw_access_token',
  USER_DATA: 'tcw_user_data',
  TOKEN_EXPIRY: 'tcw_token_expiry'
} as const

// ===================================
// TOKEN STORAGE UTILITIES
// ===================================

export const tokenStorage = {
  get: (): string | null => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
    } catch (error) {
      console.error('Failed to get token from storage:', error)
      return null
    }
  },

  set: (token: string): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token)
    } catch (error) {
      console.error('Failed to store token:', error)
    }
  },

  remove: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    } catch (error) {
      console.error('Failed to remove token:', error)
    }
  },

  exists: (): boolean => {
    return !!tokenStorage.get()
  }
}

// ===================================
// USER DATA STORAGE UTILITIES
// ===================================

export const userStorage = {
  get: (): User | null => {
    try {
      const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA)
      if (!userData) return null
      
      const parsed = JSON.parse(userData) as UserProfileResponse
      return transformUserProfile(parsed)
    } catch (error) {
      console.error('Failed to get user data from storage:', error)
      return null
    }
  },

  set: (user: User): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user))
    } catch (error) {
      console.error('Failed to store user data:', error)
    }
  },

  remove: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER_DATA)
    } catch (error) {
      console.error('Failed to remove user data:', error)
    }
  }
}

// ===================================
// TOKEN EXPIRY UTILITIES
// ===================================

export const tokenExpiryStorage = {
  get: (): Date | null => {
    try {
      const expiry = localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY)
      return expiry ? new Date(expiry) : null
    } catch (error) {
      console.error('Failed to get token expiry:', error)
      return null
    }
  },

  set: (expiresIn: number): void => {
    try {
      const expiryDate = new Date(Date.now() + expiresIn * 1000)
      localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, expiryDate.toISOString())
    } catch (error) {
      console.error('Failed to store token expiry:', error)
    }
  },

  remove: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY)
    } catch (error) {
      console.error('Failed to remove token expiry:', error)
    }
  }
}

// ===================================
// JWT TOKEN UTILITIES
// ===================================

export const jwtUtils = {
  decode: (token: string): JwtPayload | null => {
    try {
      const parts = token.split('.')
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format')
      }

      const payload = parts[1]
      if (!payload) {
        throw new Error('Invalid JWT payload')
      }
      
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
      return JSON.parse(decoded) as JwtPayload
    } catch (error) {
      console.error('Failed to decode JWT token:', error)
      return null
    }
  },

  isExpired: (token: string): boolean => {
    try {
      const payload = jwtUtils.decode(token)
      if (!payload || !payload.exp) {
        return true
      }

      const currentTime = Math.floor(Date.now() / 1000)
      return payload.exp < currentTime
    } catch (error) {
      console.error('Failed to check token expiry:', error)
      return true
    }
  },

  getExpiryDate: (token: string): Date | null => {
    try {
      const payload = jwtUtils.decode(token)
      if (!payload || !payload.exp) {
        return null
      }

      return new Date(payload.exp * 1000)
    } catch (error) {
      console.error('Failed to get token expiry date:', error)
      return null
    }
  }
}

// ===================================
// API ERROR HANDLING
// ===================================

class AuthApiError extends Error {
  public status: number
  public code?: string
  public details?: Record<string, any>

  constructor(
    message: string, 
    status: number, 
    code?: string, 
    details?: Record<string, any>
  ) {
    super(message)
    this.name = 'AuthApiError'
    this.status = status
    if (code !== undefined) {
      this.code = code
    }
    if (details !== undefined) {
      this.details = details
    }
  }
}

// ===================================
// HTTP CLIENT UTILITIES
// ===================================

const httpClient = {
  // OAuth2 form data request (for token endpoint)
  postFormData: async (url: string, data: Record<string, string>): Promise<any> => {
    const formData = new URLSearchParams()
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value)
    })

    console.log(`🔐 Making OAuth2 request to: ${url}`)
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      },
      body: formData
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new AuthApiError(
        errorData.error_description || errorData.error || 'Authentication failed',
        response.status,
        errorData.error,
        errorData
      )
    }

    return response.json()
  },

  // JSON API request with Bearer token (for user profile endpoint)
  getWithAuth: async (url: string, token: string): Promise<any> => {
    console.log(`📡 Making authenticated request to: ${url}`)
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Accept-Language': 'en',
        'Cache-Control': 'no-cache',
        'Origin': 'https://tcw.tradecloud1.net'
      }
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new AuthApiError(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData.code,
        errorData
      )
    }

    return response.json()
  }
}

// ===================================
// USER DATA TRANSFORMATION
// ===================================

const transformUserProfile = (profileData: UserProfileResponse): User => {
  const getDisplayName = (): string => {
    if (profileData.fullName) return profileData.fullName
    if (profileData.firstName && profileData.lastName) {
      return `${profileData.firstName} ${profileData.lastName}`
    }
    if (profileData.firstName) return profileData.firstName
    return profileData.username || profileData.email || 'User'
  }

  const getInitials = (): string => {
    const displayName = getDisplayName()
    return displayName
      .split(' ')
      .map(name => name.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('')
  }

  const hasRole = (role: string): boolean => {
    return profileData.roles ? profileData.roles.includes(role) : false
  }

  const hasPermission = (permission: string): boolean => {
    return profileData.permissions ? profileData.permissions.includes(permission) : false
  }

  // Build the user object with only defined optional properties
  const user: User = {
    id: profileData.id,
    username: profileData.username,
    email: profileData.email,
    // Computed properties (always required)
    displayName: getDisplayName(),
    initials: getInitials(),
    hasRole,
    hasPermission
  }

  // Add optional properties only if they have values
  if (profileData.firstName) {
    user.firstName = profileData.firstName
  }
  
  if (profileData.lastName) {
    user.lastName = profileData.lastName
  }
  
  if (profileData.fullName) {
    user.fullName = profileData.fullName
  }
  
  if (profileData.platform) {
    user.platform = profileData.platform
  }
  
  if (profileData.locale) {
    user.locale = profileData.locale
  }
  
  if (profileData.roles && profileData.roles.length > 0) {
    user.roles = profileData.roles
  }
  
  if (profileData.permissions && profileData.permissions.length > 0) {
    user.permissions = profileData.permissions
  }
  
  if (profileData.isActive !== undefined) {
    user.isActive = profileData.isActive
  }
  
  if (profileData.lastLoginAt) {
    user.lastLoginAt = profileData.lastLoginAt
  }

  return user
}

// ===================================
// MAIN AUTHENTICATION SERVICE
// ===================================

export const authService = {
  // Step 1: Login to get access token
  login: async (credentials: LoginCredentials): Promise<TokenResponse> => {
    console.log('🔐 Starting authentication flow...')
    
    const tokenRequest: TokenRequest = {
      username: credentials.username,
      password: credentials.password,
      client_id: AUTH_CONFIG.CLIENT_ID,
      grant_type: AUTH_CONFIG.GRANT_TYPE,
      client_secret: AUTH_CONFIG.CLIENT_SECRET,
      scope: AUTH_CONFIG.SCOPE
    }

    // Create form data payload
    const formDataPayload: Record<string, string> = {
      username: tokenRequest.username,
      password: tokenRequest.password,
      client_id: tokenRequest.client_id,
      grant_type: tokenRequest.grant_type,
      client_secret: tokenRequest.client_secret,
      scope: tokenRequest.scope
    }

    try {
      const tokenResponse = await httpClient.postFormData(
        AUTH_CONFIG.TOKEN_ENDPOINT, 
        formDataPayload
      )

      console.log('✅ Token received successfully')
      return tokenResponse as TokenResponse
    } catch (error) {
      console.error('❌ Token request failed:', error)
      throw error
    }
  },

  // Step 2: Get user profile using the token
  getUserProfile: async (token: string): Promise<UserProfileResponse> => {
    console.log('👤 Fetching user profile...')
    
    try {
      const profileResponse = await httpClient.getWithAuth(
        AUTH_CONFIG.USER_PROFILE_ENDPOINT,
        token
      )

      console.log('✅ User profile received successfully')
      return profileResponse as UserProfileResponse
    } catch (error) {
      console.error('❌ User profile request failed:', error)
      throw error
    }
  },

  // Complete login flow: token + user profile
  completeLogin: async (credentials: LoginCredentials): Promise<User> => {
    console.log('🚀 Starting complete login flow...')
    
    // Step 1: Get access token
    const tokenResponse = await authService.login(credentials)
    
    // Step 2: Get user profile
    const userProfile = await authService.getUserProfile(tokenResponse.access_token)
    
    // Step 3: Store token and calculate expiry
    tokenStorage.set(tokenResponse.access_token)
    tokenExpiryStorage.set(tokenResponse.expires_in)
    
    // Step 4: Transform and store user data
    const user = transformUserProfile(userProfile)
    userStorage.set(user)
    
    console.log('🎉 Complete login flow successful')
    return user
  },

  // Refresh user profile (for when user data might have changed)
  refreshUserProfile: async (): Promise<User> => {
    console.log('🔄 Refreshing user profile...')
    
    const token = tokenStorage.get()
    if (!token) {
      throw new AuthApiError('No access token available', 401)
    }

    const userProfile = await authService.getUserProfile(token)
    const user = transformUserProfile(userProfile)
    userStorage.set(user)
    
    console.log('✅ User profile refreshed successfully')
    return user
  },

  // Logout and clean up all stored data
  logout: (): void => {
    console.log('👋 Logging out user...')
    
    tokenStorage.remove()
    userStorage.remove()
    tokenExpiryStorage.remove()
    
    console.log('✅ Logout completed - all data cleared')
  },

  // Check if user is currently authenticated
  isAuthenticated: (): boolean => {
    const token = tokenStorage.get()
    const user = userStorage.get()
    
    if (!token || !user) {
      return false
    }

    // Check if token is expired
    if (jwtUtils.isExpired(token)) {
      console.log('🕐 Token expired - user no longer authenticated')
      authService.logout() // Clean up expired session
      return false
    }

    return true
  },

  // Get currently logged-in user
  getCurrentUser: (): User | null => {
    if (!authService.isAuthenticated()) {
      return null
    }
    
    return userStorage.get()
  },

  // Get current access token
  getCurrentToken: (): string | null => {
    if (!authService.isAuthenticated()) {
      return null
    }
    
    return tokenStorage.get()
  }
}

// ===================================
// ERROR MESSAGE UTILITIES
// ===================================

export const getAuthErrorMessage = (error: any): string => {
  if (error instanceof AuthApiError) {
    switch (error.status) {
      case 400:
        return 'Invalid username or password. Please check your credentials.'
      case 401:
        return 'Authentication failed. Please check your username and password.'
      case 403:
        return 'Access denied. You do not have permission to access this application.'
      case 404:
        return 'Authentication service not found. Please try again later.'
      case 429:
        return 'Too many login attempts. Please wait a few minutes before trying again.'
      case 500:
        return 'Server error occurred. Please try again later.'
      case 502:
      case 503:
      case 504:
        return 'Service temporarily unavailable. Please try again later.'
      default:
        return error.message || 'An unexpected error occurred during authentication.'
    }
  }

  if (error?.message?.includes('NetworkError') || error?.message?.includes('fetch')) {
    return 'Network connection error. Please check your internet connection and try again.'
  }

  return 'An unexpected error occurred. Please try again.'
} 