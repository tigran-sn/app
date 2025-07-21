import { useAuth } from '@/contexts/AuthContext'
import styles from './Dashboard.module.css'

// ===================================
// DASHBOARD COMPONENT
// ===================================

function Dashboard(): React.JSX.Element {
  const { user, logout } = useAuth()

  const handleLogout = (): void => {
    logout() // This will trigger logout and redirection via AuthContext
  }

  const handleRefreshProfile = async (): Promise<void> => {
    const { refreshUserProfile } = useAuth()
    try {
      await refreshUserProfile()
      console.log('Profile refreshed successfully')
    } catch (error) {
      console.error('Failed to refresh profile:', error)
    }
  }

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h1>Error</h1>
          <p>User information not available. Please try logging in again.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Welcome to TradeCloud Dashboard</h1>
        <p className={styles.subtitle}>
          Hello <strong>{user.displayName}</strong>! Here's your TradeCloud account information.
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
              
              {user.roles && user.roles.length > 0 && (
                <div className={styles.infoItem}>
                  <span className={styles.label}>User Roles:</span>
                  <span className={styles.value}>
                    {user.roles.map(role => `Role ${role}`).join(', ')}
                  </span>
                </div>
              )}
              
              {user.userCompanyIds && user.userCompanyIds.length > 0 && (
                <div className={styles.infoItem}>
                  <span className={styles.label}>Company IDs:</span>
                  <span className={styles.value}>
                    {user.userCompanyIds.join(', ')}
                  </span>
                </div>
              )}
              
              <div className={styles.infoItem}>
                <span className={styles.label}>TC Conditions:</span>
                <span className={`${styles.value} ${user.isTCConditionsAccepted ? styles.accepted : styles.pending}`}>
                  {user.isTCConditionsAccepted ? '✅ Accepted' : '⏳ Pending'}
                </span>
              </div>
              
              <div className={styles.infoItem}>
                <span className={styles.label}>Account Status:</span>
                <span className={`${styles.value} ${user.isActive ? styles.active : styles.inactive}`}>
                  {user.isActive ? '🟢 Active' : '🔴 Inactive'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Access Card */}
        {user.menuItems && user.menuItems.length > 0 && (
          <div className={styles.menuCard}>
            <div className={styles.cardHeader}>
              <h2>🧭 Menu Access</h2>
              <div className={styles.badge}>
                {user.menuItems.filter(item => item.isActive && item.isAvailable).length} Active
              </div>
            </div>
            
            <div className={styles.cardContent}>
              <div className={styles.menuGrid}>
                {user.menuItems
                  .filter(item => item.isActive && item.isAvailable)
                  .sort((a, b) => a.order - b.order)
                  .slice(0, 12) // Show first 12 items
                  .map(item => (
                    <div key={item.id} className={styles.menuItem}>
                      <div className={styles.menuIcon}>
                        {item.menuType === 1 ? '📋' : item.menuType === 2 ? '🔗' : '⚙️'}
                      </div>
                      <div className={styles.menuInfo}>
                        <span className={styles.menuName}>{item.name}</span>
                        <span className={styles.menuType}>
                          {item.menuType === 1 ? 'Main' : item.menuType === 2 ? 'Popup' : 'Workflow'}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
              
              {user.menuItems.filter(item => item.isActive && item.isAvailable).length > 12 && (
                <div className={styles.menuMore}>
                  +{user.menuItems.filter(item => item.isActive && item.isAvailable).length - 12} more menu items...
                </div>
              )}
            </div>
          </div>
        )}

        {/* Permissions & Roles Card */}
        <div className={styles.permissionsCard}>
          <div className={styles.cardHeader}>
            <h2>🔐 Permissions & Access</h2>
          </div>
          
          <div className={styles.cardContent}>
            <div className={styles.permissionsGrid}>
              <div className={styles.permissionSection}>
                <h3>System Roles</h3>
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
              
              <div className={styles.permissionSection}>
                <h3>Menu Permissions</h3>
                <div className={styles.permissionsList}>
                  {user.permissions && user.permissions.length > 0 ? (
                    user.permissions.slice(0, 8).map(permission => (
                      <span key={permission} className={styles.permissionTag}>
                        {permission}
                      </span>
                    ))
                  ) : (
                    <span className={styles.noPermissions}>No permissions found</span>
                  )}
                  {user.permissions && user.permissions.length > 8 && (
                    <span className={styles.morePermissions}>
                      +{user.permissions.length - 8} more...
                    </span>
                  )}
                </div>
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
                onClick={() => console.log('Menu access test:', {
                  hasHomeAccess: user.hasMenuAccess('home'),
                  hasContractAccess: user.hasMenuAccess('Contract'),
                  hasRole1: user.hasRole(1),
                  hasRole2: user.hasRole(2)
                })}
                aria-label="Test menu access functions"
              >
                🧪 Test Access
              </button>
              
              <button 
                className={styles.actionButton}
                onClick={() => {
                  if (user.picture?.path) {
                    window.open(`https://tcwapi.tradecloud1.net/${user.picture.path}`, '_blank')
                  } else {
                    alert('No profile picture available')
                  }
                }}
                aria-label="View profile picture"
              >
                🖼️ Profile Picture
              </button>
              
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
            <h3>🔧 Debug Info</h3>
          </div>
          <div className={styles.cardContent}>
            <details>
              <summary>Full User Object (Click to expand)</summary>
              <pre style={{ fontSize: '0.75em', overflow: 'auto', maxHeight: '300px' }}>
                {JSON.stringify(user, null, 2)}
              </pre>
            </details>
            
            <div style={{ marginTop: '1rem' }}>
              <strong>Quick Stats:</strong>
              <ul style={{ fontSize: '0.85em', marginTop: '0.5rem' }}>
                <li>Menu Items: {user.menuItems?.length || 0}</li>
                <li>Active Menus: {user.menuItems?.filter(item => item.isActive && item.isAvailable).length || 0}</li>
                <li>Permissions: {user.permissions?.length || 0}</li>
                <li>Roles: {user.roles?.length || 0}</li>
                <li>Company IDs: {user.userCompanyIds?.length || 0}</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard 