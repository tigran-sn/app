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
// USER PROFILE API TYPES (REAL STRUCTURE)
// ===================================

// Menu Item structure from API
export interface MenuItem {
  key: string
  path: string | null
  name: string
  menuType: number
  isActive: boolean
  order: number
  tab: number
  isAvailable: boolean
  id: number
}

// Profile Picture structure from API
export interface ProfilePicture {
  id: number
  path: string
  name: string
  createdById: number
  fileType: number
}

// Permission Role structure from API
export interface PermissionRole {
  from: number
  to: number
  permissionType: number
  id: number
}

// Tab structure from API (complex permissions)
export interface UserTab {
  action: number
  roles: PermissionRole[]
  id: number
}

// Action structure from API
export interface UserAction {
  action: number
  permissionType: number
  id: number
}

// First Admin structure from API
export interface FirstAdmin {
  fullName: string
  email: string
  createdDate: string
  id: number
}

// Real User Profile API Response (from /api/user/current)
export interface UserProfileResponse {
  id: number
  fullName: string
  email: string
  title: string
  isTCConditionsAccepted: boolean
  menuItems: MenuItem[]
  picture: ProfilePicture
  userCompanyIds: number[]
  tabs: UserTab[]
  actions: UserAction[]
  firstAdmin: FirstAdmin
  culture: string
  roles: number[]
}

// API Response Wrapper (all TradeCloud API responses use this structure)
export interface ApiResponseWrapper<T> {
  data: T
  message: string
  success: boolean
}

// ===================================
// APPLICATION USER TYPES
// ===================================

// Internal User representation (for app state)
export interface User {
  id: string
  username: string
  email: string
  fullName: string
  title?: string
  culture?: string
  roles?: number[]
  menuItems?: MenuItem[]
  picture?: ProfilePicture
  userCompanyIds?: number[]
  isTCConditionsAccepted?: boolean
  // Legacy fields for backward compatibility
  firstName?: string
  lastName?: string
  platform?: string
  locale?: string
  permissions?: string[]
  isActive?: boolean
  lastLoginAt?: string
  // Computed properties
  displayName: string
  initials: string
  hasRole: (role: number) => boolean
  hasPermission: (permission: string) => boolean
  hasMenuAccess: (menuKey: string) => boolean
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

// ===================================
// MENU AND PERMISSION TYPES
// ===================================

// Menu types from API
export enum MenuType {
  MAIN = 1,
  POPUP = 2,
  WORKFLOW = 3
}

// Permission types from API
export enum PermissionType {
  VIEW = 1,
  EDIT = 2,
  DELETE = 3,
  EXECUTE = 4
}

// Helper type for menu access checking
export interface MenuAccess {
  key: string
  hasAccess: boolean
  menuType: MenuType
  isActive: boolean
  path: string | null
} 