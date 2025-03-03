import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.LOOPS_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      subscribed: true,
    }),
  };

  try {
    const response = await fetch(
      'https://app.loops.so/api/v1/contacts/create',
      options,
    );
    const data = await response.json();

    if (response.ok) {
      return NextResponse.json(
        { message: 'Successfully joined the waitlist', data },
        { status: 200 },
      );
    } else {
      return NextResponse.json({ error: data }, { status: 500 });
    }
  } catch (error) {
    const errorMessage = (error as Error).message;
    return NextResponse.json(
      { error: 'An error occurred', details: errorMessage },
      { status: 500 },
    );
  }
}
