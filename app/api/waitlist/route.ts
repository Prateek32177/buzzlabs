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
    // Check if contact already exists
    const checkContactResponse = await fetch(
      `https://app.loops.so/api/v1/contacts/find?email=${encodeURIComponent(email)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.LOOPS_API_KEY}`,
        },
      },
    );

    const contactData = await checkContactResponse.json();

    if (
      checkContactResponse.ok &&
      Array.isArray(contactData) &&
      contactData.length > 0
    ) {
      return NextResponse.json(
        { error: { message: 'You are already on the waitlist!' } },
        { status: 409 },
      );
    }

    const verificationToken = crypto.randomBytes(16).toString('hex');
    const baseUrl = process.env.PROD_URL || 'http://localhost:3000';
    const verificationUrl = `${baseUrl}/api/verify-email?email=${encodeURIComponent(email)}&token=${verificationToken}`;

    // Continue with the existing email sending logic...
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
        userData: {
          emailVerified: false,
        },
        addToAudience: true,
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
