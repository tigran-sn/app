import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/routes'
import styles from './SignUp.module.css'

// ===================================
// TYPESCRIPT INTERFACES & TYPES
// ===================================

interface SignUpProps {
  // Props for future enhancements (onSignUp callback, etc.)
}

interface SignUpFormData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  agreeToTerms: boolean
}

interface FormErrors {
  firstName?: string
  lastName?: string
  email?: string
  password?: string
  confirmPassword?: string
  agreeToTerms?: string
  general?: string
}

interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  message: string
}

interface ValidationRules {
  firstName: ValidationRule[]
  lastName: ValidationRule[]
  email: ValidationRule[]
  password: ValidationRule[]
  confirmPassword: ValidationRule[]
  agreeToTerms: ValidationRule[]
}

type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong'

// ===================================
// VALIDATION RULES
// ===================================

const validationRules: ValidationRules = {
  firstName: [
    { required: true, message: 'First name is required' },
    { minLength: 2, message: 'First name must be at least 2 characters' },
    { maxLength: 30, message: 'First name must be less than 30 characters' }
  ],
  lastName: [
    { required: true, message: 'Last name is required' },
    { minLength: 2, message: 'Last name must be at least 2 characters' },
    { maxLength: 30, message: 'Last name must be less than 30 characters' }
  ],
  email: [
    { required: true, message: 'Email is required' },
    { 
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
      message: 'Please enter a valid email address' 
    }
  ],
  password: [
    { required: true, message: 'Password is required' },
    { minLength: 8, message: 'Password must be at least 8 characters long' },
    { 
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' 
    }
  ],
  confirmPassword: [
    { required: true, message: 'Please confirm your password' }
  ],
  agreeToTerms: [
    { required: true, message: 'You must agree to the terms and conditions' }
  ]
}

// ===================================
// UTILITY FUNCTIONS
// ===================================

const calculatePasswordStrength = (password: string): PasswordStrength => {
  let score = 0
  
  if (password.length >= 8) score++
  if (/[a-z]/.test(password)) score++
  if (/[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^a-zA-Z\d]/.test(password)) score++
  
  if (score < 2) return 'weak'
  if (score < 3) return 'fair'
  if (score < 4) return 'good'
  return 'strong'
}

const getPasswordStrengthText = (strength: PasswordStrength): string => {
  const texts = {
    weak: 'Weak - Add more characters and variety',
    fair: 'Fair - Add uppercase, numbers, or symbols',
    good: 'Good - Consider adding special characters',
    strong: 'Strong - Great password!'
  }
  return texts[strength]
}

// ===================================
// MAIN COMPONENT
// ===================================

