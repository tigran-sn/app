import { createBrowserRouter, type RouteObject } from 'react-router-dom'
import App from '@/components/App'
import { Home, Login, NotFound } from '@/pages'

// ===================================
// TYPESCRIPT INTERFACES & TYPES
// ===================================

// Interface for route metadata (for future enhancements)
interface RouteMetadata {
  title?: string
  requiresAuth?: boolean
  description?: string
}

// Extended route object with metadata
type AppRoute = RouteObject & {
  metadata?: RouteMetadata
  children?: AppRoute[]
}

// ===================================
// ROUTE DEFINITIONS
// ===================================

// Main application routes
const routes: AppRoute[] = [
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        index: true, // This makes it the default route for "/"
        element: <Home />,
        metadata: {
          title: 'Home - React Learning',
          description: 'Welcome to your React learning journey'
        }
      },
      {
        path: 'login',
        element: <Login />,
        metadata: {
          title: 'Login - React Learning',
          description: 'Sign in to your account',
          requiresAuth: false
        }
      }
    ]
  },
  {
    // Catch-all route for 404 errors
    path: '*',
    element: <NotFound />,
    metadata: {
      title: '404 - Page Not Found',
      description: 'The page you are looking for does not exist'
    }
  }
]

// ===================================
// ROUTER CONFIGURATION
// ===================================

// Create the router instance
export const router = createBrowserRouter(routes as RouteObject[])

// Export route paths as constants for type safety
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
} as const

// Type for route paths
export type RoutePath = typeof ROUTES[keyof typeof ROUTES]

// Export route metadata for use in components
export const getRouteMetadata = (path: string): RouteMetadata | undefined => {
  const findMetadata = (routes: AppRoute[]): RouteMetadata | undefined => {
    for (const route of routes) {
      if (route.path === path || (route.index && path === '/')) {
        return route.metadata
      }
      if (route.children) {
        const childMetadata = findMetadata(route.children as AppRoute[])
        if (childMetadata) return childMetadata
      }
    }
    return undefined
  }
  
  return findMetadata(routes)
} 