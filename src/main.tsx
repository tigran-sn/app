import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Get the root element with proper type safety
const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error(
    'Failed to find the root element. Make sure you have a <div id="root"></div> in your HTML.'
  )
}

// Create the root with proper typing
const root = createRoot(rootElement)

root.render(
  <StrictMode>
    <App />
  </StrictMode>
)
