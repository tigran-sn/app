import Navigation from '@/components/Navigation'
import Home from '@/pages/Home'

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
      {/* Navigation */}
      <Navigation />
      
      {/* Main application content */}
      <main role="main">
        <Home />
      </main>
    </div>
  )
}

export default App 