import { Outlet } from 'react-router-dom'
import Navigation from '@/components/Navigation'

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
    <div>
      {/* Navigation - no longer needs props, uses React Router internally */}
      <Navigation />
      
      {/* Main application content - rendered by React Router */}
      <main role="main">
        <Outlet />
      </main>
    </div>
  )
}

export default App 