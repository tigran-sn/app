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
      {/* Main application content */}
      <Home />
    </div>
  )
}

export default App 