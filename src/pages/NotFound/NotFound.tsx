import { Link, useNavigate } from 'react-router-dom'
import styles from './NotFound.module.css'

// ===================================
// TYPESCRIPT INTERFACES & TYPES
// ===================================

interface NotFoundProps {
  // Props for future enhancements
}

// ===================================
// MAIN COMPONENT
// ===================================

function NotFound(): React.JSX.Element {
  const navigate = useNavigate()

  // Event handlers
  const handleGoBack = (): void => {
    navigate(-1) // Go back to previous page
  }

  return (
    <div className={styles.container}>
      <div className={styles.errorCard}>
        {/* Error Code */}
        <div className={styles.errorCode}>404</div>
        
        {/* Title */}
        <h1 className={styles.title}>Page Not Found</h1>
        
        {/* Description */}
        <p className={styles.description}>
          Oops! The page you're looking for doesn't exist. It might have been moved, 
          deleted, or you entered the wrong URL.
        </p>
        
        {/* Actions */}
        <div className={styles.actions}>
          <Link 
            to="/" 
            className={styles.homeButton}
            aria-label="Go to home page"
          >
            Go Home
          </Link>
          
          <button
            onClick={handleGoBack}
            className={styles.backButton}
            type="button"
            aria-label="Go back to previous page"
          >
            ← Go Back
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFound 