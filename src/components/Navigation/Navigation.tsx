import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTES } from '@/routes'
import styles from './Navigation.module.css'

// ===================================
// TYPESCRIPT INTERFACES
// ===================================

interface NavigationItem {
  readonly id: string
  readonly label: string
  readonly to: string
  readonly isActive: boolean
}

// ===================================
// NAVIGATION COMPONENT
// ===================================

function Navigation(): React.JSX.Element {
  // Mobile menu toggle state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)
  
  // Get current location from React Router
  const location = useLocation()
  
  // Get authentication state
  const { isAuthenticated, user, logout } = useAuth()

  // Navigation items configuration (changes based on auth state)
  const navigationItems: readonly NavigationItem[] = [
    {
      id: 'home',
      label: 'Home',
      to: ROUTES.HOME,
      isActive: location.pathname === ROUTES.HOME
    },
    ...(isAuthenticated ? [
      // Authenticated user items
      {
        id: 'dashboard',
        label: 'Dashboard',
        to: ROUTES.DASHBOARD,
        isActive: location.pathname === ROUTES.DASHBOARD
      }
    ] : [
      // Non-authenticated user items
      {
        id: 'login',
        label: 'Login',
        to: ROUTES.LOGIN,
        isActive: location.pathname === ROUTES.LOGIN
      },
      {
        id: 'signup',
        label: 'Sign Up',
        to: ROUTES.SIGNUP,
        isActive: location.pathname === ROUTES.SIGNUP
      }
    ])
  ] as const

  // ===================================
  // EVENT HANDLERS
  // ===================================

  const handleNavigation = (to: string): void => {
    console.log(`Navigating to: ${to}`)
    setIsMobileMenuOpen(false)
  }

  const handleMobileToggle = (): void => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleBrandClick = (): void => {
    setIsMobileMenuOpen(false)
  }

  const handleLogout = (): void => {
    console.log('🚪 User requested logout')
    logout()
    setIsMobileMenuOpen(false)
  }

  // ===================================
  // HELPER FUNCTIONS
  // ===================================

  const getMenuLinkClasses = (item: NavigationItem): string => {
    return `${styles.menuLink} ${item.isActive ? styles.active : ''}`
  }

  const getMobileToggleClasses = (): string => {
    return `${styles.mobileToggle} ${isMobileMenuOpen ? styles.open : ''}`
  }

  const getMobileMenuClasses = (): string => {
    return `${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`
  }

  // ===================================
  // RENDER
  // ===================================

  return (
    <nav className={styles.navigation} role="navigation" aria-label="Main navigation">
      <div className={styles.container}>
        {/* Brand/Logo */}
        <Link
          to={ROUTES.HOME}
          onClick={handleBrandClick}
          className={styles.brand}
          aria-label="Go to homepage"
        >
          ⚛️ React App
        </Link>

        {/* Desktop Menu */}
        <ul className={styles.desktopMenu} role="menubar">
          {navigationItems.map((item: NavigationItem) => (
            <li
              key={item.id}
              className={styles.menuItem}
              role="none"
            >
              <Link
                to={item.to}
                onClick={() => handleNavigation(item.to)}
                className={getMenuLinkClasses(item)}
                role="menuitem"
                aria-current={item.isActive ? 'page' : undefined}
                tabIndex={0}
              >
                {item.label}
              </Link>
            </li>
          ))}
          
          {/* User Menu for Authenticated Users */}
          {isAuthenticated && user && (
            <>
              <li className={styles.menuItem} role="none">
                <span className={styles.userInfo}>
                  👤 {user.username}
                </span>
              </li>
              <li className={styles.menuItem} role="none">
                <button
                  onClick={handleLogout}
                  className={styles.logoutButton}
                  role="menuitem"
                  tabIndex={0}
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>

        {/* Mobile Menu Toggle */}
        <button
          onClick={handleMobileToggle}
          className={getMobileToggleClasses()}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
        >
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={getMobileMenuClasses()}
        role="menu"
        aria-labelledby="mobile-menu-toggle"
      >
        <ul className={styles.mobileMenuList} role="none">
          {navigationItems.map((item: NavigationItem) => (
            <li
              key={item.id}
              className={styles.menuItem}
              role="none"
            >
              <Link
                to={item.to}
                onClick={() => handleNavigation(item.to)}
                className={getMenuLinkClasses(item)}
                role="menuitem"
                aria-current={item.isActive ? 'page' : undefined}
                tabIndex={0}
              >
                {item.label}
              </Link>
            </li>
          ))}
          
          {/* User Menu for Authenticated Users */}
          {isAuthenticated && user && (
            <>
              <li className={styles.menuItem} role="none">
                <span className={styles.userInfo}>
                  👤 {user.username}
                </span>
              </li>
              <li className={styles.menuItem} role="none">
                <button
                  onClick={handleLogout}
                  className={styles.logoutButton}
                  role="menuitem"
                  tabIndex={0}
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Navigation 