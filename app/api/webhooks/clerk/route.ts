import { Webhook} from 'svix';
import { createClient } from '@supabase/supabase-js';
import { type NextRequest } from 'next/server';

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET as string;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string,
);

export async function POST(req: NextRequest): Promise<Response> {
  const payload = await req.text();
  const headers = Object.fromEntries(req.headers.entries());

  const wh = new Webhook(webhookSecret);

  let evt: { type: string; data: any };
  try {
    evt = wh.verify(payload, headers) as { type: string; data: any };
  } catch (err) {
    return new Response(JSON.stringify({ message: 'Webhook verification failed' }), {
      status: 400,
    });
  }

  const { type, data } = evt;

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

  return new Response(JSON.stringify({ message: 'Webhook processed' }), { status: 200 });
}

interface ClerkUser {
  id: string;
  email_addresses?: { email_address: string }[];
  user_name?: string;
  profile_image_url?: string;
  external_accounts?: { provider: string }[];
}

async function handleUserCreated(user: ClerkUser): Promise<void> {
  const { error } = await supabase.from('users').upsert({
    clerk_id: user.id,
    email: user.email_addresses?.[0]?.email_address || null,
    user_name: user.user_name || null,
    avatar_url: user.profile_image_url || null,
    provider: user.external_accounts?.[0]?.provider || 'email',
  });

  if (error) console.error('Error syncing user:', error);
}

async function handleUserUpdated(user: ClerkUser): Promise<void> {
  const { error } = await supabase
    .from('users')
    .update({
      email: user.email_addresses?.[0]?.email_address || null,
      user_name: user.user_name || null,
      avatar_url: user.profile_image_url || null,
      updated_at: new Date().toISOString(),
    })
    .eq('clerk_id', user.id);

  if (error) console.error('Error updating user:', error);
}

async function handleUserDeleted(user: ClerkUser): Promise<void> {
  const { error } = await supabase.from('users').delete().eq('clerk_id', user.id);

  if (error) console.error('Error deleting user:', error);
}