function SignUp(): React.JSX.Element {
  // Form state
  const [formData, setFormData] = useState<SignUpFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  })

  // Error state
  const [errors, setErrors] = useState<FormErrors>({})

  // Loading state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  // Password strength
  const passwordStrength = calculatePasswordStrength(formData.password)

  // Validation helper function
  const validateField = (fieldName: keyof SignUpFormData, value: string | boolean): string | undefined => {
    const rules = validationRules[fieldName]
    
    for (const rule of rules) {
      if (rule.required && (!value || (typeof value === 'string' && !value.trim()))) {
        return rule.message
      }
      
      if (typeof value === 'string') {
        if (rule.minLength && value.length < rule.minLength) {
          return rule.message
        }
        
        if (rule.maxLength && value.length > rule.maxLength) {
          return rule.message
        }
        
        if (rule.pattern && !rule.pattern.test(value)) {
          return rule.message
        }
      }
    }
    
    // Special validation for confirm password
    if (fieldName === 'confirmPassword' && formData.password !== value) {
      return 'Passwords do not match'
    }
    
    return undefined
  }

  // Validate entire form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    
    // Validate each field
    Object.entries(formData).forEach(([fieldName, value]) => {
      const error = validateField(fieldName as keyof SignUpFormData, value)
      if (error) {
        newErrors[fieldName as keyof FormErrors] = error
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Event Handlers
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value, type, checked } = event.target
    
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors }
        delete newErrors[name as keyof FormErrors]
        return newErrors
      })
    }
    
    // Also clear confirm password error when password changes
    if (name === 'password' && errors.confirmPassword) {
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors }
        delete newErrors.confirmPassword
        return newErrors
      })
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
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // For now, just log the form data
      console.log('Sign up attempt:', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: '***hidden***',
        agreeToTerms: formData.agreeToTerms
      })
      
      // Simulate different outcomes
      if (formData.email === 'test@example.com') {
        setErrors({
          general: 'This email is already registered. Please use a different email or sign in.'
        })
      } else {
        console.log('Sign up successful!')
        alert(`Welcome, ${formData.firstName}! Your account has been created successfully!`)
        // Future: Redirect to dashboard or login
      }
      
    } catch (error) {
      console.error('Sign up error:', error)
      setErrors({
        general: 'An unexpected error occurred. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Helper function to get input classes
  const getInputClasses = (fieldName: keyof FormErrors): string => {
    const baseClass = styles.input
    const errorClass = errors[fieldName] ? styles.error : ''
    const successClass = !errors[fieldName] && formData[fieldName as keyof SignUpFormData] && fieldName !== 'agreeToTerms' ? styles.success : ''
    
    return `${baseClass} ${errorClass} ${successClass}`.trim()
  }

  // Helper function to get strength meter classes
  const getStrengthMeterClasses = (): string => {
    const baseClass = styles.strengthFill
    const strengthClass = styles[passwordStrength]
    
    return `${baseClass} ${strengthClass}`.trim()
  }

  // Helper function to get strength text classes
  const getStrengthTextClasses = (): string => {
    const baseClass = styles.strengthText
    const strengthClass = styles[passwordStrength]
    
    return `${baseClass} ${strengthClass}`.trim()
  }

  return (
    <div className={styles.container}>
      <div className={styles.signUpCard}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.subtitle}>
            Join us today and start your React learning adventure
          </p>
        </div>

        {/* Sign Up Form */}
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {/* General Error Message */}
          {errors.general && (
            <div className={styles.errorMessage} role="alert">
              {errors.general}
            </div>
          )}

          {/* Name Fields Row */}
          <div className={styles.formRow}>
            {/* First Name Field */}
            <div className={styles.formGroup}>
              <label htmlFor="firstName" className={styles.label}>
                First Name<span className={styles.required}>*</span>
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleInputChange}
                className={getInputClasses('firstName')}
                placeholder="John"
                required
                aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                autoComplete="given-name"
              />
              {errors.firstName && (
                <div id="firstName-error" className={styles.errorMessage} role="alert">
                  {errors.firstName}
                </div>
              )}
            </div>

            {/* Last Name Field */}
            <div className={styles.formGroup}>
              <label htmlFor="lastName" className={styles.label}>
                Last Name<span className={styles.required}>*</span>
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleInputChange}
                className={getInputClasses('lastName')}
                placeholder="Doe"
                required
                aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                autoComplete="family-name"
              />
              {errors.lastName && (
                <div id="lastName-error" className={styles.errorMessage} role="alert">
                  {errors.lastName}
                </div>
              )}
            </div>
          </div>

          {/* Email Field */}
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="email" className={styles.label}>
              Email Address<span className={styles.required}>*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className={getInputClasses('email')}
              placeholder="john.doe@example.com"
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
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="password" className={styles.label}>
              Password<span className={styles.required}>*</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              className={getInputClasses('password')}
              placeholder="Create a strong password"
              required
              aria-describedby={errors.password ? 'password-error' : 'password-strength'}
              autoComplete="new-password"
            />
            {errors.password && (
              <div id="password-error" className={styles.errorMessage} role="alert">
                {errors.password}
              </div>
            )}
            
            {/* Password Strength Indicator */}
            {formData.password && (
              <div id="password-strength" className={styles.passwordStrength}>
                <div className={styles.strengthMeter}>
                  <div className={getStrengthMeterClasses()}></div>
                </div>
                <div className={getStrengthTextClasses()}>
                  {getPasswordStrengthText(passwordStrength)}
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="confirmPassword" className={styles.label}>
              Confirm Password<span className={styles.required}>*</span>
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={getInputClasses('confirmPassword')}
              placeholder="Confirm your password"
              required
              aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <div id="confirmPassword-error" className={styles.errorMessage} role="alert">
                {errors.confirmPassword}
              </div>
            )}
          </div>

          {/* Terms and Conditions Checkbox */}
          <div className={styles.checkbox}>
            <input
              id="agreeToTerms"
              name="agreeToTerms"
              type="checkbox"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
              className={styles.checkboxInput}
              required
              aria-describedby={errors.agreeToTerms ? 'agreeToTerms-error' : undefined}
            />
            <label htmlFor="agreeToTerms" className={styles.checkboxLabel}>
              I agree to the{' '}
              <a href="#" onClick={(e) => { e.preventDefault(); alert('Terms & Conditions will be implemented later!') }}>
                Terms & Conditions
              </a>
              {' '}and{' '}
              <a href="#" onClick={(e) => { e.preventDefault(); alert('Privacy Policy will be implemented later!') }}>
                Privacy Policy
              </a>
              <span className={styles.required}>*</span>
            </label>
          </div>
          {errors.agreeToTerms && (
            <div id="agreeToTerms-error" className={styles.errorMessage} role="alert">
              {errors.agreeToTerms}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
            aria-label={isSubmitting ? 'Creating account...' : 'Create your account'}
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Footer */}
        <div className={styles.footer}>
          <p className={styles.footerText}>
            Already have an account?{' '}
            <Link to={ROUTES.LOGIN} className={styles.footerLink}>
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignUp 