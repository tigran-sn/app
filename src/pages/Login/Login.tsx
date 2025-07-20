import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTES } from '@/routes'
import styles from './Login.module.css'

// ===================================
// TYPESCRIPT INTERFACES
// ===================================

interface LoginFormData {
  username: string
  password: string
}

interface FormErrors {
  username?: string
  password?: string
  general?: string
}

interface ValidationRule {
  required?: boolean
  minLength?: number
  pattern?: RegExp
  message: string
}

interface ValidationRules {
  username: ValidationRule[]
  password: ValidationRule[]
}

// ===================================
// VALIDATION CONFIGURATION
// ===================================

const validationRules: ValidationRules = {
  username: [
    { required: true, message: 'Username is required' },
    { minLength: 3, message: 'Username must be at least 3 characters long' }
  ],
  password: [
    { required: true, message: 'Password is required' },
    { minLength: 6, message: 'Password must be at least 6 characters long' }
  ]
}

// ===================================
// LOGIN COMPONENT
// ===================================

function Login(): React.JSX.Element {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, error: authError, isLoading, clearError } = useAuth()

  // Get the redirect path from location state (set by ProtectedRoute)
  const from = (location.state as { from?: string })?.from || ROUTES.DASHBOARD

  // Form state
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: ''
  })

  // Error state
  const [errors, setErrors] = useState<FormErrors>({})

  // Validation helper function
  const validateField = (fieldName: keyof LoginFormData, value: string): string | null => {
    const rules = validationRules[fieldName]
    
    for (const rule of rules) {
      if (rule.required && !value.trim()) {
        return rule.message
      }
      
      if (rule.minLength && value.length < rule.minLength) {
        return rule.message
      }
      
      if (rule.pattern && !rule.pattern.test(value)) {
        return rule.message
      }
    }
    
    return null
  }

  // Validate entire form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    let isValid = true

    // Validate each field
    Object.keys(formData).forEach((key) => {
      const fieldName = key as keyof LoginFormData
      const error = validateField(fieldName, formData[fieldName])
      
      if (error) {
        newErrors[fieldName] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }

  // Handle input changes with real-time validation
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target
    const fieldName = name as keyof LoginFormData

    // Update form data
    setFormData(prevData => ({
      ...prevData,
      [fieldName]: value
    }))

    // Clear field error if it exists
    if (errors[fieldName]) {
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors }
        delete newErrors[fieldName]
        return newErrors
      })
    }

    // Clear general error when user starts typing
    if (errors.general) {
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors }
        delete newErrors.general
        return newErrors
      })
    }
  }

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    // Clear any previous errors
    setErrors({})
    clearError()
    
    try {
      console.log('🔐 Submitting login form for user:', formData.username)
      console.log('📍 Will redirect to:', from)
      
      // Call the authentication service
      await login({
        username: formData.username,
        password: formData.password
      })
      
      console.log('✅ Login successful, redirecting to:', from)
      
      // Redirect to the originally requested page or dashboard
      navigate(from, { replace: true })
      
    } catch (error) {
      console.error('❌ Login form submission failed:', error)
      
      // Error is already handled by auth context, but we can add form-specific handling
      setErrors({
        general: authError || 'Login failed. Please check your credentials and try again.'
      })
    }
  }

  // Helper function to get input classes based on validation state
  const getInputClasses = (fieldName: keyof FormErrors): string => {
    const baseClass = styles.input
    const errorClass = errors[fieldName] ? styles.inputError : ''
    
    return `${baseClass} ${errorClass}`.trim()
  }

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <header className={styles.header}>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>Sign in to your account</p>
          
          {/* Show redirect notification if coming from protected route */}
          {from !== ROUTES.DASHBOARD && (
            <div className={styles.redirectNotice}>
              🔐 Please sign in to access the requested page
            </div>
          )}
        </header>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          {/* General Error Message */}
          {errors.general && (
            <div className={styles.errorBanner} role="alert">
              {errors.general}
            </div>
          )}

          {/* Username Field */}
          <div className={styles.formGroup}>
            <label htmlFor="username" className={styles.label}>
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
              className={getInputClasses('username')}
              placeholder="Enter your username"
              required
              aria-describedby={errors.username ? 'username-error' : undefined}
              autoComplete="username"
            />
            {errors.username && (
              <div id="username-error" className={styles.errorMessage} role="alert">
                {errors.username}
              </div>
            )}
          </div>

          {/* Password Field */}
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              className={getInputClasses('password')}
              placeholder="Enter your password"
              required
              aria-describedby={errors.password ? 'password-error' : undefined}
              autoComplete="current-password"
            />
            {errors.password && (
              <div id="password-error" className={styles.errorMessage} role="alert">
                {errors.password}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
            aria-label={isLoading ? 'Signing in...' : 'Sign in to your account'}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Footer Links */}
        <footer className={styles.footer}>
          <p className={styles.footerText}>
            Don't have an account?{' '}
            <Link to={ROUTES.SIGNUP} className={styles.footerLink}>
              Sign up here
            </Link>
          </p>
          
          <p className={styles.footerText} style={{ marginTop: 'var(--spacing-4)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>
            💡 Enter your TradeCloud credentials to login
          </p>
        </footer>
      </div>
    </div>
  )
}

export default Login 