import { useAuth } from '@/contexts/AuthContext'
import styles from './Dashboard.module.css'

// ===================================
// DASHBOARD COMPONENT
// ===================================

function Dashboard(): React.JSX.Element {
  const { user, logout } = useAuth()

  const handleLogout = (): void => {
    console.log('🚪 User logout requested from dashboard')
    
    // Call logout (navigation handled by AuthContext)
    logout()
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Header Section */}
        <header className={styles.header}>
          <h1 className={styles.title}>
            Welcome to your Dashboard
          </h1>
          <p className={styles.subtitle}>
            You are successfully authenticated!
          </p>
        </header>

        {/* User Information Card */}
        <div className={styles.userCard}>
          <h2 className={styles.cardTitle}>👤 User Information</h2>
          
          <div className={styles.userInfo}>
            <div className={styles.infoItem}>
              <span className={styles.label}>Username:</span>
              <span className={styles.value}>{user?.username || 'N/A'}</span>
            </div>
            
            <div className={styles.infoItem}>
              <span className={styles.label}>Email:</span>
              <span className={styles.value}>{user?.email || 'N/A'}</span>
            </div>
            
            <div className={styles.infoItem}>
              <span className={styles.label}>User ID:</span>
              <span className={styles.value}>{user?.id || 'N/A'}</span>
            </div>
            
            {user?.firstName && (
              <div className={styles.infoItem}>
                <span className={styles.label}>First Name:</span>
                <span className={styles.value}>{user.firstName}</span>
              </div>
            )}
            
            {user?.lastName && (
              <div className={styles.infoItem}>
                <span className={styles.label}>Last Name:</span>
                <span className={styles.value}>{user.lastName}</span>
              </div>
            )}
            
            {user?.role && (
              <div className={styles.infoItem}>
                <span className={styles.label}>Role:</span>
                <span className={styles.value}>{user.role}</span>
              </div>
            )}
            
            {user?.permissions && user.permissions.length > 0 && (
              <div className={styles.infoItem}>
                <span className={styles.label}>Permissions:</span>
                <span className={styles.value}>
                  {user.permissions.join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className={styles.actionsCard}>
          <h2 className={styles.cardTitle}>🚀 Quick Actions</h2>
          
          <div className={styles.actionButtons}>
            <button
              className={styles.actionButton}
              onClick={() => console.log('Profile edit requested')}
            >
              📝 Edit Profile
            </button>
            
            <button
              className={styles.actionButton}
              onClick={() => console.log('Settings requested')}
            >
              ⚙️ Settings
            </button>
            
            <button
              className={`${styles.actionButton} ${styles.logoutButton}`}
              onClick={handleLogout}
            >
              🚪 Logout
            </button>
          </div>
        </div>

        {/* Authentication Status */}
        <div className={styles.statusCard}>
          <h2 className={styles.cardTitle}>🔒 Authentication Status</h2>
          
          <div className={styles.statusInfo}>
            <div className={styles.statusItem}>
              <div className={styles.statusIndicator}></div>
              <span>You are securely authenticated</span>
            </div>
            
            <div className={styles.statusDetails}>
              <p>
                🔐 Your session is protected with JWT tokens<br />
                🛡️ This page requires authentication to access<br />
                💾 Your authentication state persists across browser sessions
              </p>
            </div>
          </div>
        </div>

        {/* Developer Information */}
        <div className={styles.developerCard}>
          <h2 className={styles.cardTitle}>🛠️ For Developers</h2>
          
          <div className={styles.developerInfo}>
            <p>
              This dashboard demonstrates:
            </p>
            <ul className={styles.featureList}>
              <li>✅ Real OAuth2 authentication with TradeCloud API</li>
              <li>✅ JWT token management and storage</li>
              <li>✅ React Context for global auth state</li>
              <li>✅ Protected routes and navigation</li>
              <li>✅ Persistent authentication sessions</li>
              <li>✅ Professional error handling</li>
              <li>✅ TypeScript best practices</li>
              <li>✅ Modern React patterns (hooks, context)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard 