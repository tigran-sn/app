import { useAuth } from '@/contexts/AuthContext'
import { SidebarNavigation } from '@/components'
import styles from './Dashboard.module.css'

// ===================================
// DASHBOARD COMPONENT
// ===================================

function Dashboard(): React.JSX.Element {
  const { user, logout, refreshUserProfile } = useAuth()

  const handleLogout = (): void => {
    logout() // This will trigger logout and redirection via AuthContext
  }

  const handleRefreshProfile = async (): Promise<void> => {
    try {
      await refreshUserProfile()
      console.log('Profile refreshed successfully')
    } catch (error) {
      console.error('Failed to refresh profile:', error)
    }
  }

  if (!user) {
    return (
      <div className={styles.dashboardLayout}>
        <SidebarNavigation />
        <div className={styles.mainContent}>
          <div className={styles.container}>
            <div className={styles.error}>
              <h1>Error</h1>
              <p>User information not available. Please try logging in again.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.dashboardLayout}>
      {/* Left Sidebar Navigation */}
      <SidebarNavigation />
      
      {/* Main Content Area */}
      <div className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>TradeCloud Dashboard</h1>
            <p className={styles.subtitle}>
              Welcome back, <strong>{user.displayName}</strong>! Here's your account overview.
            </p>
          </div>

          <div className={styles.content}>
            {/* User Information Card */}
            <div className={styles.userCard}>
              <div className={styles.cardHeader}>
                <h2>👤 Account Information</h2>
                <div className={styles.avatar}>
                  {user.initials}
                </div>
              </div>
              
              <div className={styles.cardContent}>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>User ID:</span>
                    <span className={styles.value} style={{ fontFamily: 'monospace' }}>
                      {user.id}
                    </span>
                  </div>
                  
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Username:</span>
                    <span className={styles.value}>{user.username}</span>
                  </div>
                  
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Full Name:</span>
                    <span className={styles.value}>{user.fullName}</span>
                  </div>
                  
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Email:</span>
                    <span className={styles.value}>{user.email}</span>
                  </div>
                  
                  {user.title && (
                    <div className={styles.infoItem}>
                      <span className={styles.label}>Title:</span>
                      <span className={styles.value}>{user.title}</span>
                    </div>
                  )}
                  
                  {user.culture && (
                    <div className={styles.infoItem}>
                      <span className={styles.label}>Culture/Locale:</span>
                      <span className={styles.value}>{user.culture}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation Summary Card */}
            <div className={styles.summaryCard}>
              <div className={styles.cardHeader}>
                <h2>🧭 Navigation Summary</h2>
                <div className={styles.badge}>
                  {user.menuItems?.filter(item => item.isActive).length || 0} Active
                </div>
              </div>
              
              <div className={styles.cardContent}>
                <div className={styles.summaryGrid}>
                  <div className={styles.summaryItem}>
                    <div className={styles.summaryIcon}>📋</div>
                    <div className={styles.summaryInfo}>
                      <span className={styles.summaryValue}>
                        {user.menuItems?.filter(item => item.menuType === 1 && item.isActive).length || 0}
                      </span>
                      <span className={styles.summaryLabel}>Main Menus</span>
                    </div>
                  </div>
                  
                  <div className={styles.summaryItem}>
                    <div className={styles.summaryIcon}>🔗</div>
                    <div className={styles.summaryInfo}>
                      <span className={styles.summaryValue}>
                        {user.menuItems?.filter(item => item.menuType === 2 && item.isActive).length || 0}
                      </span>
                      <span className={styles.summaryLabel}>Popups</span>
                    </div>
                  </div>
                  
                  <div className={styles.summaryItem}>
                    <div className={styles.summaryIcon}>⚙️</div>
                    <div className={styles.summaryInfo}>
                      <span className={styles.summaryValue}>
                        {user.menuItems?.filter(item => item.menuType === 3 && item.isActive).length || 0}
                      </span>
                      <span className={styles.summaryLabel}>Workflows</span>
                    </div>
                  </div>
                  
                  <div className={styles.summaryItem}>
                    <div className={styles.summaryIcon}>🔐</div>
                    <div className={styles.summaryInfo}>
                      <span className={styles.summaryValue}>
                        {user.permissions?.length || 0}
                      </span>
                      <span className={styles.summaryLabel}>Permissions</span>
                    </div>
                  </div>
                </div>
                
                <div className={styles.navigationHint}>
                  <p>💡 Use the sidebar navigation to explore your available menu items and workflows.</p>
                </div>
              </div>
            </div>

            {/* System Status Card */}
            <div className={styles.statusCard}>
              <div className={styles.cardHeader}>
                <h2>🔐 System Access</h2>
              </div>
              
              <div className={styles.cardContent}>
                <div className={styles.statusGrid}>
                  <div className={styles.statusItem}>
                    <span className={styles.statusLabel}>User Roles:</span>
                    <div className={styles.rolesList}>
                      {user.roles && user.roles.length > 0 ? (
                        user.roles.map(role => (
                          <span key={role} className={styles.roleTag}>
                            Role {role}
                          </span>
                        ))
                      ) : (
                        <span className={styles.noRoles}>No roles assigned</span>
                      )}
                    </div>
                  </div>
                  
                  <div className={styles.statusItem}>
                    <span className={styles.statusLabel}>TC Conditions:</span>
                    <span className={`${styles.statusValue} ${user.isTCConditionsAccepted ? styles.accepted : styles.pending}`}>
                      {user.isTCConditionsAccepted ? '✅ Accepted' : '⏳ Pending'}
                    </span>
                  </div>
                  
                  <div className={styles.statusItem}>
                    <span className={styles.statusLabel}>Account Status:</span>
                    <span className={`${styles.statusValue} ${user.isActive ? styles.active : styles.inactive}`}>
                      {user.isActive ? '🟢 Active' : '🔴 Inactive'}
                    </span>
                  </div>
                  
                  <div className={styles.statusItem}>
                    <span className={styles.statusLabel}>Companies:</span>
                    <span className={styles.statusValue}>
                      {user.userCompanyIds?.join(', ') || 'None'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className={styles.actionsCard}>
              <div className={styles.cardHeader}>
                <h2>⚡ Quick Actions</h2>
              </div>
              
              <div className={styles.cardContent}>
                <div className={styles.actionButtons}>
                  <button 
                    onClick={handleRefreshProfile} 
                    className={styles.actionButton}
                    aria-label="Refresh your profile data"
                  >
                    🔄 Refresh Profile
                  </button>
                  
                  <button 
                    className={styles.actionButton}
                    onClick={() => console.log('Access test results:', {
                      hasHomeAccess: user.hasMenuAccess('home'),
                      hasContractAccess: user.hasMenuAccess('Contract'),
                      hasRole1: user.hasRole(1),
                      hasRole2: user.hasRole(2),
                      totalMenus: user.menuItems?.length || 0,
                      activeMenus: user.menuItems?.filter(item => item.isActive).length || 0
                    })}
                    aria-label="Test menu access functions"
                  >
                    🧪 Test Access
                  </button>
                  
                  {user.picture?.path && (
                    <button 
                      className={styles.actionButton}
                      onClick={() => {
                        if (user.picture?.path) {
                          window.open(`https://tcwapi.tradecloud1.net/${user.picture.path}`, '_blank')
                        }
                      }}
                      aria-label="View profile picture"
                    >
                      🖼️ Profile Picture
                    </button>
                  )}
                  
                  <button 
                    onClick={handleLogout} 
                    className={styles.logoutButton}
                    aria-label="Logout from your account"
                  >
                    🚪 Logout
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Debug Information (for development) */}
          {process.env.NODE_ENV === 'development' && (
            <div className={styles.debugCard}>
              <div className={styles.cardHeader}>
                <h3>🔧 Debug Information</h3>
              </div>
              <div className={styles.cardContent}>
                <details>
                  <summary>Full User Object (Click to expand)</summary>
                  <pre style={{ fontSize: '0.75em', overflow: 'auto', maxHeight: '300px' }}>
                    {JSON.stringify(user, null, 2)}
                  </pre>
                </details>
                
                <div style={{ marginTop: '1rem' }}>
                  <strong>Navigation Stats:</strong>
                  <ul style={{ fontSize: '0.85em', marginTop: '0.5rem' }}>
                    <li>Total Menu Items: {user.menuItems?.length || 0}</li>
                    <li>Active Menus: {user.menuItems?.filter(item => item.isActive).length || 0}</li>
                    <li>Available Menus: {user.menuItems?.filter(item => item.isAvailable).length || 0}</li>
                    <li>Main Menus: {user.menuItems?.filter(item => item.menuType === 1).length || 0}</li>
                    <li>Popup Menus: {user.menuItems?.filter(item => item.menuType === 2).length || 0}</li>
                    <li>Workflow Menus: {user.menuItems?.filter(item => item.menuType === 3).length || 0}</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard 