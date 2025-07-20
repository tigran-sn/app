import { useState } from 'react'
import reactLogo from '../../assets/react.svg'
import viteLogo from '/vite.svg'
import styles from './App.module.css'

// ===================================
// TYPESCRIPT INTERFACES & TYPES
// ===================================

// Interface for component props (future-proofing)
interface AppProps {
  // Props will be added here as the component evolves
}

// Type for our counter state
type CounterState = number

// Interface for the logos (demonstrating object typing)
interface LogoInfo {
  readonly src: string
  readonly alt: string
  readonly href: string
  readonly className?: string
}

// Enum for different count levels (TypeScript best practice)
enum CountLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  EXTREME = 'extreme'
}

// Type for CSS class combinations
type CountButtonClass = `${typeof styles.countButton} ${string}`

// ===================================
// MAIN COMPONENT
// ===================================

function App(): React.JSX.Element {
  // State with explicit typing (TypeScript best practice)
  const [count, setCount] = useState<CounterState>(0)

  // Logo configuration with proper typing and immutability
  const logos: readonly LogoInfo[] = [
    {
      src: viteLogo,
      alt: 'Vite logo',
      href: 'https://vite.dev',
    },
    {
      src: reactLogo,
      alt: 'React logo',
      href: 'https://react.dev',
      className: 'react'
    }
  ] as const

  // Helper function with proper typing and business logic
  const getCountLevel = (currentCount: number): CountLevel => {
    if (currentCount < 5) return CountLevel.LOW
    if (currentCount < 10) return CountLevel.MEDIUM
    if (currentCount < 20) return CountLevel.HIGH
    return CountLevel.EXTREME
  }

  // Helper function to get count-specific CSS classes
  const getCountButtonClasses = (level: CountLevel): string => {
    const baseClass = styles.countButton
    const levelClass = styles[`count${level.charAt(0).toUpperCase() + level.slice(1)}`]
    
    return `${baseClass} ${levelClass || ''}`
  }

  // Event handler with proper typing
  const handleCountIncrement = (): void => {
    setCount((prevCount: number) => prevCount + 1)
  }

  // Reset handler for future features
  const handleCountReset = (): void => {
    setCount(0)
  }

  // Get current count level
  const currentLevel: CountLevel = getCountLevel(count)

  return (
    <div className={styles.root}>
      {/* Logo Section */}
      <div className={styles.logoContainer}>
        {logos.map((logo: LogoInfo, index: number) => (
          <a
            key={`${logo.alt}-${index}`}
            href={logo.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={logo.src}
              className={`${styles.logo} ${logo.className ? styles[logo.className] : ''}`}
              alt={logo.alt}
            />
          </a>
        ))}
      </div>

      {/* Title Section */}
      <h1 className={styles.title}>
        Vite + React + TypeScript
      </h1>

      {/* Interactive Card Section */}
      <div className={styles.card}>
        <button
          onClick={handleCountIncrement}
          className={getCountButtonClasses(currentLevel)}
          type="button"
          aria-label={`Increment count. Current count is ${count} at ${currentLevel} level`}
        >
          count is {count} ({currentLevel})
        </button>

        <p className={styles.description}>
          Edit <code>src/components/App/App.tsx</code> and save to test HMR
        </p>

        {/* Show reset button when count > 0 (conditional rendering example) */}
        {count > 0 && (
          <button
            onClick={handleCountReset}
            type="button"
            style={{
              marginTop: 'var(--spacing-4)',
              padding: 'var(--spacing-2) var(--spacing-4)',
              fontSize: 'var(--font-size-sm)',
              backgroundColor: 'var(--color-neutral-500)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--border-radius-base)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            Reset
          </button>
        )}
      </div>

      {/* Footer Section */}
      <p className={styles.readTheDocs}>
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App 