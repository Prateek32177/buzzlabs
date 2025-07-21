import { Webhook } from 'svix';
import { createClient } from '@supabase/supabase-js';
import { type NextRequest } from 'next/server';

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET as string;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const payload = await req.text();
    const headers = Object.fromEntries(req.headers.entries());

    const wh = new Webhook(webhookSecret);
    let evt: { type: string; data: any };

    try {
      evt = wh.verify(payload, headers) as { type: string; data: any };
    } catch (err) {
      console.error('Webhook verification failed:', err);
      return new Response('Webhook verification failed', { status: 400 });
    }

    const { type, data } = evt;

    // Early return for irrelevant events to save processing
    if (!['user.created', 'user.updated', 'user.deleted'].includes(type)) {
      return new Response('OK', { status: 200 });
    }

    // Process only relevant events
    switch (type) {
      case 'user.created':
        await handleUserCreated(data);
        break;
      case 'user.updated':
        await handleUserUpdated(data);
        break;
      case 'user.deleted':
        await handleUserDeleted(data);
        break;
    }

    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

// Enhanced interface to match Clerk webhook payload structure
interface ClerkUser {
  id: string;
  email_addresses?: Array<{
    email_address: string;
    id: string;
    verification?: {
      status: 'verified' | 'unverified';
    };
  }>;
  phone_numbers?: Array<{
    phone_number: string;
    id: string;
    verification?: {
      status: 'verified' | 'unverified';
    };
  }>;
  username?: string;
  first_name?: string;
  last_name?: string;
  image_url?: string;
  external_accounts?: Array<{
    provider: string;
    email_address?: string;
  }>;
  created_at?: number;
  updated_at?: number;
}

async function handleUserCreated(user: ClerkUser): Promise<void> {
  try {
    const primaryEmail = user.email_addresses?.[0]?.email_address;
    const provider = user.external_accounts?.[0]?.provider || 'email';

    if (!primaryEmail) {
      console.error('No email found for user:', user.id);
      return;
    }

    console.log('Creating user:', { id: user.id, email: primaryEmail });

    // Create user record matching your schema
    const { error } = await supabase.from('users').insert({
      id: crypto.randomUUID(), // Generate UUID for id field
      clerk_id: user.id,
      email: primaryEmail,
      first_name: user.first_name || null,
      last_name: user.last_name || null,
      avatar_url: user.image_url || null,
      provider: provider,
      phone: null, // Clerk doesn't provide phone in basic webhook
      email_verified:
        user.email_addresses?.[0]?.verification?.status === 'verified' || false,
      phone_verified: false,
      metadata: {
        username: user.username,
        clerk_created_at: user.created_at,
        clerk_updated_at: user.updated_at,
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_sign_in_at: null, // Will be updated on sign-in events
    });

    if (error) {
      console.error('Error creating user:', error);
      throw error;
    }

    console.log('User created successfully:', user.id);
  } catch (error) {
    console.error('Failed to create user:', error);
    throw error;
  }
}

async function handleUserUpdated(user: ClerkUser): Promise<void> {
  try {
    const primaryEmail = user.email_addresses?.[0]?.email_address;

    if (!primaryEmail) {
      console.error('No email found for user update:', user.id);
      return;
    }

    console.log('Updating user:', { id: user.id, email: primaryEmail });

    const { error } = await supabase
      .from('users')
      .update({
        email: primaryEmail,
        first_name: user.first_name || null,
        last_name: user.last_name || null,
        avatar_url: user.image_url || null,
        email_verified:
          user.email_addresses?.[0]?.verification?.status === 'verified' ||
          false,
        metadata: {
          username: user.username,
          clerk_created_at: user.created_at,
          clerk_updated_at: user.updated_at,
        },
        updated_at: new Date().toISOString(),
      })
      .eq('clerk_id', user.id);

    if (error) {
      console.error('Error updating user:', error);
      throw error;
    }

    console.log('User updated successfully:', user.id);
  } catch (error) {
    console.error('Failed to update user:', error);
    throw error;
  }
}

async function handleUserDeleted(user: ClerkUser): Promise<void> {
  try {
    console.log('Deleting user:', user.id);

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('clerk_id', user.id);

    if (error) {
      console.error('Error deleting user:', error);
      throw error;
    }

    console.log('User deleted successfully:', user.id);
  } catch (error) {
    console.error('Failed to delete user:', error);
    throw error;
  }
}
