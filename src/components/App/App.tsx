import { useState } from 'react'
import Navigation from '@/components/Navigation'
import { Home, Login } from '@/pages'

// ===================================
// TYPESCRIPT INTERFACES & TYPES
// ===================================

interface AppProps {
  // Props will be added here as the app evolves
}

// Type for available pages
type PageType = 'home' | 'login'

// ===================================
// MAIN APP COMPONENT
// ===================================

function App(): React.JSX.Element {
  // Current page state
  const [currentPage, setCurrentPage] = useState<PageType>('home')

  // Page change handler
  const handlePageChange = (page: PageType): void => {
    setCurrentPage(page)
    console.log(`App: Switched to ${page} page`)
  }

  // Helper function to render the current page
  const renderCurrentPage = (): React.JSX.Element => {
    switch (currentPage) {
      case 'home':
        return <Home />
      case 'login':
        return <Login />
      default:
        return <Home />
    }
  }

  return (
    <div>
      {/* Navigation with page change callback */}
      <Navigation 
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
      
      {/* Main application content */}
      <main role="main">
        {renderCurrentPage()}
      </main>
    </div>
  )
}

export default App 