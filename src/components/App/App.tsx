import { Outlet } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import Navigation from '@/components/Navigation'
import styles from './App.module.css'

// ===================================
// TYPESCRIPT INTERFACES & TYPES
// ===================================

interface AppProps {
  // Props will be added here as the app evolves
}

// ===================================
// MAIN APP COMPONENT
// ===================================

function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <div className={styles.app}>
        {/* Global Navigation */}
        <Navigation />
        
        {/* Main Content Area */}
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </AuthProvider>
  )
}

export default App 