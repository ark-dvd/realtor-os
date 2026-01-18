// ═══════════════════════════════════════════════════════════════════════════
// CONTACT API ROUTE
// Handles contact form submissions
// ═══════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server'
import type { ApiResponse } from '@/lib/types'

interface ContactSubmission {
  name: string
  email: string
  phone?: string
  message: string
  propertyInterest?: string
  agentEmail?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactSubmission = await request.json()

    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Get domain for tenant context
    const domain = request.headers.get('x-tenant-domain') ||
                   request.headers.get('x-forwarded-host')?.replace(/:\d+$/, '').replace(/^www\./, '') ||
                   'unknown'

    // In a real implementation, you would:
    // 1. Send email via provider (SendGrid, Mailgun, etc.)
    // 2. Store submission in database
    // 3. Trigger notifications

    // For now, log the submission
    console.log('Contact form submission:', {
      ...body,
      domain,
      timestamp: new Date().toISOString(),
    })

    // Example: Send email (uncomment and configure)
    /*
    const emailResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: body.agentEmail || process.env.DEFAULT_AGENT_EMAIL }],
        }],
        from: { email: 'noreply@realtoros.com', name: 'RealtorOS' },
        subject: `New Contact: ${body.name}`,
        content: [{
          type: 'text/html',
          value: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${body.name}</p>
            <p><strong>Email:</strong> ${body.email}</p>
            <p><strong>Phone:</strong> ${body.phone || 'Not provided'}</p>
            <p><strong>Message:</strong></p>
            <p>${body.message}</p>
            ${body.propertyInterest ? `<p><strong>Property Interest:</strong> ${body.propertyInterest}</p>` : ''}
          `,
        }],
      }),
    })
    
    if (!emailResponse.ok) {
      throw new Error('Failed to send email')
    }
    */

    return NextResponse.json<ApiResponse<{ submitted: boolean }>>({
      success: true,
      data: { submitted: true },
      message: 'Message sent successfully',
    })
  } catch (error) {
    console.error('Error processing contact form:', error)
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Failed to process submission' },
      { status: 500 }
    )
  }
}
