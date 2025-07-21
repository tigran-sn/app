// ===================================
// AUTHENTICATION API TYPES
// ===================================

// OAuth2 Token Request (for login API)
export interface TokenRequest {
  username: string
  password: string
  client_id: string
  grant_type: string
  client_secret: string
  scope: string
}

// OAuth2 Token Response (from login API)
export interface TokenResponse {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token?: string
  scope?: string
}

// ===================================
// USER PROFILE API TYPES
// ===================================

// User Profile API Response (from /api/user/current)
export interface UserProfileResponse {
  id: string
  username: string
  email: string
  firstName?: string
  lastName?: string
  fullName?: string
  platform?: string
  locale?: string
  roles?: string[]
  permissions?: string[]
  isActive?: boolean
  lastLoginAt?: string
  createdAt?: string
  updatedAt?: string
  // Additional fields that might be present
  avatar?: string
  phoneNumber?: string
  companyId?: string
  companyName?: string
  department?: string
  jobTitle?: string
  timezone?: string
  preferences?: Record<string, any>
}

// ===================================
// APPLICATION USER TYPES
// ===================================

// Internal User representation (for app state)
export interface User {
  id: string
  username: string
  email: string
  firstName?: string
  lastName?: string
  fullName?: string
  platform?: string
  locale?: string
  roles?: string[]
  permissions?: string[]
  isActive?: boolean
  lastLoginAt?: string
  // Computed properties
  displayName: string
  initials: string
  hasRole: (role: string) => boolean
  hasPermission: (permission: string) => boolean
}

// ===================================
// AUTHENTICATION FLOW TYPES
// ===================================

// Login credentials (input from user)
export interface LoginCredentials {
  username: string
  password: string
}

// Authentication state for React Context
export interface AuthState {
  isAuthenticated: boolean
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
}

// Authentication context interface
export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<void>
  refreshUserProfile: () => Promise<void>
  clearError: () => void
}

// ===================================
// API ERROR TYPES
// ===================================

// API Error Response structure
export interface ApiError {
  message: string
  status: number
  code?: string
  details?: Record<string, any>
  timestamp?: string
  path?: string
}

// API Error for authentication operations
export interface AuthApiErrorData {
  error: string
  error_description?: string
  error_uri?: string
  status: number
}

// ===================================
// UTILITY TYPES
// ===================================

// Props for components that require authentication
export interface WithAuthProps {
  fallback?: React.ReactNode
}

// HTTP method types for API calls
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

// API Response wrapper
export interface ApiResponse<T> {
  data: T
  status: number
  statusText: string
  headers?: Record<string, string>
}

// Token storage interface
export interface TokenStorage {
  get: () => string | null
  set: (token: string) => void
  remove: () => void
  exists: () => boolean
}

// JWT Token payload structure (for parsing tokens)
export interface JwtPayload {
  sub: string // User ID
  iss?: string // Issuer
  aud?: string | string[] // Audience
  exp?: number // Expiration time
  iat?: number // Issued at
  nbf?: number // Not before
  jti?: string // JWT ID
  client_id?: string
  scope?: string | string[]
  // Custom claims
  id?: string
  Platform?: string
  locale?: string
  mgk?: string
  auth_time?: number
  idp?: string
  amr?: string[]
} 