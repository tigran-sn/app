import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

// Interface for component props (even though App doesn't have props yet, this shows the pattern)
interface AppProps {
  // We'll add props here later as we build features
}

// Type for our counter state
type CounterState = number

// Interface for the logos (showing object typing)
interface LogoInfo {
  readonly src: string
  readonly alt: string
  readonly href: string
}

// Enum for different count levels (best practice example)
enum CountLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  EXTREME = 'extreme'
}

// Function component with proper TypeScript typing
function App(): React.JSX.Element {
  // State with explicit typing (though TypeScript can infer this)
  const [count, setCount] = useState<CounterState>(0)

  // Logo configuration with proper typing
  const logos: readonly LogoInfo[] = [
    {
      src: viteLogo,
      alt: 'Vite logo',
      href: 'https://vite.dev'
    },
    {
      src: reactLogo,
      alt: 'React logo',
      href: 'https://react.dev'
    }
  ] as const

  // Helper function with proper typing
  const getCountLevel = (currentCount: number): CountLevel => {
    if (currentCount < 5) return CountLevel.LOW
    if (currentCount < 10) return CountLevel.MEDIUM
    if (currentCount < 20) return CountLevel.HIGH
    return CountLevel.EXTREME
  }

  // Event handler with proper typing
  const handleCountIncrement = (): void => {
    setCount((prevCount: number) => prevCount + 1)
  }

  // Get current count level
  const currentLevel: CountLevel = getCountLevel(count)

  return (
    <>
      <div>
        {logos.map((logo: LogoInfo, index: number) => (
          <a
            key={`${logo.alt}-${index}`}
            href={logo.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={logo.src}
              className={`logo ${logo.alt.includes('React') ? 'react' : ''}`}
              alt={logo.alt}
            />
          </a>
        ))}
      </div>
      <h1>Vite + React + TypeScript</h1>
      <div className="card">
        <button
          onClick={handleCountIncrement}
          className={`count-button count-${currentLevel}`}
          type="button"
        >
          count is {count} ({currentLevel})
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
