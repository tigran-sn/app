import { useState } from 'react'
import styles from './Navigation.module.css'

// ===================================
// TYPESCRIPT INTERFACES & TYPES
// ===================================

// Type for available pages (should match App component)
type PageType = 'home' | 'login'

interface NavigationProps {
  currentPage: PageType
  onPageChange: (page: PageType) => void
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

function Navigation({ currentPage, onPageChange }: NavigationProps): React.JSX.Element {
  // Mobile menu toggle state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)

  // Navigation items configuration
  const navigationItems: readonly NavigationItem[] = [
    {
      id: 'home',
      label: 'Home',
      href: '#',
      onClick: () => handleNavigation('home'),
      isActive: currentPage === 'home'
    },
    {
      id: 'login',
      label: 'Login',
      href: '#',
      onClick: () => handleNavigation('login'),
      isActive: currentPage === 'login'
    }
  ] as const

  // Event Handlers
  const handleNavigation = (pageId: PageType): void => {
    onPageChange(pageId) // Use the callback from App component
    setIsMobileMenuOpen(false) // Close mobile menu on navigation
    
    console.log(`Navigation: Changed to ${pageId} page`)
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