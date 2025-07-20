// ===================================
// AUTHENTICATION API TYPES
// ===================================

// OAuth2 Token Request (what we send)
export interface TokenRequest {
  username: string
  password: string
  client_id: string
  grant_type: string
  client_secret: string
  scope: string
}

// OAuth2 Token Response (what we receive)
export interface TokenResponse {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token?: string
  scope?: string
  id_token?: string
}

// User information (extracted from token or separate endpoint)
export interface User {
  id: string
  email: string
  username: string
  firstName?: string
  lastName?: string
  role?: string
  permissions?: string[]
}

// Authentication state
export interface AuthState {
  isAuthenticated: boolean
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
}

// Login credentials from form
export interface LoginCredentials {
  username: string
  password: string
}

// API Error response
export interface ApiError {
  error: string
  error_description?: string
  status?: number
  message?: string
}

// Auth context methods
export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<void>
  clearError: () => void
} 