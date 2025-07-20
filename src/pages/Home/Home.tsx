import styles from './Home.module.css'

// ===================================
// TYPESCRIPT INTERFACES & TYPES
// ===================================

interface HomeProps {
  // Props for future enhancements
}

interface Feature {
  readonly id: string
  readonly title: string
  readonly description: string
}

// ===================================
// MAIN COMPONENT
// ===================================

function Home(): React.JSX.Element {
  // Feature data - could come from props or API later
  const features: readonly Feature[] = [
    {
      id: 'react',
      title: 'Modern React',
      description: 'Built with React 19 and the latest patterns including hooks, context, and modern component architecture.'
    },
    {
      id: 'typescript',
      title: 'TypeScript Ready',
      description: 'Fully typed with strict TypeScript configuration, interfaces, enums, and proper type safety throughout.'
    },
    {
      id: 'styling',
      title: 'Professional Styling',
      description: 'CSS Modules with design system, custom properties, responsive design, and dark/light theme support.'
    }
  ] as const

  // Event handler for CTA button
  const handleGetStarted = (): void => {
    console.log('Get Started clicked - ready for next features!')
    // Future: Navigate to first learning module
  }

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <h1 className={styles.title}>
          Welcome to React Learning
        </h1>
        <p className={styles.subtitle}>
          A hands-on journey to master React with TypeScript, modern styling, and professional development practices.
          Build real projects while learning the fundamentals that matter.
        </p>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        {features.map((feature: Feature) => (
          <div
            key={feature.id}
            className={styles.featureCard}
          >
            <h3 className={styles.featureTitle}>
              {feature.title}
            </h3>
            <p className={styles.featureDescription}>
              {feature.description}
            </p>
          </div>
        ))}
      </section>

      {/* Call to Action Section */}
      <section className={styles.cta}>
        <button
          onClick={handleGetStarted}
          className={styles.ctaButton}
          type="button"
          aria-label="Start learning React fundamentals"
        >
          Get Started Learning
        </button>
      </section>
    </div>
  )
}

export default Home 