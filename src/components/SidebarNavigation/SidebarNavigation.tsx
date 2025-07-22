import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import type { MenuItem } from '@/services/auth.types'
import styles from './SidebarNavigation.module.css'

// ===================================
// SIDEBAR NAVIGATION COMPONENT
// ===================================

interface SidebarNavigationProps {
  className?: string
}

function SidebarNavigation({ className }: SidebarNavigationProps): React.JSX.Element {
  const { user } = useAuth()
  const location = useLocation()

  // Filter and sort menu items
  const getFilteredMenuItems = (): MenuItem[] => {
    if (!user?.menuItems) return []
    
    return user.menuItems
      .filter(item => item.isActive) // Only show active items
      .sort((a, b) => {
        // Sort by order first, then by name
        if (a.order !== b.order) {
          return a.order - b.order
        }
        return a.name.localeCompare(b.name)
      })
  }

  // Get menu type display info
  const getMenuTypeInfo = (menuType: number) => {
    switch (menuType) {
      case 1:
        return { icon: '📋', label: 'Main', className: styles.mainMenu }
      case 2:
        return { icon: '🔗', label: 'Popup', className: styles.popupMenu }
      case 3:
        return { icon: '⚙️', label: 'Workflow', className: styles.workflowMenu }
      default:
        return { icon: '📄', label: 'Other', className: styles.otherMenu }
    }
  }

  // Generate route path from menu item
  const getMenuRoute = (item: MenuItem): string => {
    if (item.path) {
      return `/${item.path}`
    }
    
    // Special case: Home menu items should link to root path
    const menuKey = item.key.toLowerCase()
    if (menuKey === 'home' || menuKey === 'main') {
      return '/'
    }
    
    // Fallback: create route from key
    return `/${menuKey.replace(/([A-Z])/g, '-$1')}`
  }

  // Check if current route matches menu item
  const isCurrentRoute = (item: MenuItem): boolean => {
    const menuRoute = getMenuRoute(item)
    return location.pathname === menuRoute
  }

  const filteredMenuItems = getFilteredMenuItems()

  if (!user || filteredMenuItems.length === 0) {
    return (
      <nav className={`${styles.sidebar} ${className || ''}`}>
        <div className={styles.header}>
          <h3>📋 Navigation</h3>
        </div>
        <div className={styles.noItems}>
          <p>No menu items available</p>
        </div>
      </nav>
    )
  }

  return (
    <nav className={`${styles.sidebar} ${className || ''}`}>
      <div className={styles.header}>
        <h3>📋 Navigation</h3>
        <div className={styles.badge}>
          {filteredMenuItems.length} items
        </div>
      </div>
      
      <ul className={styles.menuList}>
        {filteredMenuItems.map((item) => {
          const typeInfo = getMenuTypeInfo(item.menuType)
          const route = getMenuRoute(item)
          const isCurrent = isCurrentRoute(item)
          const isDisabled = !item.isAvailable
          
          return (
            <li key={item.id} className={styles.menuItemWrapper}>
              {isDisabled ? (
                // Disabled item - render as span, not link
                <span 
                  className={`${styles.menuItem} ${styles.disabled} ${typeInfo.className}`}
                  title={`${item.name} (Not Available)`}
                >
                  <div className={styles.menuIcon}>
                    {typeInfo.icon}
                  </div>
                  <div className={styles.menuContent}>
                    <span className={styles.menuName}>{item.name}</span>
                    <span className={styles.menuType}>
                      {typeInfo.label} • Disabled
                    </span>
                  </div>
                  <div className={styles.menuStatus}>
                    🚫
                  </div>
                </span>
              ) : (
                // Available item - render as link
                <Link
                  to={route}
                  className={`${styles.menuItem} ${typeInfo.className} ${isCurrent ? styles.current : ''}`}
                  title={`Navigate to ${item.name}`}
                >
                  <div className={styles.menuIcon}>
                    {typeInfo.icon}
                  </div>
                  <div className={styles.menuContent}>
                    <span className={styles.menuName}>{item.name}</span>
                    <span className={styles.menuType}>
                      {typeInfo.label} • Order {item.order}
                    </span>
                  </div>
                  {isCurrent && (
                    <div className={styles.menuStatus}>
                      ➤
                    </div>
                  )}
                </Link>
              )}
            </li>
          )
        })}
      </ul>
      
      <div className={styles.footer}>
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>
              {filteredMenuItems.filter(item => item.menuType === 1).length}
            </span>
            <span className={styles.statLabel}>Main</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>
              {filteredMenuItems.filter(item => item.menuType === 2).length}
            </span>
            <span className={styles.statLabel}>Popup</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>
              {filteredMenuItems.filter(item => item.menuType === 3).length}
            </span>
            <span className={styles.statLabel}>Workflow</span>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default SidebarNavigation 