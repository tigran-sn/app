import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTES } from '@/routes'
import styles from './Login.module.css'

// ===================================
// TYPESCRIPT INTERFACES & TYPES
// ===================================

interface LoginProps {
  // Props for future enhancements (onLogin callback, etc.)
}

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
// VALIDATION RULES
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
// MAIN COMPONENT
// ===================================

function Login(): React.JSX.Element {
  const navigate = useNavigate()
  const { login, error: authError, isLoading, clearError } = useAuth()

  // Form state
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: ''
  })

  // Error state
  const [errors, setErrors] = useState<FormErrors>({})

  // Validation helper function
  const validateField = (fieldName: keyof LoginFormData, value: string): string | undefined => {
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
    
    return undefined
  }

  // Validate entire form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    
    // Validate each field
    Object.entries(formData).forEach(([fieldName, value]) => {
      const error = validateField(fieldName as keyof LoginFormData, value)
      if (error) {
        newErrors[fieldName as keyof FormErrors] = error
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Event Handlers
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target
    
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: undefined
      }))
    }
  }

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
      
      // Call the authentication service
      await login({
        username: formData.username,
        password: formData.password
      })
      
      console.log('✅ Login successful, redirecting to home')
      
      // Redirect to home page after successful login
      navigate(ROUTES.HOME)
      
    } catch (error) {
      console.error('❌ Login form submission failed:', error)
      
      // Error is already handled by auth context, but we can add form-specific handling
      setErrors({
        general: authError || 'Login failed. Please check your credentials and try again.'
      })
    }
  }

  const handleForgotPassword = (): void => {
    console.log('Forgot password clicked')
    alert('Forgot password functionality will be implemented later!')
  }

  // Note: handleSignUp is no longer needed as we use Link component

  // Helper function to get input classes
  const getInputClasses = (fieldName: keyof FormErrors): string => {
    const baseClass = styles.input
    const errorClass = errors[fieldName] ? styles.error : ''
    
    return `${baseClass} ${errorClass}`.trim()
  }

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>
            Sign in to your account to continue your React learning journey
          </p>
        </div>

        {/* Login Form */}
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {/* General Error Message */}
          {errors.general && (
            <div className={styles.errorMessage} role="alert">
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

        {/* Footer */}
        <div className={styles.footer}>
          <p className={styles.footerText}>
            <button
              type="button"
              onClick={handleForgotPassword}
              className={styles.footerLink}
            >
              Forgot your password?
            </button>
          </p>
          <p className={styles.footerText}>
            Don't have an account?{' '}
            <Link to={ROUTES.SIGNUP} className={styles.footerLink}>
              Sign up here
            </Link>
          </p>
          <p className={styles.footerText} style={{ marginTop: 'var(--spacing-4)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>
            💡 Enter your TradeCloud credentials to login
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login 