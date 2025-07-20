import { useState, useEffect } from 'react'
import styles from './Login.module.css'

// ===================================
// TYPESCRIPT INTERFACES & TYPES
// ===================================

interface LoginProps {
  // Props for future enhancements (onLogin callback, etc.)
}

interface LoginFormData {
  email: string
  password: string
}

interface FormErrors {
  email?: string
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
  email: ValidationRule[]
  password: ValidationRule[]
}

// ===================================
// VALIDATION RULES
// ===================================

const validationRules: ValidationRules = {
  email: [
    { required: true, message: 'Email is required' },
    { 
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
      message: 'Please enter a valid email address' 
    }
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
  // Form state
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  })

  // Error state
  const [errors, setErrors] = useState<FormErrors>({})

  // Loading state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

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
    
    setIsSubmitting(true)
    setErrors({})
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // For now, just log the form data
      console.log('Login attempt:', {
        email: formData.email,
        password: '***hidden***'
      })
      
      // Simulate different outcomes based on email
      if (formData.email === 'admin@example.com') {
        console.log('Login successful!')
        alert('Login successful! Welcome, admin!')
        // Future: Redirect to dashboard or update auth state
      } else {
        setErrors({
          general: 'Invalid email or password. Try admin@example.com'
        })
      }
      
    } catch (error) {
      console.error('Login error:', error)
      setErrors({
        general: 'An unexpected error occurred. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleForgotPassword = (): void => {
    console.log('Forgot password clicked')
    alert('Forgot password functionality will be implemented later!')
  }

  const handleSignUp = (): void => {
    console.log('Sign up clicked')
    alert('Sign up functionality will be implemented later!')
  }

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

          {/* Email Field */}
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className={getInputClasses('email')}
              placeholder="Enter your email"
              required
              aria-describedby={errors.email ? 'email-error' : undefined}
              autoComplete="email"
            />
            {errors.email && (
              <div id="email-error" className={styles.errorMessage} role="alert">
                {errors.email}
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
            disabled={isSubmitting}
            aria-label={isSubmitting ? 'Signing in...' : 'Sign in to your account'}
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
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
            <button
              type="button"
              onClick={handleSignUp}
              className={styles.footerLink}
            >
              Sign up here
            </button>
          </p>
          <p className={styles.footerText} style={{ marginTop: 'var(--spacing-4)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>
            💡 Try: admin@example.com with any password
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login 