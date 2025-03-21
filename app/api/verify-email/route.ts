import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  if (!token || !email) {
    return NextResponse.redirect(new URL('/verification-failed', req.url));
  }

  try {
    // Update the user's status in Loops to verified
    const options = {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${process.env.LOOPS_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        // Update verification status in user data
        userData: {
          emailVerified: true,
        },
      }),
    };

    const response = await fetch(
      'https://app.loops.so/api/v1/contacts/update',
      options,
    );

    if (!response.ok) {
      return NextResponse.redirect(new URL('/verification-failed', req.url));
    }

    // Redirect to success page
    return NextResponse.redirect(new URL('/verification-success', req.url));
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.redirect(new URL('/verification-failed', req.url));
  }
}
