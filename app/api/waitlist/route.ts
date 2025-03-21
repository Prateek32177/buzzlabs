import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  // Basic email validation
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test(email)) {
    return NextResponse.json(
      { error: 'Invalid email format' },
      { status: 400 },
    );
  }

  try {
    // Generate a simple verification token
    const verificationToken = crypto.randomBytes(16).toString('hex');

    // Create verification URL
    const baseUrl = process.env.VERCEL_URL || 'http://localhost:3000';
    const verificationUrl = `${baseUrl}/api/verify-email?email=${encodeURIComponent(email)}&token=${verificationToken}`;

    // Send verification email and create contact in one go
    const sendEmailOptions = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.LOOPS_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transactionalId: process.env.LOOPS_EMAIL_VERIFICATION_ID,
        email,
        dataVariables: {
          firstName: email.split('@')[0],
          productName: 'Hookflo',
          verificationUrl: verificationUrl,
        },
        addToAudience: true,
        userData: {
          emailVerified: false,
        },
      }),
    };

    const response = await fetch(
      'https://app.loops.so/api/v1/transactional',
      sendEmailOptions,
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to process request', details: data },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        message:
          'Successfully joined the waitlist. Please check your email to verify your waitlist signup',
        data: data,
      },
      { status: 200 },
    );
  } catch (error) {
    const errorMessage = (error as Error).message;
    return NextResponse.json(
      { error: 'An error occurred', details: errorMessage },
      { status: 500 },
    );
  }
}
