import { useState } from 'react'
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
  readonly href?: string
  readonly onClick?: () => void
  readonly isActive?: boolean
}

// ===================================
// MAIN COMPONENT
// ===================================

function Navigation(): React.JSX.Element {
  // Mobile menu toggle state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)
  
  // Current active page state (in a real app, this would come from router)
  const [activePage, setActivePage] = useState<string>('home')

  // Navigation items configuration
  const navigationItems: readonly NavigationItem[] = [
    {
      id: 'home',
      label: 'Home',
      href: '#',
      onClick: () => handleNavigation('home'),
      isActive: activePage === 'home'
    },
    {
      id: 'login',
      label: 'Login',
      href: '#',
      onClick: () => handleNavigation('login'),
      isActive: activePage === 'login'
    }
  ] as const

  // Event Handlers
  const handleNavigation = (pageId: string): void => {
    setActivePage(pageId)
    setIsMobileMenuOpen(false) // Close mobile menu on navigation
    
    // Log navigation for now (future: implement actual routing)
    console.log(`Navigating to: ${pageId}`)
    
    if (pageId === 'login') {
      console.log('Login page will be implemented later')
    }
  }

  const toggleMobileMenu = (): void => {
    setIsMobileMenuOpen(prevState => !prevState)
  }

  const handleBrandClick = (): void => {
    handleNavigation('home')
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
          <button
            onClick={handleBrandClick}
            className={styles.brand}
            aria-label="Go to home page"
          >
            React Learning
          </button>

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
                <button
                  onClick={item.onClick}
                  className={getMenuLinkClasses(item)}
                  role="menuitem"
                  aria-current={item.isActive ? 'page' : undefined}
                  tabIndex={0}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navigation 