import { NextRequest, NextResponse } from 'next/server'

// Email configuration - set these in Netlify environment variables:
// CONTACT_EMAIL_TO - The email address to receive contact form submissions
// SENDGRID_API_KEY - (Optional) SendGrid API key for sending emails
// RESEND_API_KEY - (Optional) Resend API key for sending emails

interface ContactFormData {
  name: string
  email: string
  phone?: string
  message: string
  interest: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json()

    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, and message are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Sanitize inputs
    const sanitizedData = {
      name: body.name.slice(0, 100).trim(),
      email: body.email.slice(0, 100).trim().toLowerCase(),
      phone: body.phone?.slice(0, 20).trim() || '',
      message: body.message.slice(0, 5000).trim(),
      interest: body.interest || 'other',
    }

    // Log the submission (always)
    console.log('Contact form submission:', {
      ...sanitizedData,
      timestamp: new Date().toISOString(),
    })

    // Try to send email if configured
    const recipientEmail = process.env.CONTACT_EMAIL_TO
    const sendGridKey = process.env.SENDGRID_API_KEY
    const resendKey = process.env.RESEND_API_KEY

    if (recipientEmail && sendGridKey) {
      // Send via SendGrid
      try {
        const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${sendGridKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            personalizations: [{ to: [{ email: recipientEmail }] }],
            from: { email: 'noreply@merravberko.com', name: 'Merrav Berko Website' },
            reply_to: { email: sanitizedData.email, name: sanitizedData.name },
            subject: `New Contact Form: ${sanitizedData.interest} - ${sanitizedData.name}`,
            content: [{
              type: 'text/html',
              value: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${sanitizedData.name}</p>
                <p><strong>Email:</strong> ${sanitizedData.email}</p>
                <p><strong>Phone:</strong> ${sanitizedData.phone || 'Not provided'}</p>
                <p><strong>Interest:</strong> ${sanitizedData.interest}</p>
                <hr>
                <p><strong>Message:</strong></p>
                <p>${sanitizedData.message.replace(/\n/g, '<br>')}</p>
              `
            }]
          })
        })

        if (!response.ok) {
          console.error('SendGrid error:', await response.text())
        }
      } catch (emailError) {
        console.error('Failed to send via SendGrid:', emailError)
      }
    } else if (recipientEmail && resendKey) {
      // Send via Resend
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Merrav Berko Website <noreply@merravberko.com>',
            to: [recipientEmail],
            reply_to: sanitizedData.email,
            subject: `New Contact Form: ${sanitizedData.interest} - ${sanitizedData.name}`,
            html: `
              <h2>New Contact Form Submission</h2>
              <p><strong>Name:</strong> ${sanitizedData.name}</p>
              <p><strong>Email:</strong> ${sanitizedData.email}</p>
              <p><strong>Phone:</strong> ${sanitizedData.phone || 'Not provided'}</p>
              <p><strong>Interest:</strong> ${sanitizedData.interest}</p>
              <hr>
              <p><strong>Message:</strong></p>
              <p>${sanitizedData.message.replace(/\n/g, '<br>')}</p>
            `
          })
        })

        if (!response.ok) {
          console.error('Resend error:', await response.text())
        }
      } catch (emailError) {
        console.error('Failed to send via Resend:', emailError)
      }
    } else {
      console.log('No email service configured. Set CONTACT_EMAIL_TO and SENDGRID_API_KEY or RESEND_API_KEY')
    }

    // Always return success (email is best-effort)
    return NextResponse.json({
      success: true,
      message: 'Thank you for your message. We will get back to you soon!',
    })

  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to process your request. Please try again.' },
      { status: 500 }
    )
  }
}
