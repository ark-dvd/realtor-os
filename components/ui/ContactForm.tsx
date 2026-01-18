'use client'

// ═══════════════════════════════════════════════════════════════════════════
// CONTACT FORM COMPONENT
// Reusable contact form with validation
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { cn, isValidEmail, isValidPhone } from '@/lib/utils'

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface ContactFormProps {
  propertyTitle?: string
  propertyId?: string
  agentEmail?: string
  variant?: 'default' | 'compact' | 'inline'
  className?: string
  onSuccess?: () => void
}

interface FormData {
  name: string
  email: string
  phone: string
  message: string
  propertyInterest?: string
}

interface FormErrors {
  name?: string
  email?: string
  phone?: string
  message?: string
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function ContactForm({
  propertyTitle,
  propertyId,
  agentEmail,
  variant = 'default',
  className,
  onSuccess,
}: ContactFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: propertyTitle ? `I'm interested in ${propertyTitle}` : '',
    propertyInterest: propertyId,
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  // Validate form
  const validate = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (formData.phone && !isValidPhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error on change
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return

    setStatus('submitting')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          agentEmail,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      setStatus('success')
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        propertyInterest: undefined,
      })
      onSuccess?.()
    } catch (error) {
      setStatus('error')
      setErrorMessage('Failed to send message. Please try again.')
    }
  }

  const isCompact = variant === 'compact'

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className={cn('space-y-5', className)}
    >
      {/* Success Message */}
      {status === 'success' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-3 p-4 bg-green-50 text-green-700 rounded-sm"
        >
          <CheckCircle size={20} />
          <p>Thank you! Your message has been sent. We&apos;ll be in touch soon.</p>
        </motion.div>
      )}

      {/* Error Message */}
      {status === 'error' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-sm"
        >
          <AlertCircle size={20} />
          <p>{errorMessage}</p>
        </motion.div>
      )}

      {status !== 'success' && (
        <>
          {/* Name & Email Row */}
          <div className={cn('grid gap-5', !isCompact && 'md:grid-cols-2')}>
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-neutral-slate mb-2">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={cn(
                  'w-full px-4 py-3 bg-white border rounded-sm transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-accent-gold/30 focus:border-accent-gold',
                  errors.name ? 'border-red-500' : 'border-neutral-pearl'
                )}
                placeholder="Your name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-slate mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={cn(
                  'w-full px-4 py-3 bg-white border rounded-sm transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-accent-gold/30 focus:border-accent-gold',
                  errors.email ? 'border-red-500' : 'border-neutral-pearl'
                )}
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-neutral-slate mb-2">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={cn(
                'w-full px-4 py-3 bg-white border rounded-sm transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-accent-gold/30 focus:border-accent-gold',
                errors.phone ? 'border-red-500' : 'border-neutral-pearl'
              )}
              placeholder="(555) 123-4567"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
            )}
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-neutral-slate mb-2">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={isCompact ? 3 : 5}
              className={cn(
                'w-full px-4 py-3 bg-white border rounded-sm transition-colors resize-none',
                'focus:outline-none focus:ring-2 focus:ring-accent-gold/30 focus:border-accent-gold',
                errors.message ? 'border-red-500' : 'border-neutral-pearl'
              )}
              placeholder="How can we help you?"
            />
            {errors.message && (
              <p className="mt-1 text-sm text-red-500">{errors.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === 'submitting'}
            className={cn(
              'btn-accent w-full flex items-center justify-center gap-2',
              status === 'submitting' && 'opacity-70 cursor-not-allowed'
            )}
          >
            {status === 'submitting' ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send size={18} />
                <span>Send Message</span>
              </>
            )}
          </button>
        </>
      )}
    </motion.form>
  )
}

export default ContactForm
