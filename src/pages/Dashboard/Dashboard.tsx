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
        <h1 className={styles.title}>Welcome to your Dashboard</h1>
        <p className={styles.subtitle}>
          Hello <strong>{user.displayName}</strong>! Here's your account information.
        </p>
      </div>

      <div className={styles.content}>
        {/* User Information Card */}
        <div className={styles.userCard}>
          <div className={styles.cardHeader}>
            <h2>👤 User Information</h2>
            <div className={styles.avatar}>
              {user.initials}
            </div>
          </div>
          
          <div className={styles.cardContent}>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.label}>Display Name:</span>
                <span className={styles.value}>{user.displayName}</span>
              </div>
              
              <div className={styles.infoItem}>
                <span className={styles.label}>Username:</span>
                <span className={styles.value}>{user.username}</span>
              </div>
              
              <div className={styles.infoItem}>
                <span className={styles.label}>Email:</span>
                <span className={styles.value}>{user.email}</span>
              </div>
              
              {user.firstName && (
                <div className={styles.infoItem}>
                  <span className={styles.label}>First Name:</span>
                  <span className={styles.value}>{user.firstName}</span>
                </div>
              )}
              
              {user.lastName && (
                <div className={styles.infoItem}>
                  <span className={styles.label}>Last Name:</span>
                  <span className={styles.value}>{user.lastName}</span>
                </div>
              )}
              
              {user.platform && (
                <div className={styles.infoItem}>
                  <span className={styles.label}>Platform:</span>
                  <span className={styles.value}>{user.platform}</span>
                </div>
              )}
              
              {user.locale && (
                <div className={styles.infoItem}>
                  <span className={styles.label}>Locale:</span>
                  <span className={styles.value}>{user.locale}</span>
                </div>
              )}
              
              {user.roles && user.roles.length > 0 && (
                <div className={styles.infoItem}>
                  <span className={styles.label}>Roles:</span>
                  <span className={styles.value}>
                    {user.roles.join(', ')}
                  </span>
                </div>
              )}
              
              {user.permissions && user.permissions.length > 0 && (
                <div className={styles.infoItem}>
                  <span className={styles.label}>Permissions:</span>
                  <span className={styles.value}>
                    {user.permissions.slice(0, 3).join(', ')}
                    {user.permissions.length > 3 && ` (+${user.permissions.length - 3} more)`}
                  </span>
                </div>
              )}
              
              {user.lastLoginAt && (
                <div className={styles.infoItem}>
                  <span className={styles.label}>Last Login:</span>
                  <span className={styles.value}>
                    {new Date(user.lastLoginAt).toLocaleString()}
                  </span>
                </div>
              )}
              
              <div className={styles.infoItem}>
                <span className={styles.label}>Status:</span>
                <span className={`${styles.value} ${user.isActive ? styles.active : styles.inactive}`}>
                  {user.isActive ? '🟢 Active' : '🔴 Inactive'}
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
                onClick={handleLogout} 
                className={styles.logoutButton}
                aria-label="Logout from your account"
              >
                🚪 Logout
              </button>
              
              <button 
                className={styles.actionButton}
                onClick={() => console.log('Profile settings clicked')}
                aria-label="Edit profile settings"
              >
                ⚙️ Settings
              </button>
              
              <button 
                className={styles.actionButton}
                onClick={() => console.log('Help & Support clicked')}
                aria-label="Get help and support"
              >
                ❓ Help & Support
              </button>
            </div>
            
            <div className={styles.systemInfo}>
              <div className={styles.infoItem}>
                <span className={styles.label}>User ID:</span>
                <span className={styles.value} style={{ fontFamily: 'monospace', fontSize: '0.85em' }}>
                  {user.id}
                </span>
              </div>
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
            <pre style={{ fontSize: '0.75em', overflow: 'auto' }}>
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard 