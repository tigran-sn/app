import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ROUTES } from '@/routes'
import styles from './Navigation.module.css'

// ===================================
// TYPESCRIPT INTERFACES & TYPES
// ===================================

interface NavigationProps {
  // Props for future enhancements (theme, user state, etc.)
}

interface NavigationItem {
  readonly id: string
  readonly label: string
  readonly to: string
  readonly isActive?: boolean
}

// ===================================
// MAIN COMPONENT
// ===================================

function Navigation(): React.JSX.Element {
  // Mobile menu toggle state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)
  
  // Get current location from React Router
  const location = useLocation()

  // Navigation items configuration
  const navigationItems: readonly NavigationItem[] = [
    {
      id: 'home',
      label: 'Home',
      to: ROUTES.HOME,
      isActive: location.pathname === ROUTES.HOME
    },
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
  ] as const

  // Event Handlers
  const handleNavigation = (to: string): void => {
    setIsMobileMenuOpen(false) // Close mobile menu on navigation
    console.log(`Navigation: Navigating to ${to}`)
  }

  const toggleMobileMenu = (): void => {
    setIsMobileMenuOpen(prevState => !prevState)
  }

  const handleBrandClick = (): void => {
    setIsMobileMenuOpen(false)
  }

  // Helper function to get menu link classes
  const getMenuLinkClasses = (item: NavigationItem): string => {
    const baseClass = styles.menuLink
    const activeClass = item.isActive ? styles.active : ''
    
    return `${baseClass} ${activeClass}`.trim()
  }

  // Helper function to get hamburger classes
  const getHamburgerClasses = (): string => {
    const baseClass = styles.hamburger
    const openClass = isMobileMenuOpen ? styles.open : ''
    
    return `${baseClass} ${openClass}`.trim()
  }

  // Helper function to get menu classes
  const getMenuClasses = (): string => {
    const baseClass = styles.menu
    const openClass = isMobileMenuOpen ? styles.open : ''
    
    return `${baseClass} ${openClass}`.trim()
  }

  return (
    <nav className={styles.navbar} role="navigation" aria-label="Main navigation">
      <div className={styles.container}>
        <div className={styles.nav}>
          {/* Brand/Logo */}
          <Link
            to={ROUTES.HOME}
            onClick={handleBrandClick}
            className={styles.brand}
            aria-label="Go to home page"
          >
            React Learning
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className={styles.mobileMenuButton}
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="navigation-menu"
          >
            <div className={getHamburgerClasses()}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>

          {/* Navigation Menu */}
          <ul
            id="navigation-menu"
            className={getMenuClasses()}
            role="menubar"
          >
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
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navigation 