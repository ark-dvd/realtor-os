import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // For now, just return success
    // In production, integrate with email service
    console.log('Contact form submission:', body)
    
    return NextResponse.json({
      success: true,
      message: 'Message received',
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
